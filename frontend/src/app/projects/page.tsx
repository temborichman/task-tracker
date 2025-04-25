'use client';

import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import ProjectsPage from '../components/ProjectsPage';
import { Project, Task } from '../types';

export default function ProjectsRoutePage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [completedProjects, setCompletedProjects] = useState<Project[]>([]);
  const [activeProjectId, setActiveProjectId] = useState<string>('');
  const [tasks, setTasks] = useState<Task[]>([]);

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
          onTaskDelete={(taskId) => {
            setTasks(tasks.filter(t => t.id !== taskId));
          }}
          onAddTaskUrl={handleAddTaskUrl}
        />
      </div>
    </div>
  );
} 