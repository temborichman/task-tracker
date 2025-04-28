export type TaskStatus = 'To Do' | 'In Progress' | 'Completed';
export type TaskPriority = 'high' | 'medium' | 'low';
export type TaskTag = 'frontend' | 'backend' | 'design' | 'bugfix' | 'security' | 'devops';
export type TaskImpact = 'high' | 'medium' | 'low';
export type TaskUrgency = 'urgent' | 'normal' | 'low';

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string;
  status: TaskStatus;
  dueDate: string;
  priority: TaskPriority;
  tags: TaskTag[];
  timeEstimate: number; // in minutes
  impact: TaskImpact;
  urgency: TaskUrgency;
  dateCreated: string;
  dateCompleted?: string;
  url?: string; // URL associated with the task
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  isCompleted: boolean;
  isMainProject: boolean;
  tasks?: Task[];
  taskUrls?: string[];
}

export interface UserStats {
  level: number;
  xp: number;
  xpToNextLevel: number;
  tasksCompleted: number;
  streak: number;
  badges: string[];
} 