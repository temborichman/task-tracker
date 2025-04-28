import { Task } from '../types';
import TaskItem from './TaskItem';

interface TaskListProps {
  tasks: Task[];
  onTaskDelete: (taskId: string) => void;
  onTaskComplete?: (taskId: string) => void;
  onTaskReactivate?: (taskId: string) => void;
  isCompleted?: boolean;
}

const TaskList: React.FC<TaskListProps> = ({ 
  tasks, 
  onTaskDelete, 
  onTaskComplete,
  onTaskReactivate,
  isCompleted = false
}) => {
  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onDelete={onTaskDelete}
          onComplete={onTaskComplete}
          onReactivate={onTaskReactivate}
          isCompleted={isCompleted}
        />
      ))}
    </div>
  );
};

export default TaskList; 