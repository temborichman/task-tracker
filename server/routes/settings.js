const express = require('express');
const router = express.Router();
const SettingsModel = require('../models/SettingsModel');

// Get all settings
router.get('/', async (req, res) => {
  try {
    const settings = await SettingsModel.getSettings();
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

// Update general settings
router.put('/', async (req, res) => {
  try {
    const updatedSettings = await SettingsModel.updateSettings(req.body);
    res.json(updatedSettings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update settings' });
  }
});

// Get account settings
router.get('/account', async (req, res) => {
  try {
    const settings = await SettingsModel.getSettings();
    res.json(settings.account);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch account settings' });
  }
});

// Update account settings
router.put('/account', async (req, res) => {
  try {
    const updatedSettings = await SettingsModel.updateAccountSettings(req.body);
    res.json(updatedSettings.account);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update account settings' });
  }
});

// Get data storage settings
router.get('/storage', async (req, res) => {
  try {
    const settings = await SettingsModel.getSettings();
    res.json(settings.dataStorage);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch data storage settings' });
  }
});

// Update data storage settings
router.put('/storage', async (req, res) => {
  try {
    const updatedSettings = await SettingsModel.updateDataStorageSettings(req.body);
    res.json(updatedSettings.dataStorage);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update data storage settings' });
  }
});

// Reset settings to default
router.post('/reset', async (req, res) => {
  try {
    const defaultSettings = {
      theme: 'light',
      notifications: true,
      language: 'en',
      timezone: 'UTC',
      account: {
        email: '',
        name: '',
        avatar: '',
        connectedAccounts: []
      },
      dataStorage: {
        backupEnabled: true,
        backupFrequency: 'daily',
        lastBackup: null,
        cloudSync: false,
        cloudProvider: null
      },
      updatedAt: new Date().toISOString()
    };
    const updatedSettings = await SettingsModel.updateSettings(defaultSettings);
    res.json(updatedSettings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to reset settings' });
  }
});

// Get task management settings
router.get('/tasks', async (req, res) => {
  try {
    const settings = await SettingsModel.getSettings();
    res.json(settings.taskManagement);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch task management settings' });
  }
});

// Update task management settings
router.put('/tasks', async (req, res) => {
  try {
    const updatedSettings = await SettingsModel.updateTaskManagementSettings(req.body);
    res.json(updatedSettings.taskManagement);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update task management settings' });
  }
});

// Add a new task category
router.post('/tasks/categories', async (req, res) => {
  try {
    const { category } = req.body;
    if (!category) {
      return res.status(400).json({ error: 'Category name is required' });
    }

    const settings = await SettingsModel.getSettings();
    if (settings.taskManagement.categories.includes(category)) {
      return res.status(400).json({ error: 'Category already exists' });
    }

    const updatedSettings = await SettingsModel.updateTaskManagementSettings({
      categories: [...settings.taskManagement.categories, category]
    });
    res.json(updatedSettings.taskManagement.categories);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add category' });
  }
});

// Delete a task category
router.delete('/tasks/categories/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const settings = await SettingsModel.getSettings();
    
    if (!settings.taskManagement.categories.includes(category)) {
      return res.status(404).json({ error: 'Category not found' });
    }

    const updatedCategories = settings.taskManagement.categories.filter(c => c !== category);
    const updatedSettings = await SettingsModel.updateTaskManagementSettings({
      categories: updatedCategories
    });
    res.json(updatedSettings.taskManagement.categories);
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete category' });
  }
});

module.exports = router; 