import express from 'express';
import Tree from '../models/Tree.mjs';

const router = express.Router();

// GET: Fetch Entire Quran Reading Plan
router.get('/', async (req, res) => {
    try {
        const treeData = await Tree.getAll();
        res.json(treeData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET: Fetch a Specific Day
router.get('/:id', async (req, res) => {
    try {
        const day = await Tree.getById(parseInt(req.params.id));
        res.json(day);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

// POST: Add a Custom Reading Goal
router.post('/:id', async (req, res) => {
    try {
        const { customGoal } = req.body;
        const dayId = parseInt(req.params.id);

        if (!customGoal) {
            return res.status(400).json({ error: "Missing 'customGoal' in request body." });
        }

        const newGoal = await Tree.addGoal(dayId, customGoal);
        res.status(201).json({ message: "Goal added!", newGoal });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// PUT: Update a Specific Day's Name
router.put('/:id', async (req, res) => {
    try {
        const { name } = req.body;
        const dayId = parseInt(req.params.id);

        if (!name) {
            return res.status(400).json({ error: "Missing 'name' in request body." });
        }

        const response = await Tree.updateDay(dayId, name);
        res.json(response);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE: Remove a Reading Goal
router.delete('/:dayId/:goalId', async (req, res) => {
    try {
        const dayId = parseInt(req.params.dayId);
        const goalId = parseInt(req.params.goalId);

        const response = await Tree.deleteGoal(dayId, goalId);
        res.json(response);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

export default router;
 