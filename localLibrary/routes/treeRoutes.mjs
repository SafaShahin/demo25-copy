import express from 'express';
import { treeData } from "../data/treeData.mjs";

const router = express.Router();

// Ensure all requests parse JSON bodies
router.use(express.json());

//  Test route to check API status
router.get('/test', (req, res) => {
    res.json({ message: "Tree API is working!" });
});

// GET: Fetch Entire Quran Reading Plan
router.get('/', (req, res) => {
    res.json(treeData);
});

// GET: Fetch a Specific Day
router.get('/:id', (req, res) => {
    const dayId = parseInt(req.params.id);
    const day = treeData.children.find(d => d.id === dayId);

    if (!day) {
        return res.status(404).json({ error: "Day not found" });
    }
    res.json(day);
});

// PUT: Update a Specific Day's Reading Progress
router.put('/:id', (req, res) => {
    const dayId = parseInt(req.params.id);
    const { completedPages } = req.body;

    if (!completedPages) {
        return res.status(400).json({ error: "Missing completedPages in request body" });
    }

    const day = treeData.children.find(d => d.id === dayId);
    if (!day) {
        return res.status(404).json({ error: "Day not found" });
    }

    day.completedPages = completedPages; // Track progress
    res.json({ message: "Progress updated!", day });
});

// POST: Add a Custom Reading Goal
router.post('/:id', (req, res) => {
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
        day.children = []; // Ensure children array exists
    }
    day.children.push(newGoal);

    res.status(201).json({ message: "Goal added!", newGoal });
});

// DELETE: Remove a Reading Goal
router.delete('/:dayId/:goalId', (req, res) => {
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

    res.json({ message: "Goal removed!", remainingGoals: day.children });
});

export default router;
