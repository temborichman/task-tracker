import { Task } from '../types';

interface TaskItemProps {
  task: Task;
  onDelete: (taskId: string) => void;
  onComplete?: (taskId: string) => void;
  onReactivate?: (taskId: string) => void;
  isCompleted?: boolean;
}

const TaskItem: React.FC<TaskItemProps> = ({ 
  task, 
  onDelete, 
  onComplete,
  onReactivate,
  isCompleted = false
}) => {
  return (
    <div className="bg-neutral-800 rounded p-3">
      <div className="flex justify-between items-start">
        <div>
          <h4 className="font-medium">{task.title}</h4>
          <p className="text-sm text-neutral-400">{task.description}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-xs px-2 py-1 rounded-full ${
            task.status === 'Completed' ? 'bg-green-900 text-green-400' :
            task.status === 'In Progress' ? 'bg-blue-900 text-blue-400' :
            'bg-neutral-700 text-neutral-300'
          }`}>
            {task.status}
          </span>
          {!isCompleted && onComplete && (
            <button
              onClick={() => onComplete(task.id)}
              className="text-green-500 hover:text-green-400"
              title="Complete task"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </button>
          )}
          {isCompleted && onReactivate && (
            <button
              onClick={() => onReactivate(task.id)}
              className="text-blue-500 hover:text-blue-400"
              title="Reactivate task"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
              </svg>
            </button>
          )}
          <button
            onClick={() => onDelete(task.id)}
            className="text-red-500 hover:text-red-400"
            title="Delete task"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskItem; 