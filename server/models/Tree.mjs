import pool from '../db.js';

const CACHE_TTL = 5 * 60 * 1000; // Cache expires after 5 minutes
const cache = new Map(); // In-memory cache

class Tree {
    // Clear Cache
    static clearCache() {
        cache.clear();  // Clears all cached data
    }

    // Fetch all days and goals
    static async getAll() {
        const cacheKey = "treeData";

        // If cache exists
        if (cache.has(cacheKey)) {
            const { data, timestamp } = cache.get(cacheKey);
            const isExpired = Date.now() - timestamp > CACHE_TTL;
            if (!isExpired) return data; // Serve from cache if not expired
        }

        try {
            const days = await pool.query('SELECT * FROM days');
            const goals = await pool.query('SELECT * FROM goals');

            const treeData = {
                id: 1,
                name: "Ramadan Quran Reading Plan",
                children: days.rows.map(day => ({
                    ...day,
                    children: goals.rows.filter(goal => goal.day_id === day.id),
                })),
            };

            // Store in cache with timestamp
            cache.set(cacheKey, { data: treeData, timestamp: Date.now() });

            return treeData;
        } catch (error) {
            console.error("Database error (getAll):", error);
            throw new Error("Failed to fetch Quran reading plan.");
        }
    }

    // Fetch a single day
    static async getById(id) {
        const cacheKey = `day_${id}`;

        // If cache exists
        if (cache.has(cacheKey)) {
            const { data, timestamp } = cache.get(cacheKey);
            const isExpired = Date.now() - timestamp > CACHE_TTL;
            if (!isExpired) return data; // Serve from cache if not expired
        }

        try {
            const day = await pool.query('SELECT * FROM days WHERE id = $1', [id]);
            const goals = await pool.query('SELECT * FROM goals WHERE day_id = $1', [id]);

            if (day.rows.length === 0) {
                throw new Error("Day not found");
            }

            const dayData = {
                ...day.rows[0],
                children: goals.rows
            };

            // Store in cache with timestamp
            cache.set(cacheKey, { data: dayData, timestamp: Date.now() });

            return dayData;
        } catch (error) {
            console.error("Database error (getById):", error);
            throw new Error("Failed to fetch day data.");
        }
    }

    // Add a new goal to a specific day
    static async addGoal(dayId, customGoal) {
        try {
            const newGoal = await pool.query(
                'INSERT INTO goals (day_id, name) VALUES ($1, $2) RETURNING *',
                [dayId, customGoal]
            );

            Tree.clearCache(); // Clear cache after update

            return newGoal.rows[0];
        } catch (error) {
            console.error("Database error (addGoal):", error);
            throw new Error("Failed to add goal.");
        }
    }

    // Update a day's name
    static async updateDay(id, name) {
        try {
            await pool.query('UPDATE days SET name = $1 WHERE id = $2', [name, id]);

            Tree.clearCache(); // Clear cache after update

            return { message: "Day updated successfully!" };
        } catch (error) {
            console.error("Database error (updateDay):", error);
            throw new Error("Failed to update day.");
        }
    }

    // Delete a specific goal from a day
    static async deleteGoal(dayId, goalId) {
        try {
            const result = await pool.query(
                'DELETE FROM goals WHERE id = $1 AND day_id = $2 RETURNING *',
                [goalId, dayId]
            );

            if (result.rowCount === 0) {
                throw new Error("Goal not found.");
            }

            Tree.clearCache(); // Clear cache after update

            return { message: "Goal removed!" };
        } catch (error) {
            console.error("Database error (deleteGoal):", error);
            throw new Error("Failed to remove goal.");
        }
    }
}

export default Tree;
