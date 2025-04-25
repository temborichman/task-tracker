const fs = require('fs');
const path = require('path');

class TaskModel {
  constructor() {
    this.tasksFilePath = path.join(__dirname, '../data/tasks.json');
  }

  /**
   * Read all tasks from the file
   */
  async getAllTasks() {
    try {
      const data = await fs.promises.readFile(this.tasksFilePath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error reading tasks:', error);
      return [];
    }
  }

  /**
   * Get tasks for a specific project
   */
  async getTasksByProject(projectId) {
    try {
      const tasks = await this.getAllTasks();
      return tasks.filter(task => task.projectId === projectId);
    } catch (error) {
      console.error('Error getting tasks by project:', error);
      return [];
    }
  }

  /**
   * Get a single task by ID
   */
  async getTaskById(taskId) {
    try {
      const tasks = await this.getAllTasks();
      return tasks.find(task => task.id === taskId);
    } catch (error) {
      console.error('Error getting task by ID:', error);
      return null;
    }
  }

  /**
   * Add a new task
   */
  async createTask(taskData) {
    try {
      const tasks = await this.getAllTasks();
      
      // Create new task with ID
      const newTask = {
        id: `task-${Date.now()}`,
        dateCreated: new Date().toISOString().split('T')[0],
        ...taskData
      };
      
      tasks.push(newTask);
      await fs.promises.writeFile(this.tasksFilePath, JSON.stringify(tasks, null, 2));
      
      return newTask;
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  }

  /**
   * Update an existing task
   */
  async updateTask(taskId, taskData) {
    try {
      const tasks = await this.getAllTasks();
      const taskIndex = tasks.findIndex(task => task.id === taskId);
      
      if (taskIndex === -1) {
        throw new Error('Task not found');
      }
      
      // Update task keeping the id and other unchangeable properties
      tasks[taskIndex] = { 
        ...tasks[taskIndex],
        ...taskData,
        id: taskId // Ensure ID doesn't change
      };
      
      await fs.promises.writeFile(this.tasksFilePath, JSON.stringify(tasks, null, 2));
      
      return tasks[taskIndex];
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  }

  /**
   * Delete a task
   */
  async deleteTask(taskId) {
    try {
      const tasks = await this.getAllTasks();
      const filteredTasks = tasks.filter(task => task.id !== taskId);
      
      if (filteredTasks.length === tasks.length) {
        throw new Error('Task not found');
      }
      
      await fs.promises.writeFile(this.tasksFilePath, JSON.stringify(filteredTasks, null, 2));
      
      return { success: true, message: 'Task deleted successfully' };
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  }
}

module.exports = new TaskModel(); 