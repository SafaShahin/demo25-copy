import { treeData } from "../data/treeData.js";

export const getTree = (req, res) => {
  res.json(treeData);
};

export const getNode = (req, res) => {
  const id = parseInt(req.params.id);
  const searchNode = (node, id) => {
    if (node.id === id) return node;
    for (const child of node.children) {
      const result = searchNode(child, id);
      if (result) return result;
    }
    return null;
  };
  const node = searchNode(treeData, id);
  if (node) res.json(node);
  else res.status(404).send("Node not found");
};

export const createNode = (req, res) => {
  const newNode = { id: Date.now(), name: req.body.name, children: [] };
  treeData.children.push(newNode);
  res.status(201).json(newNode);
};

export const updateNode = (req, res) => {
  const id = parseInt(req.params.id);
  const updateNodeRecursive = (node, id, newName) => {
    if (node.id === id) {
      node.name = newName;
      return node;
    }
    for (const child of node.children) {
      const updated = updateNodeRecursive(child, id, newName);
      if (updated) return updated;
    }
    return null;
  };
  const updatedNode = updateNodeRecursive(treeData, id, req.body.name);
  if (updatedNode) res.json(updatedNode);
  else res.status(404).send("Node not found");
};

export const deleteNode = (req, res) => {
  const id = parseInt(req.params.id);
  const initialLength = treeData.children.length;
  treeData.children = treeData.children.filter(child => child.id !== id);
  if (treeData.children.length < initialLength) res.send("Node deleted");
  else res.status(404).send("Node not found");
};
