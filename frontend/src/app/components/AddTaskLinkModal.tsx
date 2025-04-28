import React, { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { Project } from '../types';

interface AddTaskLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (taskName: string, taskUrl: string) => void;
  projects: Project[];
  activeProjectId: string;
  onProjectSelect: (projectId: string) => void;
}

const AddTaskLinkModal: React.FC<AddTaskLinkModalProps> = ({
  isOpen,
  onClose,
  onAdd,
  projects,
  activeProjectId,
  onProjectSelect,
}) => {
  const [taskName, setTaskName] = useState('');
  const [taskUrl, setTaskUrl] = useState('');

  useEffect(() => {
    console.log('Modal projects:', projects);
    console.log('Active project ID:', activeProjectId);
  }, [projects, activeProjectId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeProjectId) {
      alert('Please select a project first');
      return;
    }
    if (taskName && taskUrl) {
      onAdd(taskName, taskUrl);
      setTaskName('');
      setTaskUrl('');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-neutral-900 rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-white">Add Task Link</h2>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-white transition-colors"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="projectSelect" className="block text-sm font-medium text-neutral-300 mb-1">
              Select Project
            </label>
            <select
              id="projectSelect"
              value={activeProjectId}
              onChange={(e) => onProjectSelect(e.target.value)}
              className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            >
              <option value="">Select a project</option>
              {projects.map(project => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="taskName" className="block text-sm font-medium text-neutral-300 mb-1">
              Task Name
            </label>
            <input
              type="text"
              id="taskName"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter task name"
              required
            />
          </div>

          <div>
            <label htmlFor="taskUrl" className="block text-sm font-medium text-neutral-300 mb-1">
              Task URL
            </label>
            <input
              type="url"
              id="taskUrl"
              value={taskUrl}
              onChange={(e) => setTaskUrl(e.target.value)}
              className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter task URL"
              required
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-neutral-300 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              Add Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTaskLinkModal; 