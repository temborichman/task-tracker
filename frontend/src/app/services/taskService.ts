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
      const tasks = await response.json();
      console.log('Fetched tasks:', tasks);
      return tasks;
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
      const updatedTask = await response.json();
      console.log('Task updated successfully:', updatedTask);
      return updatedTask;
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
      console.log('Task deleted successfully:', taskId);
    } catch (error) {
      console.error('Error in deleteTask:', error);
      throw error;
    }
  },

  async completeTask(taskId: string): Promise<Task> {
    try {
      const response = await fetch(`${API_URL}/tasks/${taskId}/complete`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error completing task:', errorData);
        throw new Error(errorData.error || 'Failed to complete task');
      }
      const completedTask = await response.json();
      console.log('Task completed successfully:', completedTask);
      return completedTask;
    } catch (error) {
      console.error('Error in completeTask:', error);
      throw error;
    }
  },

  async reactivateTask(taskId: string): Promise<Task> {
    try {
      const response = await fetch(`${API_URL}/tasks/${taskId}/reactivate`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error reactivating task:', errorData);
        throw new Error(errorData.error || 'Failed to reactivate task');
      }
      const reactivatedTask = await response.json();
      console.log('Task reactivated successfully:', reactivatedTask);
      return reactivatedTask;
    } catch (error) {
      console.error('Error in reactivateTask:', error);
      throw error;
    }
  }
}; 