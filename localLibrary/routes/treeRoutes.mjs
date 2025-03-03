import express from 'express';
import { treeData } from "../data/treeData.mjs";

const router = express.Router();

// GET: Fetch Entire Quran Reading Plan
router.get('/', (req, res) => {
    res.json(treeData);
});

// GET: Fetch a Specific Day
router.get('/:id', (req, res) => {
    const dayId = parseInt(req.params.id);
    const day = treeData.children.find(d => d.id === dayId);
    if (!day) return res.status(404).json({ message: "Day not found" });
    res.json(day);
});

// PUT: Update a Specific Day's Reading Progress
router.put('/:id', (req, res) => {
    const dayId = parseInt(req.params.id);
    const { completedPages } = req.body;

    const day = treeData.children.find(d => d.id === dayId);
    if (!day) return res.status(404).json({ message: "Day not found" });

    day.completedPages = completedPages; // Track progress
    res.json({ message: "Progress updated!", day });
});

// POST: Add a Custom Reading Goal
router.post('/:id', (req, res) => {
    const dayId = parseInt(req.params.id);
    const { customGoal } = req.body;

    const day = treeData.children.find(d => d.id === dayId);
    if (!day) return res.status(404).json({ message: "Day not found" });

    const newGoal = { id: Date.now(), name: customGoal };
    day.children.push(newGoal);

    res.status(201).json({ message: "Goal added!", newGoal });
});

// DELETE: Remove a Reading Goal
router.delete('/:dayId/:goalId', (req, res) => {
    const dayId = parseInt(req.params.dayId);
    const goalId = parseInt(req.params.goalId);

    const day = treeData.children.find(d => d.id === dayId);
    if (!day) return res.status(404).json({ message: "Day not found" });

    day.children = day.children.filter(goal => goal.id !== goalId);
    res.json({ message: "Goal removed!" });
});

export default router;
