const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

// Helper function to read projects data
const readProjects = () => {
  const filePath = path.join(__dirname, '../data/projects.json');
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify([]));
    return [];
  }
  const data = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(data);
};

// Helper function to write projects data
const writeProjects = (projects) => {
  const filePath = path.join(__dirname, '../data/projects.json');
  fs.writeFileSync(filePath, JSON.stringify(projects, null, 2));
};

// Get all projects
router.get('/', (req, res) => {
  try {
    const projects = readProjects();
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

// Get a single project
router.get('/:id', (req, res) => {
  try {
    const projects = readProjects();
    const project = projects.find(p => p.id === req.params.id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch project' });
  }
});

// Create a new project
router.post('/', (req, res) => {
  try {
    const projects = readProjects();
    const newProject = {
      id: Date.now().toString(),
      ...req.body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    projects.push(newProject);
    writeProjects(projects);
    res.status(201).json(newProject);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create project' });
  }
});

// Update a project
router.put('/:id', (req, res) => {
  try {
    const projects = readProjects();
    const index = projects.findIndex(p => p.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: 'Project not found' });
    }
    const updatedProject = {
      ...projects[index],
      ...req.body,
      updatedAt: new Date().toISOString()
    };
    projects[index] = updatedProject;
    writeProjects(projects);
    res.json(updatedProject);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update project' });
  }
});

// Delete a project
router.delete('/:id', (req, res) => {
  try {
    const projects = readProjects();
    const filteredProjects = projects.filter(p => p.id !== req.params.id);
    if (filteredProjects.length === projects.length) {
      return res.status(404).json({ error: 'Project not found' });
    }
    writeProjects(filteredProjects);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete project' });
  }
});

module.exports = router; 