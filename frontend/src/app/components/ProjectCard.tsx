import { Project, Task } from '../types';
import TaskList from './TaskList';
import { PlusIcon, LinkIcon } from '@heroicons/react/24/outline';

interface ProjectCardProps {
  project: Project;
  tasks: Task[];
  isActive?: boolean;
  onComplete?: () => void;
  onReactivate?: () => void;
  onTaskDelete: (taskId: string) => void;
  onAddTaskUrl?: (projectId: string, url: string) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  tasks,
  isActive = false,
  onComplete,
  onReactivate,
  onTaskDelete,
  onAddTaskUrl,
}) => {
  const handleAddTaskUrl = () => {
    const url = prompt('Enter the task URL:');
    if (url && onAddTaskUrl) {
      onAddTaskUrl(project.id, url);
    }
  };

  return (
    <div className={`bg-neutral-900 rounded-lg p-6 ${
      isActive ? 'ring-2 ring-green-500' : ''
    }`}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-medium text-white">{project.name}</h3>
          {project.taskUrls && project.taskUrls.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {project.taskUrls.map((url, index) => (
                <a
                  key={index}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-sm bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 transition-colors"
                >
                  <LinkIcon className="h-4 w-4" />
                  Task {index + 1}
                </a>
              ))}
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          {onAddTaskUrl && (
            <button
              onClick={handleAddTaskUrl}
              className="p-2 rounded-lg bg-neutral-800 text-neutral-400 hover:bg-neutral-700 hover:text-white transition-colors"
              title="Add Task URL"
            >
              <PlusIcon className="h-5 w-5" />
            </button>
          )}
          {onComplete && (
            <button
              onClick={onComplete}
              className="text-green-500 hover:text-green-400 transition-colors"
            >
              Complete Project
            </button>
          )}
          {onReactivate && (
            <button
              onClick={onReactivate}
              className="text-green-500 hover:text-green-400 transition-colors"
            >
              Reactivate Project
            </button>
          )}
        </div>
      </div>
      
      <TaskList
        tasks={tasks}
        onTaskDelete={onTaskDelete}
      />
    </div>
  );
};

export default ProjectCard; 