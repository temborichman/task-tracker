const db = require('../database/db');
const { v4: uuidv4 } = require('uuid');

class ProjectModel {
  // Get all projects
  static async getAllProjects() {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM projects';
      
      db.all(query, [], (err, rows) => {
        if (err) {
          return reject(err);
        }
        resolve(rows);
      });
    });
  }

  // Get project by ID
  static async getProjectById(id) {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM projects WHERE id = ?';
      
      db.get(query, [id], (err, row) => {
        if (err) {
          return reject(err);
        }
        resolve(row);
      });
    });
  }

  // Create a new project
  static async createProject(projectData) {
    return new Promise((resolve, reject) => {
      const id = uuidv4();
      const { name, description, status = 'Not Started' } = projectData;
      const createdAt = new Date().toISOString();
      
      const query = 'INSERT INTO projects (id, name, description, status, created_at) VALUES (?, ?, ?, ?, ?)';
      
      db.run(query, [id, name, description, status, createdAt], function(err) {
        if (err) {
          return reject(err);
        }
        
        resolve({
          id,
          name,
          description,
          status,
          created_at: createdAt
        });
      });
    });
  }

  // Update a project
  static async updateProject(id, projectData) {
    return new Promise((resolve, reject) => {
      // First check if project exists
      this.getProjectById(id)
        .then(project => {
          if (!project) {
            return resolve(null);
          }

          const { name, description, status } = projectData;
          const updatedAt = new Date().toISOString();
          
          const query = 'UPDATE projects SET name = ?, description = ?, status = ?, updated_at = ? WHERE id = ?';
          
          db.run(query, [name, description, status, updatedAt, id], function(err) {
            if (err) {
              return reject(err);
            }
            
            resolve({
              id,
              name,
              description,
              status,
              updated_at: updatedAt
            });
          });
        })
        .catch(err => reject(err));
    });
  }

  // Delete a project
  static async deleteProject(id) {
    return new Promise((resolve, reject) => {
      // First check if project exists
      this.getProjectById(id)
        .then(project => {
          if (!project) {
            return resolve({ success: false });
          }

          const query = 'DELETE FROM projects WHERE id = ?';
          
          db.run(query, [id], function(err) {
            if (err) {
              return reject(err);
            }
            
            resolve({ success: true, message: 'Project deleted successfully' });
          });
        })
        .catch(err => reject(err));
    });
  }
}

module.exports = ProjectModel; 