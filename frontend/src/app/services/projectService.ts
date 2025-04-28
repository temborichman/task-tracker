import { Project } from '../types';

// Mock data for testing
const mockProjects: Project[] = [
  {
    id: '1',
    name: 'Website Redesign',
    description: 'Redesign the company website with modern UI/UX',
    isMainProject: true,
    isCompleted: false,
    dateCreated: new Date().toISOString(),
    taskUrls: [],
  },
  {
    id: '2',
    name: 'Mobile App Development',
    description: 'Develop a cross-platform mobile application',
    isMainProject: true,
    isCompleted: false,
    dateCreated: new Date().toISOString(),
    taskUrls: [],
  },
  {
    id: '3',
    name: 'Content Marketing',
    description: 'Create and publish blog posts and social media content',
    isMainProject: false,
    isCompleted: false,
    dateCreated: new Date().toISOString(),
    taskUrls: [],
  },
];

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export const projectService = {
  async getAllProjects(): Promise<Project[]> {
    try {
      // For now, return mock data
      console.log('Using mock project data');
      return mockProjects;
      
      // Uncomment this when backend is ready
      // const response = await fetch(`${API_URL}/projects`);
      // if (!response.ok) {
      //   throw new Error('Failed to fetch projects');
      // }
      // return await response.json();
    } catch (error) {
      console.error('Error fetching projects:', error);
      return mockProjects; // Return mock data even on error for testing
    }
  },

  async createProject(project: Omit<Project, 'id'>): Promise<Project> {
    // Mock implementation
    const newProject: Project = {
      ...project,
      id: Date.now().toString(),
      dateCreated: new Date().toISOString(),
      taskUrls: [],
    };
    mockProjects.push(newProject);
    return newProject;
  },

  async updateProject(projectId: string, project: Partial<Project>): Promise<Project> {
    const index = mockProjects.findIndex(p => p.id === projectId);
    if (index === -1) throw new Error('Project not found');
    mockProjects[index] = { ...mockProjects[index], ...project };
    return mockProjects[index];
  },

  async deleteProject(projectId: string): Promise<void> {
    const index = mockProjects.findIndex(p => p.id === projectId);
    if (index === -1) throw new Error('Project not found');
    mockProjects.splice(index, 1);
  },

  async completeProject(projectId: string): Promise<Project> {
    const index = mockProjects.findIndex(p => p.id === projectId);
    if (index === -1) throw new Error('Project not found');
    mockProjects[index] = { ...mockProjects[index], isCompleted: true };
    return mockProjects[index];
  },

  async reactivateProject(projectId: string): Promise<Project> {
    const index = mockProjects.findIndex(p => p.id === projectId);
    if (index === -1) throw new Error('Project not found');
    mockProjects[index] = { ...mockProjects[index], isCompleted: false };
    return mockProjects[index];
  },
}; 