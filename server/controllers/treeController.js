import { readFile, writeFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const treeDataPath = path.join(__dirname, "../data/treeData.json");

// Helper function to read data from JSON file
const getTreeData = async () => {
    const jsonData = await readFile(treeDataPath, "utf-8");
    return JSON.parse(jsonData);
};

// Helper function to write data to JSON file
const saveTreeData = async (data) => {
    await writeFile(treeDataPath, JSON.stringify(data, null, 2), "utf-8");
};

// 📌 **GET: Fetch Entire Quran Reading Plan**
export const getTree = async (req, res) => {
    try {
        const treeData = await getTreeData();
        res.json(treeData);
    } catch (error) {
        res.status(500).json({ error: "Failed to load Quran Reading Plan" });
    }
};

// 📌 **GET: Fetch a Specific Day**
export const getNode = async (req, res) => {
    try {
        const treeData = await getTreeData();
        const id = parseInt(req.params.id);
        const node = treeData.children.find(day => day.id === id);

        if (node) {
            res.json(node);
        } else {
            res.status(404).json({ error: "Day not found" });
        }
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch day data" });
    }
};

// 📌 **POST: Add a Custom Reading Goal**
export const createNode = async (req, res) => {
    try {
        const treeData = await getTreeData();
        const dayId = parseInt(req.params.id);
        const { customGoal } = req.body;

        if (!customGoal) {
            return res.status(400).json({ error: "Missing customGoal in request body" });
        }

        const day = treeData.children.find(day => day.id === dayId);
        if (!day) {
            return res.status(404).json({ error: "Day not found" });
        }

        const newGoal = { id: Date.now(), name: customGoal };
        day.children.push(newGoal);

        await saveTreeData(treeData);
        res.status(201).json({ message: "Goal added!", newGoal });
    } catch (error) {
        res.status(500).json({ error: "Failed to add goal" });
    }
};

// 📌 **PUT: Update a Specific Day's Reading Progress**
export const updateNode = async (req, res) => {
    try {
        const treeData = await getTreeData();
        const dayId = parseInt(req.params.id);
        const { completedPages } = req.body;

        if (!completedPages) {
            return res.status(400).json({ error: "Missing completedPages in request body" });
        }

        const day = treeData.children.find(day => day.id === dayId);
        if (!day) {
            return res.status(404).json({ error: "Day not found" });
        }

        day.completedPages = completedPages;

        await saveTreeData(treeData);
        res.json({ message: "Progress updated!", day });
    } catch (error) {
        res.status(500).json({ error: "Failed to update progress" });
    }
};

// 📌 **DELETE: Remove a Reading Goal**
export const deleteNode = async (req, res) => {
    try {
        const treeData = await getTreeData();
        const dayId = parseInt(req.params.dayId);
        const goalId = parseInt(req.params.goalId);

        const day = treeData.children.find(day => day.id === dayId);
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
        res.status(500).json({ error: "Failed to remove goal" });
    }
};
