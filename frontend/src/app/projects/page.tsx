'use client';

import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import ProjectsPage from '../components/ProjectsPage';
import { Project, Task } from '../types';
import { taskService } from '../services/taskService';
import { projectService } from '../services/projectService';

export default function ProjectsRoutePage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [completedProjects, setCompletedProjects] = useState<Project[]>([]);
  const [activeProjectId, setActiveProjectId] = useState<string>('');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [completedTasks, setCompletedTasks] = useState<Task[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load projects
        const allProjects = await projectService.getAllProjects();
        console.log('Loaded projects:', allProjects);
        const activeProjects = allProjects.filter(project => !project.isCompleted);
        const completedProjects = allProjects.filter(project => project.isCompleted);
        setProjects(activeProjects);
        setCompletedProjects(completedProjects);
        console.log('Active projects:', activeProjects);
        console.log('Completed projects:', completedProjects);

        // Load tasks
        const allTasks = await taskService.getAllTasks();
        const activeTasks = allTasks.filter(task => task.status !== 'Completed');
        const completedTasks = allTasks.filter(task => task.status === 'Completed');
        setTasks(activeTasks);
        setCompletedTasks(completedTasks);
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };

    loadData();
  }, []);

  const handleAddTaskUrl = (projectId: string, url: string) => {
    setProjects(projects.map(project => {
      if (project.id === projectId) {
        return {
          ...project,
          taskUrls: [...(project.taskUrls || []), url]
        };
      }
      return project;
    }));
  };

  const handleTaskComplete = async (taskId: string) => {
    try {
      const completedTask = await taskService.completeTask(taskId);
      setTasks(tasks.filter(t => t.id !== taskId));
      setCompletedTasks([...completedTasks, completedTask]);
    } catch (error) {
      console.error('Error completing task:', error);
    }
  };

  const handleTaskReactivate = async (taskId: string) => {
    try {
      const reactivatedTask = await taskService.reactivateTask(taskId);
      setCompletedTasks(completedTasks.filter(t => t.id !== taskId));
      setTasks([...tasks, reactivatedTask]);
    } catch (error) {
      console.error('Error reactivating task:', error);
    }
  };

  return (
    <div className="flex h-screen bg-neutral-950 text-white">
      <Sidebar activeView="projects" />
      
      <div className="flex-1 overflow-y-auto">
        <ProjectsPage
          projects={projects}
          completedProjects={completedProjects}
          activeProjectId={activeProjectId}
          onProjectSelect={setActiveProjectId}
          onProjectComplete={(projectId) => {
            const project = projects.find(p => p.id === projectId);
            if (project) {
              setProjects(projects.filter(p => p.id !== projectId));
              setCompletedProjects([...completedProjects, project]);
            }
          }}
          onProjectReactivate={(projectId) => {
            const project = completedProjects.find(p => p.id === projectId);
            if (project) {
              setCompletedProjects(completedProjects.filter(p => p.id !== projectId));
              setProjects([...projects, project]);
            }
          }}
          tasks={tasks}
          completedTasks={completedTasks}
          onTaskDelete={async (taskId) => {
            try {
              await taskService.deleteTask(taskId);
              setTasks(tasks.filter(t => t.id !== taskId));
              setCompletedTasks(completedTasks.filter(t => t.id !== taskId));
            } catch (error) {
              console.error('Error deleting task:', error);
            }
          }}
          onTaskComplete={handleTaskComplete}
          onTaskReactivate={handleTaskReactivate}
          onAddTaskUrl={handleAddTaskUrl}
        />
      </div>
    </div>
  );
} 