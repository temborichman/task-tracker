'use client';

import { useState, useEffect } from 'react';
import { TaskManagementSettings as TaskSettings } from '../types';
import { settingsApi } from '../api/settings';

export default function TaskManagementSettings() {
  const [settings, setSettings] = useState<TaskSettings | null>(null);
  const [newCategory, setNewCategory] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const data = await settingsApi.getTaskManagementSettings();
      setSettings(data);
    } catch (err) {
      setError('Failed to load settings');
    }
  };

  const handleUpdateSettings = async (updates: Partial<TaskSettings>) => {
    if (!settings) return;
    setIsLoading(true);
    try {
      const updated = await settingsApi.updateTaskManagementSettings(updates);
      setSettings(updated);
      setError(null);
    } catch (err) {
      setError('Failed to update settings');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddCategory = async () => {
    if (!newCategory.trim()) return;
    setIsLoading(true);
    try {
      await settingsApi.addTaskCategory(newCategory.trim());
      await loadSettings();
      setNewCategory('');
      setError(null);
    } catch (err) {
      setError('Failed to add category');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCategory = async (category: string) => {
    setIsLoading(true);
    try {
      await settingsApi.deleteTaskCategory(category);
      await loadSettings();
      setError(null);
    } catch (err) {
      setError('Failed to delete category');
    } finally {
      setIsLoading(false);
    }
  };

  if (!settings) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Task Preferences */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Task Preferences</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span>Show Completed Tasks</span>
            <button
              onClick={() => handleUpdateSettings({
                taskPreferences: {
                  ...settings.taskPreferences,
                  showCompleted: !settings.taskPreferences.showCompleted
                }
              })}
              className={`px-4 py-2 rounded ${
                settings.taskPreferences.showCompleted
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200'
              }`}
            >
              {settings.taskPreferences.showCompleted ? 'Enabled' : 'Disabled'}
            </button>
          </div>

          <div className="flex items-center justify-between">
            <span>Sort By</span>
            <select
              value={settings.taskPreferences.sortBy}
              onChange={(e) => handleUpdateSettings({
                taskPreferences: {
                  ...settings.taskPreferences,
                  sortBy: e.target.value as 'dueDate' | 'priority' | 'createdAt'
                }
              })}
              className="border rounded px-3 py-2"
            >
              <option value="dueDate">Due Date</option>
              <option value="priority">Priority</option>
              <option value="createdAt">Created At</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <span>Group By</span>
            <select
              value={settings.taskPreferences.groupBy}
              onChange={(e) => handleUpdateSettings({
                taskPreferences: {
                  ...settings.taskPreferences,
                  groupBy: e.target.value as 'category' | 'priority' | 'none'
                }
              })}
              className="border rounded px-3 py-2"
            >
              <option value="category">Category</option>
              <option value="priority">Priority</option>
              <option value="none">None</option>
            </select>
          </div>
        </div>
      </div>

      {/* Auto-Archive Settings */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Auto-Archive Settings</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span>Auto-Archive</span>
            <button
              onClick={() => handleUpdateSettings({
                autoArchive: !settings.autoArchive
              })}
              className={`px-4 py-2 rounded ${
                settings.autoArchive
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200'
              }`}
            >
              {settings.autoArchive ? 'Enabled' : 'Disabled'}
            </button>
          </div>

          {settings.autoArchive && (
            <div className="flex items-center justify-between">
              <span>Archive After Days</span>
              <input
                type="number"
                value={settings.archiveAfterDays}
                onChange={(e) => handleUpdateSettings({
                  archiveAfterDays: parseInt(e.target.value)
                })}
                className="border rounded px-3 py-2 w-20"
                min="1"
              />
            </div>
          )}
        </div>
      </div>

      {/* Categories Management */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Categories</h3>
        <div className="space-y-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="New category name"
              className="flex-1 border rounded px-3 py-2"
            />
            <button
              onClick={handleAddCategory}
              disabled={isLoading || !newCategory.trim()}
              className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
            >
              Add
            </button>
          </div>

          <div className="space-y-2">
            {settings.categories.map((category) => (
              <div key={category} className="flex items-center justify-between bg-gray-50 p-3 rounded">
                <span>{category}</span>
                <button
                  onClick={() => handleDeleteCategory(category)}
                  disabled={isLoading}
                  className="text-red-500 hover:text-red-700"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Default Settings */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Default Settings</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span>Default Priority</span>
            <select
              value={settings.defaultPriority}
              onChange={(e) => handleUpdateSettings({
                defaultPriority: e.target.value as 'low' | 'medium' | 'high'
              })}
              className="border rounded px-3 py-2"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <span>Default Category</span>
            <select
              value={settings.defaultCategory}
              onChange={(e) => handleUpdateSettings({
                defaultCategory: e.target.value
              })}
              className="border rounded px-3 py-2"
            >
              {settings.categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
} 