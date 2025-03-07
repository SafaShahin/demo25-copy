import express from 'express';
import { readFile, writeFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const filePath = path.join(__dirname, '../data/treeData.json');

const router = express.Router();

// Function: read tree data
const getTreeData = async () => {
    const jsonData = await readFile(filePath, 'utf-8');
    return JSON.parse(jsonData);
};

// Function to save tree data
const saveTreeData = async (data) => {
    await writeFile(filePath, JSON.stringify(data, null, 2));
};

// Test route to check API status
router.get('/test', (req, res) => {
    res.json({ message: "Tree API is working!" });
});

// GET: Fetch Entire Quran Reading Plan
router.get('/', async (req, res) => {
    try {
        const treeData = await getTreeData();
        res.json(treeData);
    } catch (error) {
        console.error("Error loading Quran Reading Plan:", error);
        res.status(500).json({ error: "Failed to load Quran Reading Plan" });
    }
});

// GET: Fetch a Specific Day
router.get('/:id', async (req, res) => {
    try {
        const treeData = await getTreeData();
        const dayId = parseInt(req.params.id);
        const day = treeData.children.find(d => d.id === dayId);

        if (!day) {
            return res.status(404).json({ error: "Day not found" });
        }
        res.json(day);
    } catch (error) {
        console.error("Error fetching day data:", error);
        res.status(500).json({ error: "Failed to fetch day data" });
    }
});

// PUT: Update a Specific Day's Reading Progress
router.put('/:id', async (req, res) => {
    try {
        const treeData = await getTreeData();
        const dayId = parseInt(req.params.id);
        const { completedPages } = req.body;

        if (!completedPages) {
            return res.status(400).json({ error: "Missing completedPages in request body" });
        }

        const day = treeData.children.find(d => d.id === dayId);
        if (!day) {
            return res.status(404).json({ error: "Day not found" });
        }

        day.completedPages = completedPages;
        await saveTreeData(treeData);

        res.json({ message: "Progress updated!", day });
    } catch (error) {
        console.error("Error updating progress:", error);
        res.status(500).json({ error: "Failed to update progress" });
    }
});

// POST: Add a Custom Reading Goal
router.post('/:id', async (req, res) => {
    try {
        const treeData = await getTreeData();
        const dayId = parseInt(req.params.id);
        const { customGoal } = req.body;

        if (!customGoal) {
            return res.status(400).json({ error: "Missing customGoal in request body" });
        }

        const day = treeData.children.find(d => d.id === dayId);
        if (!day) {
            return res.status(404).json({ error: "Day not found" });
        }

        const newGoal = { id: Date.now(), name: customGoal };
        if (!day.children) {
            day.children = [];
        }
        day.children.push(newGoal);
        await saveTreeData(treeData);

        res.status(201).json({ message: "Goal added!", newGoal });
    } catch (error) {
        console.error("Error adding goal:", error);
        res.status(500).json({ error: "Failed to add goal" });
    }
});

// DELETE: Remove a Reading Goal
router.delete('/:dayId/:goalId', async (req, res) => {
    try {
        const treeData = await getTreeData();
        const dayId = parseInt(req.params.dayId);
        const goalId = parseInt(req.params.goalId);

        const day = treeData.children.find(d => d.id === dayId);
        if (!day) {
            return res.status(404).json({ error: "Day not found" });
        }

        const initialLength = day.children.length;
        day.children = day.children.filter(goal => goal.id !== goalId);

        if (day.children.length === initialLength) {
            return res.status(404).json({ error: "Goal not found" });
        }

        await saveTreeData(treeData);
        res.json({ message: "Goal removed!", remainingGoals: day.children });
    } catch (error) {
        console.error("Error removing goal:", error);
        res.status(500).json({ error: "Failed to remove goal" });
    }
});

export default router;
