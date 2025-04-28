import React, { useState } from 'react';
import { Project, Task } from '../types';
import ProjectCard from './ProjectCard';
import TaskSelectionModal from './TaskSelectionModal';
import AddTaskLinkModal from './AddTaskLinkModal';
import { PlusIcon } from '@heroicons/react/24/outline';

interface ProjectsPageProps {
  projects: Project[];
  completedProjects: Project[];
  activeProjectId: string;
  onProjectSelect: (projectId: string) => void;
  onProjectComplete: (projectId: string) => void;
  onProjectReactivate: (projectId: string) => void;
  tasks: Task[];
  completedTasks: Task[];
  onTaskDelete: (taskId: string) => void;
  onTaskComplete: (taskId: string) => void;
  onTaskReactivate: (taskId: string) => void;
  onAddTaskUrl: (projectId: string, url: string) => void;
}

type ProjectType = 'all' | 'main' | 'side';

const ProjectsPage: React.FC<ProjectsPageProps> = ({
  projects,
  completedProjects,
  activeProjectId,
  onProjectSelect,
  onProjectComplete,
  onProjectReactivate,
  tasks,
  completedTasks,
  onTaskDelete,
  onTaskComplete,
  onTaskReactivate,
  onAddTaskUrl,
}) => {
  const [projectType, setProjectType] = useState<ProjectType>('all');
  const [showAddTaskLinkModal, setShowAddTaskLinkModal] = useState(false);

  const filteredProjects = projects.filter(project => {
    if (projectType === 'all') return true;
    return projectType === 'main' ? project.isMainProject : !project.isMainProject;
  });

  const filteredCompletedProjects = completedProjects.filter(project => {
    if (projectType === 'all') return true;
    return projectType === 'main' ? project.isMainProject : !project.isMainProject;
  });

  const handleAddTaskLink = () => {
    setShowAddTaskLinkModal(true);
  };

  const handleTaskLinkSubmit = (taskName: string, taskUrl: string) => {
    if (!activeProjectId) {
      alert('Please select a project first');
      return;
    }
    onAddTaskUrl(activeProjectId, taskUrl);
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-8">
        {/* Header Section */}
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-12 w-1 bg-blue-500 rounded-full"></div>
            <div>
              <h1 className="text-4xl font-bold text-white">Projects</h1>
              <p className="text-neutral-400 mt-2">Manage your active and completed projects</p>
            </div>
          </div>

          {/* Project Type Filter and Add Task Link Button */}
          <div className="flex items-center justify-between mt-6 mb-6">
            <div className="flex items-center gap-2 bg-neutral-800 rounded-lg p-1">
              <button
                onClick={() => setProjectType('all')}
                className={`px-4 py-2 rounded-md transition-colors ${
                  projectType === 'all'
                    ? 'bg-neutral-700 text-white'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                All Projects
              </button>
              <button
                onClick={() => setProjectType('main')}
                className={`px-4 py-2 rounded-md transition-colors ${
                  projectType === 'main'
                    ? 'bg-neutral-700 text-white'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                Main Projects
              </button>
              <button
                onClick={() => setProjectType('side')}
                className={`px-4 py-2 rounded-md transition-colors ${
                  projectType === 'side'
                    ? 'bg-neutral-700 text-white'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                Side Projects
              </button>
            </div>

            <button
              onClick={handleAddTaskLink}
              className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              <PlusIcon className="h-5 w-5" />
              Add Task Link
            </button>
          </div>

          {/* Project Stats */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-neutral-800 rounded-lg">
              <span className="w-3 h-3 bg-green-500 rounded-full"></span>
              <span className="text-sm text-neutral-300">{filteredProjects.length} Active</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-neutral-800 rounded-lg">
              <span className="w-3 h-3 bg-neutral-500 rounded-full"></span>
              <span className="text-sm text-neutral-300">{filteredCompletedProjects.length} Completed</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-neutral-800 rounded-lg">
              <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
              <span className="text-sm text-neutral-300">{tasks.length} Active Tasks</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-neutral-800 rounded-lg">
              <span className="w-3 h-3 bg-purple-500 rounded-full"></span>
              <span className="text-sm text-neutral-300">{completedTasks.length} Completed Tasks</span>
            </div>
          </div>
        </div>

        {/* Active Projects Section */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-2xl font-bold text-white">Active Projects</h2>
            <div className="flex-1 h-px bg-neutral-800"></div>
          </div>
          {filteredProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map(project => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  tasks={tasks.filter(task => task.projectId === project.id)}
                  completedTasks={completedTasks.filter(task => task.projectId === project.id)}
                  isActive={activeProjectId === project.id}
                  onComplete={() => onProjectComplete(project.id)}
                  onTaskComplete={onTaskComplete}
                  onTaskReactivate={onTaskReactivate}
                  onTaskDelete={onTaskDelete}
                  onAddTaskUrl={onAddTaskUrl}
                />
              ))}
            </div>
          ) : (
            <div className="bg-neutral-900 rounded-xl p-8 text-center border border-neutral-800">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-neutral-800 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-white mb-2">No Active Projects</h3>
              <p className="text-neutral-400">Create a new project to get started</p>
            </div>
          )}
        </div>

        {/* Completed Projects Section */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-2xl font-bold text-white">Completed Projects</h2>
            <div className="flex-1 h-px bg-neutral-800"></div>
          </div>
          {filteredCompletedProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCompletedProjects.map(project => {
                const projectTasks = completedTasks.filter(task => task.projectId === project.id);
                console.log(`Project ${project.name} (${project.id}) completed tasks:`, projectTasks);
                return (
                  <div key={project.id} className="bg-neutral-900 rounded-lg p-4 mb-4">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold">{project.name}</h3>
                        {project.description && (
                          <p className="text-neutral-400 text-sm mt-1">{project.description}</p>
                        )}
                      </div>
                      <button
                        onClick={() => onProjectReactivate(project.id)}
                        className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                      >
                        Reactivate
                      </button>
                    </div>
                    
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-neutral-400 mb-2">Completed Tasks</h4>
                      {projectTasks.length > 0 ? (
                        <div className="space-y-2">
                          {projectTasks.map(task => (
                            <div key={task.id} className="bg-neutral-800 rounded p-3">
                              <div className="flex justify-between items-start">
                                <div>
                                  <p className="font-medium">{task.title}</p>
                                  <p className="text-sm text-neutral-400">
                                    Created: {new Date(task.dateCreated).toLocaleDateString()}
                                  </p>
                                </div>
                                {task.url && (
                                  <a
                                    href={task.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-400 hover:text-blue-300 text-sm"
                                  >
                                    View Link
                                  </a>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-neutral-500 text-sm">No completed tasks for this project</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-neutral-900 rounded-xl p-8 text-center border border-neutral-800">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-neutral-800 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-white mb-2">No Completed Projects</h3>
              <p className="text-neutral-400">Complete a project to see it here</p>
            </div>
          )}
        </div>
      </div>

      {/* Add Task Link Modal */}
      <AddTaskLinkModal
        isOpen={showAddTaskLinkModal}
        onClose={() => setShowAddTaskLinkModal(false)}
        onAdd={handleTaskLinkSubmit}
        projects={[...filteredProjects, ...filteredCompletedProjects]}
        activeProjectId={activeProjectId}
        onProjectSelect={onProjectSelect}
      />
    </div>
  );
};

export default ProjectsPage; 