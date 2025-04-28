import { Project, Task } from '../types';
import TaskList from './TaskList';
import { PlusIcon, LinkIcon } from '@heroicons/react/24/outline';

interface ProjectCardProps {
  project: Project;
  tasks: Task[];
  completedTasks: Task[];
  isActive?: boolean;
  onComplete?: () => void;
  onReactivate?: () => void;
  onTaskDelete: (taskId: string) => void;
  onTaskComplete: (taskId: string) => void;
  onTaskReactivate: (taskId: string) => void;
  onAddTaskUrl: (projectId: string, url: string) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  tasks,
  completedTasks,
  isActive = false,
  onComplete,
  onReactivate,
  onTaskDelete,
  onTaskComplete,
  onTaskReactivate,
  onAddTaskUrl,
}) => {
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
                  {url.split('/').pop() || `Task ${index + 1}`}
                </a>
              ))}
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          {onAddTaskUrl && (
            <button
              onClick={() => onAddTaskUrl(project.id, '')}
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
      
      {/* Active Tasks */}
      {tasks.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-neutral-400 mb-2">Active Tasks</h4>
          <TaskList
            tasks={tasks}
            onTaskDelete={onTaskDelete}
            onTaskComplete={onTaskComplete}
          />
        </div>
      )}

      {/* Completed Tasks */}
      {completedTasks.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-neutral-400 mb-2">Completed Tasks</h4>
          <TaskList
            tasks={completedTasks}
            onTaskDelete={onTaskDelete}
            onTaskReactivate={onTaskReactivate}
            isCompleted={true}
          />
        </div>
      )}

      {/* No Tasks Message */}
      {tasks.length === 0 && completedTasks.length === 0 && (
        <div className="text-center py-4 text-neutral-400">
          No tasks yet. Add some tasks to get started!
        </div>
      )}
    </div>
  );
};

export default ProjectCard; 