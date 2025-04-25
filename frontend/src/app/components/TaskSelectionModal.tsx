import { Task } from '../types';

interface TaskSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  tasks: Task[];
  onSelect: (taskId: string) => void;
}

const TaskSelectionModal: React.FC<TaskSelectionModalProps> = ({
  isOpen,
  onClose,
  tasks,
  onSelect,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-neutral-900 rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Select Task</h3>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-white"
          >
            ✕
          </button>
        </div>
        
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="flex items-center justify-between p-3 bg-neutral-800 rounded-lg hover:bg-neutral-700 cursor-pointer"
              onClick={() => onSelect(task.id)}
            >
              <div>
                <p className="font-medium">{task.title}</p>
                <p className="text-sm text-neutral-400">{task.description}</p>
              </div>
              <span className="text-sm text-neutral-400">
                {task.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TaskSelectionModal; 