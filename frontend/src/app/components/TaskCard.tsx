import React from 'react';
import { Task, TaskStatus, TaskPriority, TaskTag } from '../types';
import { 
  CalendarIcon, 
  CheckCircleIcon,
  ClockIcon,
  FlagIcon,
  TagIcon,
  PencilSquareIcon,
  TrashIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';

interface TaskCardProps {
  task: Task;
  onStatusChange: (taskId: string, newStatus: TaskStatus) => void;
  onPriorityChange: (taskId: string, newPriority: TaskPriority) => void;
  onDelete: (taskId: string) => void;
  onEdit: (taskId: string) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onStatusChange,
  onPriorityChange,
  onDelete,
  onEdit,
}) => {
  const getStatusColor = (status: TaskStatus): { bg: string, text: string, icon: string } => {
    switch (status) {
      case 'To Do':
        return { 
          bg: 'bg-neutral-800',
          text: 'text-neutral-400',
          icon: 'text-neutral-400'
        };
      case 'In Progress':
        return { 
          bg: 'bg-blue-500/10',
          text: 'text-blue-500',
          icon: 'text-blue-500'
        };
      case 'Completed':
        return { 
          bg: 'bg-green-500/10',
          text: 'text-green-500',
          icon: 'text-green-500'
        };
      default:
        return { 
          bg: 'bg-neutral-800',
          text: 'text-neutral-400',
          icon: 'text-neutral-400'
        };
    }
  };

  const getPriorityColor = (priority: TaskPriority): { bg: string, text: string } => {
    switch (priority.toLowerCase()) {
      case 'high':
        return { 
          bg: 'bg-red-500/10',
          text: 'text-red-500'
        };
      case 'medium':
        return { 
          bg: 'bg-yellow-500/10',
          text: 'text-yellow-500'
        };
      case 'low':
        return { 
          bg: 'bg-green-500/10',
          text: 'text-green-500'
        };
      default:
        return { 
          bg: 'bg-neutral-800',
          text: 'text-neutral-400'
        };
    }
  };

  const statusColors = getStatusColor(task.status);
  const priorityColors = getPriorityColor(task.priority);
  const dueDate = new Date(task.dueDate);
  const isOverdue = dueDate < new Date() && task.status !== 'Completed';

  return (
    <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-4 hover:border-neutral-700 transition-all duration-200">
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-medium text-white mb-1">{task.title}</h3>
          <p className="text-sm text-neutral-400 line-clamp-2">{task.description}</p>
        </div>
        <div className="flex gap-2 ml-4">
          <button
            onClick={() => onEdit(task.id)}
            className="p-1.5 rounded-lg bg-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-700 transition-colors"
          >
            <PencilSquareIcon className="h-4 w-4" />
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="p-1.5 rounded-lg bg-neutral-800 text-neutral-400 hover:text-red-500 hover:bg-red-500/10 transition-colors"
          >
            <TrashIcon className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Status and Priority */}
      <div className="flex flex-wrap gap-2 mb-4">
        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-sm ${statusColors.bg} ${statusColors.text}`}>
          {task.status === 'Completed' ? (
            <CheckCircleIcon className={`h-4 w-4 ${statusColors.icon}`} />
          ) : task.status === 'In Progress' ? (
            <ClockIcon className={`h-4 w-4 ${statusColors.icon}`} />
          ) : (
            <ChevronRightIcon className={`h-4 w-4 ${statusColors.icon}`} />
          )}
          {task.status}
        </div>
        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-sm ${priorityColors.bg} ${priorityColors.text}`}>
          <FlagIcon className="h-4 w-4" />
          {task.priority}
        </div>
      </div>

      {/* Tags */}
      {task.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {task.tags.map((tag) => (
            <div
              key={tag}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-sm bg-purple-500/10 text-purple-500"
            >
              <TagIcon className="h-4 w-4" />
              {tag}
            </div>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-neutral-800">
        <div className={`flex items-center gap-1.5 text-sm ${isOverdue ? 'text-red-500' : 'text-neutral-400'}`}>
          <CalendarIcon className="h-4 w-4" />
          <span>
            {isOverdue ? 'Overdue: ' : 'Due: '}
            {dueDate.toLocaleDateString('en-US', { 
              month: 'short',
              day: 'numeric',
              year: dueDate.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
            })}
          </span>
        </div>

        <div className="flex gap-2">
          <select
            value={task.status}
            onChange={(e) => onStatusChange(task.id, e.target.value as TaskStatus)}
            className="text-sm bg-neutral-800 text-white rounded-lg px-3 py-1.5 border border-neutral-700 hover:border-neutral-600 focus:outline-none focus:ring-2 focus:ring-green-500/20 transition-all"
          >
            <option value="To Do">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
          <select
            value={task.priority}
            onChange={(e) => onPriorityChange(task.id, e.target.value as TaskPriority)}
            className="text-sm bg-neutral-800 text-white rounded-lg px-3 py-1.5 border border-neutral-700 hover:border-neutral-600 focus:outline-none focus:ring-2 focus:ring-green-500/20 transition-all"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
      </div>
    </div>
  );
}; 