'use client';

import { useState, useEffect } from 'react';
import { Task, Project, UserStats, TaskStatus, TaskPriority, TaskTag, TaskImpact, TaskUrgency } from './types';
import { taskApi } from './api/tasks';
import { TaskCard } from './components/TaskCard';
import ProjectsPage from './components/ProjectsPage';
import Sidebar from './components/Sidebar';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'All' | TaskStatus>('All');
  const [activeView, setActiveView] = useState<'tasks' | 'projects'>('tasks');
  const [userStats, setUserStats] = useState<UserStats>({
    level: 3,
    xp: 350,
    xpToNextLevel: 500,
    tasksCompleted: 24,
    streak: 5,
    badges: ['Early Bird', 'Task Master', 'Weekend Warrior']
  });
  const [showBriefing, setShowBriefing] = useState<boolean>(true);

  // Time-based greeting and briefing state
  const [timeOfDay, setTimeOfDay] = useState<'morning' | 'afternoon' | 'evening'>('morning');
  
  // Calendar heatmap data (last 30 days)
  const [activityHeatmap, setActivityHeatmap] = useState<{date: string, count: number}[]>([]);
  
  // Project state
  const [projects, setProjects] = useState<Project[]>([
    {
      id: '1',
      name: 'Project Alpha',
      isCompleted: false,
      isMainProject: true
    },
    {
      id: '2',
      name: 'Project Beta',
      isCompleted: false,
      isMainProject: false
    }
  ]);
  const [completedProjects, setCompletedProjects] = useState<Project[]>([]);
  const [activeProjectId, setActiveProjectId] = useState<string>('proj-1');
  const [showNewProjectModal, setShowNewProjectModal] = useState<boolean>(false);
  const [newProjectName, setNewProjectName] = useState<string>('');

  // Search state
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Advanced Filter State
  const [showFilterPanel, setShowFilterPanel] = useState<boolean>(false);
  const [filterCriteria, setFilterCriteria] = useState<{
    priorities: TaskPriority[];
    dueDateRange: 'all' | 'today' | 'this_week' | 'overdue' | { start: string, end: string };
    tags: TaskTag[];
  }>({ priorities: [], dueDateRange: 'all', tags: [] });
  const [sortOrder, setSortOrder] = useState<string>('default'); // e.g., 'dueDate', 'priority', 'creationDate'
  const [savedFilters, setSavedFilters] = useState<{ name: string; criteria: any }[]>([]); // Placeholder for saved views
  const [customStartDate, setCustomStartDate] = useState<string>('');
  const [customEndDate, setCustomEndDate] = useState<string>('');

  // Settings State
  const [settings, setSettings] = useState<{
    accentColor: string; // e.g., 'green', 'blue', 'purple'
    layout: 'card' | 'list';
    defaultTaskPriority: TaskPriority;
    enablePomodoro: boolean;
  }>({ 
    accentColor: 'green',
    layout: 'card',
    defaultTaskPriority: 'medium',
    enablePomodoro: false,
   });

  // New Task Modal state
  const [showNewTaskModal, setShowNewTaskModal] = useState<boolean>(false);
  const [newTask, setNewTask] = useState<Omit<Task, 'id' | 'dateCreated' | 'projectId'>>({
    title: '',
    description: '',
    status: 'To Do',
    dueDate: '',
    priority: 'medium',
    tags: [],
    timeEstimate: 60,
    impact: 'medium',
    urgency: 'normal',
  });

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showTaskDetailsModal, setShowTaskDetailsModal] = useState(false);

  // Load tasks from API
  useEffect(() => {
    const loadTasks = async () => {
      try {
        const tasks = await taskApi.getAllTasks();
        setAllTasks(tasks);
      } catch (error) {
        console.error('Failed to load tasks:', error);
      }
    };
    loadTasks();
  }, []);

  useEffect(() => {
    // Determine time of day for greeting
    const hour = new Date().getHours();
    if (hour < 12) setTimeOfDay('morning');
    else if (hour < 18) setTimeOfDay('afternoon');
    else setTimeOfDay('evening');
    
    // Generate sample activity data for heatmap
    const today = new Date();
    const heatmapData = [];
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      // Random activity count between 0-5
      const count = Math.floor(Math.random() * 6);
      heatmapData.push({ date: dateStr, count });
    }
    setActivityHeatmap(heatmapData);
  }, []);
  
  // Sample tasks (updated with projectId)
  const [allTasks, setAllTasks] = useState<Task[]>([
    {
      id: '1',
      projectId: 'proj-1',
      title: 'Refactor authentication module',
      description: 'Implement JWT and improve security',
      status: 'In Progress',
      dueDate: '2025-04-20',
      priority: 'high',
      tags: ['backend', 'security'],
      timeEstimate: 240,
      impact: 'high',
      urgency: 'urgent',
      dateCreated: '2025-03-15'
    },
    {
      id: '2',
      projectId: 'proj-1',
      title: 'Create responsive dashboard',
      description: 'Design and implement responsive UI for the admin dashboard',
      status: 'To Do',
      dueDate: '2025-04-25',
      priority: 'medium',
      tags: ['frontend', 'design'],
      timeEstimate: 180,
      impact: 'medium',
      urgency: 'normal',
      dateCreated: '2025-03-18'
    },
    {
      id: '3',
      projectId: 'proj-1',
      title: 'Fix pagination bug',
      description: 'Resolve issue with pagination in the products list',
      status: 'Completed',
      dueDate: '2025-04-10',
      priority: 'medium',
      tags: ['bugfix', 'frontend'],
      timeEstimate: 90,
      impact: 'medium',
      urgency: 'normal',
      dateCreated: '2025-03-05',
      dateCompleted: '2025-04-08'
    },
    {
      id: '4',
      projectId: 'proj-1',
      title: 'Optimize database queries',
      description: 'Improve performance of slow database queries',
      status: 'To Do',
      dueDate: '2025-05-05',
      priority: 'low',
      tags: ['backend'],
      timeEstimate: 120,
      impact: 'high',
      urgency: 'low',
      dateCreated: '2025-03-28'
    },
    {
      id: '5',
      projectId: 'proj-1',
      title: 'Implement dark mode',
      description: 'Add dark mode toggle and styling',
      status: 'Completed',
      dueDate: '2025-04-05',
      priority: 'low',
      tags: ['frontend', 'design'],
      timeEstimate: 150,
      impact: 'medium',
      urgency: 'low',
      dateCreated: '2025-03-20',
      dateCompleted: '2025-04-04'
    },
    {
      id: '6',
      projectId: 'proj-1',
      title: 'User onboarding flow',
      description: 'Create guided tour for new users',
      status: 'To Do',
      dueDate: '2025-04-30',
      priority: 'high',
      tags: ['frontend', 'design'],
      timeEstimate: 200,
      impact: 'high',
      urgency: 'urgent',
      dateCreated: '2025-03-25'
    },
    // Tasks for Project 2
    {
      id: '7',
      projectId: 'proj-2',
      title: 'Setup CI/CD pipeline',
      description: 'Configure GitHub Actions for automated testing and deployment',
      status: 'To Do',
      dueDate: '2025-05-10',
      priority: 'high',
      tags: ['backend', 'devops'],
      timeEstimate: 180,
      impact: 'high',
      urgency: 'normal',
      dateCreated: '2025-04-01'
    },
    {
      id: '8',
      projectId: 'proj-2',
      title: 'Design landing page mockups',
      description: 'Create Figma designs for the project landing page',
      status: 'In Progress',
      dueDate: '2025-05-15',
      priority: 'medium',
      tags: ['design'],
      timeEstimate: 120,
      impact: 'medium',
      urgency: 'normal',
      dateCreated: '2025-04-05'
    },
  ]);

  // Get the name of the active project
  const activeProjectName = projects.find(p => p.id === activeProjectId)?.name || 'HomieHub';

  // Function to safely parse and validate dates
  const isValidDate = (dateString: string) => {
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date.getTime());
  };

  // Function to safely format date
  const formatDate = (dateString: string) => {
    if (!isValidDate(dateString)) return 'Invalid Date';
    return new Date(dateString).toLocaleDateString();
  };

  // Get tasks for the active project
  const tasksForActiveProject = allTasks.filter((task: Task) => {
    if (!isValidDate(task.dueDate)) return false;
    return task.projectId === activeProjectId;
  });

  // Sort tasks by priority for the suggested tasks section
  const sortedByPriority = [...tasksForActiveProject].sort((a: Task, b: Task): number => {
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    return priorityOrder[b.priority] - priorityOrder[a.priority];
  });

  // Update the task filtering logic
  const filteredTasks = tasksForActiveProject
    .filter((task: Task) => {
      // Get the project this task belongs to
      const taskProject = projects.find(p => p.id === task.projectId) || 
                         completedProjects.find(p => p.id === task.projectId);

      // If no project found, don't show the task
      if (!taskProject) return false;

      // Apply status filter based on both task and project status
      if (activeTab === 'All') {
        return !taskProject.isCompleted; // Show all non-completed tasks
      }
      
      if (activeTab === 'To Do') {
        return task.status === 'To Do' && !taskProject.isCompleted;
      }
      
      if (activeTab === 'In Progress') {
        return task.status === 'In Progress' && !taskProject.isCompleted;
      }
      
      if (activeTab === 'Completed') {
        return task.status === 'Completed' || taskProject.isCompleted;
      }

      return false;
    })
    .sort((a: Task, b: Task) => {
      if (sortOrder === 'dueDate') {
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      } else if (sortOrder === 'priority') {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      } else if (sortOrder === 'creationDate') {
        return new Date(a.dateCreated).getTime() - new Date(b.dateCreated).getTime();
      } else {
        // Default sort: newest at the bottom
        return new Date(a.dateCreated).getTime() - new Date(b.dateCreated).getTime();
      }
    });

  // Calculate stats based on the active project's tasks
  const todoCount = tasksForActiveProject.filter((task: Task) => task.status === 'To Do').length;
  const inProgressCount = tasksForActiveProject.filter((task: Task) => task.status === 'In Progress').length;
  const completedCount = tasksForActiveProject.filter((task: Task) => task.status === 'Completed').length;
  const completionRate = tasksForActiveProject.length > 0 
    ? Math.round((completedCount / tasksForActiveProject.length) * 100) 
    : 0;

  // Update briefing/recap logic to use tasksForActiveProject
  const todaysTasks = tasksForActiveProject.filter((task: Task) => {
    const today = new Date().toISOString().split('T')[0];
    const dueDate = new Date(task.dueDate).toISOString().split('T')[0];
    return dueDate === today && task.status !== 'Completed';
  });

  const tasksCompletedToday = tasksForActiveProject.filter((task: Task) => {
    const today = new Date().toISOString().split('T')[0];
    return task.dateCompleted?.split('T')[0] === today;
  });

  // Function to handle creating a new project
  const handleCreateProject = () => {
    if (newProjectName.trim() === '') return; // Prevent empty names
    
    const newProject: Project = {
      id: `proj-${Date.now()}`,
      name: newProjectName.trim(),
      isCompleted: false,
      isMainProject: false
    };
    
    setProjects([...projects, newProject]);
    setActiveProjectId(newProject.id);
    setNewProjectName('');
    setShowNewProjectModal(false);
  };

  // Function to handle creating a new task
  const handleCreateTask = async () => {
    try {
      const taskWithProject = {
        ...newTask,
        projectId: activeProjectId,
        dueDate: newTask.dueDate ? new Date(newTask.dueDate).toISOString() : new Date().toISOString(),
        dateCreated: new Date().toISOString()
      };
      const createdTask = await taskApi.createTask(taskWithProject);
      setAllTasks(prev => [...prev, createdTask]);
      setShowNewTaskModal(false);
      setNewTask({
        title: '',
        description: '',
        status: 'To Do',
        dueDate: '',
        priority: 'medium',
        tags: [],
        timeEstimate: 60,
        impact: 'medium',
        urgency: 'normal',
      });
    } catch (error) {
      console.error('Error creating task:', error);
      alert('Failed to create task. Please try again.');
    }
  };

  // Function to handle updating a task
  const handleUpdateTask = async (taskId: string, updates: Partial<Task>) => {
    try {
      // Ensure dates are properly formatted
      const formattedUpdates = {
        ...updates,
        dueDate: updates.dueDate ? new Date(updates.dueDate).toISOString() : undefined
      };
      
      const updatedTask = await taskApi.updateTask(taskId, formattedUpdates);
      setAllTasks(prev => prev.map(task => 
        task.id === taskId ? updatedTask : task
      ));
    } catch (error) {
      console.error('Error updating task:', error);
      alert('Failed to update task. Please try again.');
    }
  };

  // Function to handle deleting a task
  const handleDeleteTask = async (taskId: string) => {
    try {
      await taskApi.deleteTask(taskId);
      setAllTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
    } catch (error) {
      console.error('Failed to delete task:', error);
      alert('Failed to delete task. Please try again.');
    }
  };

  // Function to handle project completion
  const handleProjectComplete = (projectId: string) => {
    const projectToComplete = projects.find(p => p.id === projectId);
    if (!projectToComplete) return;

    // Update the project's completion status
    const updatedProject = { ...projectToComplete, isCompleted: true };
    
    // Remove from active projects and add to completed projects
    setProjects(prev => prev.filter(p => p.id !== projectId));
    setCompletedProjects(prev => [...prev, updatedProject]);
    
    // If the completed project was active, set a new active project
    if (activeProjectId === projectId) {
      const newActiveProject = projects.find(p => p.id !== projectId);
      if (newActiveProject) {
        setActiveProjectId(newActiveProject.id);
      }
    }
  };

  // Function to handle project reactivation
  const handleProjectReactivate = (projectId: string) => {
    const projectToReactivate = completedProjects.find(p => p.id === projectId);
    if (!projectToReactivate) return;

    // Update the project's completion status
    const updatedProject = { ...projectToReactivate, isCompleted: false };
    
    // Remove from completed projects and add to active projects
    setCompletedProjects(prev => prev.filter(p => p.id !== projectId));
    setProjects(prev => [...prev, updatedProject]);
  };

  // Function to handle starting a task
  const handleStartTask = async (taskId: string) => {
    try {
      const updatedTask = await taskApi.updateTask(taskId, { status: 'In Progress' });
      setAllTasks(prevTasks => 
        prevTasks.map(task => task.id === taskId ? updatedTask : task)
      );
      setShowTaskDetailsModal(false);
      setSelectedTask(null);
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };

  // Function to handle completing a task
  const handleCompleteTask = async (taskId: string) => {
    try {
      const updatedTask = await taskApi.updateTask(taskId, { status: 'Completed' });
      setAllTasks(prevTasks => 
        prevTasks.map(task => task.id === taskId ? updatedTask : task)
      );
      setShowTaskDetailsModal(false);
      setSelectedTask(null);
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };

  return (
    <div className="flex h-screen bg-[#0A0A0A] text-white">
      <Sidebar activeView="dashboard" />
      <div className="flex-1 overflow-y-auto">
        <ProjectsPage
          projects={projects}
          completedProjects={completedProjects}
          activeProjectId={activeProjectId}
          onProjectSelect={setActiveProjectId}
          onProjectComplete={handleProjectComplete}
          onProjectReactivate={handleProjectReactivate}
          tasks={allTasks}
          onTaskDelete={handleDeleteTask}
          onAddTaskUrl={(projectId, url) => {
            router.push(`/dashboard?projectId=${projectId}`);
          }}
        />
      </div>
    </div>
  );
}
