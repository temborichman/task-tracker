import { Task } from '../types';

const API_URL = 'http://localhost:5000/api';

export const taskService = {
  async getAllTasks(): Promise<Task[]> {
    try {
      const response = await fetch(`${API_URL}/tasks`);
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error fetching tasks:', errorData);
        throw new Error(errorData.error || 'Failed to fetch tasks');
      }
      return response.json();
    } catch (error) {
      console.error('Error in getAllTasks:', error);
      throw error;
    }
  },

  async createTask(task: Omit<Task, 'id' | 'dateCreated'>): Promise<Task> {
    try {
      console.log('Creating task with data:', task);
      const response = await fetch(`${API_URL}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(task),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error creating task:', errorData);
        throw new Error(errorData.error || 'Failed to create task');
      }
      
      const createdTask = await response.json();
      console.log('Task created successfully:', createdTask);
      return createdTask;
    } catch (error) {
      console.error('Error in createTask:', error);
      throw error;
    }
  },

  async updateTask(taskId: string, updates: Partial<Task>): Promise<Task> {
    try {
      const response = await fetch(`${API_URL}/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error updating task:', errorData);
        throw new Error(errorData.error || 'Failed to update task');
      }
      return response.json();
    } catch (error) {
      console.error('Error in updateTask:', error);
      throw error;
    }
  },

  async deleteTask(taskId: string): Promise<void> {
    try {
      const response = await fetch(`${API_URL}/tasks/${taskId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error deleting task:', errorData);
        throw new Error(errorData.error || 'Failed to delete task');
      }
    } catch (error) {
      console.error('Error in deleteTask:', error);
      throw error;
    }
  },
}; 