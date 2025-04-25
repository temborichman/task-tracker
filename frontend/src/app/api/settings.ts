// Get task management settings
getTaskManagementSettings: async (): Promise<TaskManagementSettings> => {
  try {
    const response = await fetch(`${API_BASE_URL}/settings/tasks`, {
      headers: {
        'Accept': 'application/json',
      },
    });
    return handleResponse(response);
  } catch (error) {
    console.error('Error fetching task management settings:', error);
    throw error;
  }
},

// Update task management settings
updateTaskManagementSettings: async (settings: Partial<TaskManagementSettings>): Promise<TaskManagementSettings> => {
  try {
    const response = await fetch(`${API_BASE_URL}/settings/tasks`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(settings),
    });
    return handleResponse(response);
  } catch (error) {
    console.error('Error updating task management settings:', error);
    throw error;
  }
},

// Add a new task category
addTaskCategory: async (category: string): Promise<string[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/settings/tasks/categories`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ category }),
    });
    return handleResponse(response);
  } catch (error) {
    console.error('Error adding task category:', error);
    throw error;
  }
},

// Delete a task category
deleteTaskCategory: async (category: string): Promise<string[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/settings/tasks/categories/${encodeURIComponent(category)}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
      },
    });
    return handleResponse(response);
  } catch (error) {
    console.error('Error deleting task category:', error);
    throw error;
  }
}, 