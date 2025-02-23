import express from 'express';
import {
  getTree,
  getNode,
  createNode,
  updateNode,
  deleteNode
} from '../controllers/treeController.js';

const router = express.Router();

router.get("/", getTree);
router.get("/:id", getNode);
router.post("/", createNode);
router.put("/:id", updateNode);
router.delete("/:id", deleteNode);

export default router;
