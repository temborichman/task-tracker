const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

// Helper function to read tasks data
const readTasks = () => {
  const filePath = path.join(__dirname, '../data/tasks.json');
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify([]));
    return [];
  }
  const data = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(data);
};

// Helper function to write tasks data
const writeTasks = (tasks) => {
  const filePath = path.join(__dirname, '../data/tasks.json');
  fs.writeFileSync(filePath, JSON.stringify(tasks, null, 2));
};

// Get all tasks
router.get('/', (req, res) => {
  try {
    const tasks = readTasks();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

// Get a single task
router.get('/:id', (req, res) => {
  try {
    const tasks = readTasks();
    const task = tasks.find(t => t.id === req.params.id);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch task' });
  }
});

// Create a new task
router.post('/', (req, res) => {
  try {
    console.log('Received task creation request:', req.body);
    
    const tasks = readTasks();
    const newTask = {
      id: Date.now().toString(),
      ...req.body,
      dateCreated: new Date().toISOString(),
      status: req.body.status || 'To Do',
      priority: req.body.priority || 'medium',
      tags: req.body.tags || [],
      timeEstimate: req.body.timeEstimate || 60,
      impact: req.body.impact || 'medium',
      urgency: req.body.urgency || 'normal',
      projectId: req.body.projectId || ''
    };
    
    console.log('Creating new task:', newTask);
    
    tasks.push(newTask);
    writeTasks(tasks);
    console.log('Task created successfully');
    res.status(201).json(newTask);
  } catch (error) {
    console.error('Error creating task:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      error: 'Failed to create task',
      details: error.message,
      stack: error.stack
    });
  }
});

// Update a task
router.put('/:id', (req, res) => {
  try {
    const tasks = readTasks();
    const index = tasks.findIndex(t => t.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: 'Task not found' });
    }
    const updatedTask = {
      ...tasks[index],
      ...req.body,
      updatedAt: new Date().toISOString()
    };
    tasks[index] = updatedTask;
    writeTasks(tasks);
    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update task' });
  }
});

// Delete a task
router.delete('/:id', (req, res) => {
  try {
    const tasks = readTasks();
    const filteredTasks = tasks.filter(t => t.id !== req.params.id);
    if (filteredTasks.length === tasks.length) {
      return res.status(404).json({ error: 'Task not found' });
    }
    writeTasks(filteredTasks);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

module.exports = router; 