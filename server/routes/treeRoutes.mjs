import express from 'express';
import pool from '../db.js';
//import { readFile, writeFile } from 'fs/promises';
//import path from 'path';
//import { fileURLToPath } from 'url';

//const __filename = fileURLToPath(import.meta.url);
//const __dirname = path.dirname(__filename);
//const filePath = path.join(__dirname, '../data/treeData.json');

const router = express.Router();

//const getTreeData = async () => {
    //const jsonData = await readFile(filePath, 'utf-8');
    //return JSON.parse(jsonData);
//};

//const saveTreeData = async (data) => {
    //await writeFile(filePath, JSON.stringify(data, null, 2));
//};

// Test route to check API status
router.get('/test', (req, res) => {
    res.json({ message: "Tree API is working with PostgreSQL!" });
});

// GET: Fetch Entire Quran Reading Plan
router.get('/', async (req, res) => {
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
    
        res.json(treeData);
      } catch (error) {
        console.error("Error fetching Quran Reading Plan:", error);
        res.status(500).json({ error: "Failed to fetch data" });
      }
    });

// GET: Fetch a Specific Day
router.get('/:id', async (req, res) => {
    try {
        const dayId = parseInt(req.params.id);
        const day = await pool.query('SELECT * FROM days WHERE id = $1', [dayId]);
        const goals = await pool.query('SELECT * FROM goals WHERE day_id = $1', [dayId]);
    
        if (day.rows.length === 0) {
          return res.status(404).json({ error: "Day not found" });
        }
    
        res.json({
          ...day.rows[0],
          children: goals.rows
        });
      } catch (error) {
        console.error("Error fetching day data:", error);
        res.status(500).json({ error: "Failed to fetch day data" });
      }
    });

// POST: Add a Custom Reading Goal
router.post('/:id', async (req, res) => {
    try {
        const { customGoal } = req.body;
        const dayId = parseInt(req.params.id);
    
        const newGoal = await pool.query(
          'INSERT INTO goals (day_id, name) VALUES ($1, $2) RETURNING *',
          [dayId, customGoal]
        );
    
        res.status(201).json({ message: "Goal added!", newGoal: newGoal.rows[0] });
      } catch (error) {
        console.error("Error adding goal:", error);
        res.status(500).json({ error: "Failed to add goal" });
      }
    });
    

// PUT: Update a Specific Day's Reading Progress
router.put('/:id', async (req, res) => {
    try {
        const { name } = req.body;
        const dayId = parseInt(req.params.id);
    
        await pool.query('UPDATE days SET name = $1 WHERE id = $2', [name, dayId]);
    
        res.json({ message: "Day updated successfully!" });
      } catch (error) {
        console.error("Error updating day:", error);
        res.status(500).json({ error: "Failed to update day" });
      }
    });
    

// DELETE: Remove a Reading Goal
router.delete('/:dayId/:goalId', async (req, res) => {
    try {
        const dayId = parseInt(req.params.dayId);
        const goalId = parseInt(req.params.goalId);
    
        await pool.query('DELETE FROM goals WHERE id = $1 AND day_id = $2', [goalId, dayId]);
    
        res.json({ message: "Goal removed!" });
      } catch (error) {
        console.error("Error removing goal:", error);
        res.status(500).json({ error: "Failed to remove goal" });
      }
    });

export default router;
