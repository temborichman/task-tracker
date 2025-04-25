'use client';

import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { TaskCard } from '../components/TaskCard';
import { Task, TaskStatus, TaskPriority, TaskTag, TaskImpact, TaskUrgency } from '../types';
import { 
  XMarkIcon, 
  PlusIcon, 
  FunnelIcon,
  CalendarIcon,
  TagIcon,
  ClockIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  MagnifyingGlassIcon,
  CheckCircleIcon,
  CircleStackIcon,
  ChevronRightIcon,
  ClipboardIcon,
  FlagIcon,
  ChartBarIcon,
  EllipsisHorizontalIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import { taskService } from '../services/taskService';

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<'All' | TaskStatus>('All');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showBriefing, setShowBriefing] = useState<boolean>(true);
  const [timeOfDay, setTimeOfDay] = useState<'morning' | 'afternoon' | 'evening'>('morning');
  const [showNewTaskModal, setShowNewTaskModal] = useState<boolean>(false);
  const [showFilterPanel, setShowFilterPanel] = useState<boolean>(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showTaskDetailsModal, setShowTaskDetailsModal] = useState<boolean>(false);

  const [newTask, setNewTask] = useState<Omit<Task, 'id' | 'dateCreated'>>({
    title: '',
    description: '',
    status: 'To Do',
    dueDate: '',
    priority: 'medium',
    tags: [],
    timeEstimate: 60,
    impact: 'medium',
    urgency: 'normal',
    projectId: ''
  });

  // Filter state
  const [filterCriteria, setFilterCriteria] = useState<{
    priorities: TaskPriority[];
    dueDateRange: 'all' | 'today' | 'this_week' | 'overdue' | { start: string, end: string };
    tags: TaskTag[];
  }>({ priorities: [], dueDateRange: 'all', tags: [] });

  useEffect(() => {
    // Determine time of day for greeting
    const hour = new Date().getHours();
    if (hour < 12) setTimeOfDay('morning');
    else if (hour < 18) setTimeOfDay('afternoon');
    else setTimeOfDay('evening');
  }, []);

  // Load tasks from server on component mount
  useEffect(() => {
    const loadTasks = async () => {
      try {
        const tasks = await taskService.getAllTasks();
        setTasks(tasks);
      } catch (error) {
        console.error('Error loading tasks:', error);
      }
    };
    loadTasks();
  }, []);

  const handleCreateTask = async () => {
    try {
      const taskWithId = await taskService.createTask({
        ...newTask,
        projectId: ''
      });
      setTasks(prev => [...prev, taskWithId]);
      setShowNewTaskModal(false);
      setNewTask({
        title: '',
        description: '',
        status: 'To Do',
        dueDate: '',
        priority: 'medium',
        tags: [],
        timeEstimate: 60,
        impact: 'medium',
        urgency: 'normal',
        projectId: ''
      });
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const handleUpdateTask = async (taskId: string, updates: Partial<Task>) => {
    try {
      const updatedTask = await taskService.updateTask(taskId, updates);
      setTasks(prev => prev.map(task => 
        task.id === taskId ? updatedTask : task
      ));
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await taskService.deleteTask(taskId);
      setTasks(prev => prev.filter(task => task.id !== taskId));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleStartTask = async (taskId: string) => {
    await handleUpdateTask(taskId, { status: 'In Progress' });
    setShowTaskDetailsModal(false);
    setSelectedTask(null);
  };

  const handleCompleteTask = async (taskId: string) => {
    await handleUpdateTask(taskId, { status: 'Completed' });
    setShowTaskDetailsModal(false);
    setSelectedTask(null);
  };

  const filteredTasks = tasks.filter(task => {
    if (activeTab === 'All') return true;
    return task.status === activeTab;
  });

  // Calculate task statistics
  const taskStats = {
    todo: tasks.filter(task => task.status === 'To Do').length,
    inProgress: tasks.filter(task => task.status === 'In Progress').length,
    completed: tasks.filter(task => task.status === 'Completed').length,
    get total() {
      return tasks.length;
    },
    get completionRate() {
      return this.total === 0 ? 0 : Math.round((this.completed / this.total) * 100);
    }
  };

  // Calculate briefing data
  const getBriefingData = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return {
      tasksToday: tasks.filter(task => {
        const taskDate = new Date(task.dueDate);
        taskDate.setHours(0, 0, 0, 0);
        return taskDate.getTime() === today.getTime();
      }).length,

      todaysFocus: tasks
        .filter(task => task.status !== 'Completed')
        .sort((a, b) => {
          // Sort by priority first
          const priorityOrder = { high: 0, medium: 1, low: 2 };
          if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
            return priorityOrder[a.priority] - priorityOrder[b.priority];
          }
          // Then by due date
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        })[0],

      recentActivity: {
        completed: tasks.filter(task => {
          const completedDate = task.status === 'Completed' ? new Date(task.dateCreated) : null;
          if (!completedDate) return false;
          completedDate.setHours(0, 0, 0, 0);
          const yesterday = new Date(today);
          yesterday.setDate(yesterday.getDate() - 1);
          return completedDate.getTime() === yesterday.getTime();
        }).length,
        inProgress: tasks.filter(task => task.status === 'In Progress').length
      }
    };
  };

  const briefingData = getBriefingData();

  return (
    <div className="flex h-screen bg-[#0A0A0A] text-white">
      <Sidebar activeView="dashboard" />
      
      <div className="flex-1 overflow-y-auto">
        {/* Header Section */}
        <div className="p-4 sm:p-6 border-b border-neutral-800">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-white">Dashboard</h1>
              <p className="text-sm sm:text-base text-neutral-400">Welcome back, here's your task overview</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search tasks..."
                  className="w-full sm:w-64 px-4 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <MagnifyingGlassIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-500" />
              </div>
              <button 
                onClick={() => setShowNewTaskModal(true)}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                New Task
              </button>
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="bg-neutral-900 rounded-xl p-4 border border-neutral-800">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-yellow-500/10 rounded-xl">
                  <ClockIcon className="h-6 w-6 text-yellow-500" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{taskStats.todo}</div>
                  <div className="text-sm text-neutral-400">To Do</div>
                </div>
              </div>
            </div>

            <div className="bg-neutral-900 rounded-xl p-4 border border-neutral-800">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-500/10 rounded-xl">
                  <ClockIcon className="h-6 w-6 text-blue-500" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{taskStats.inProgress}</div>
                  <div className="text-sm text-neutral-400">In Progress</div>
                </div>
              </div>
            </div>

            <div className="bg-neutral-900 rounded-xl p-4 border border-neutral-800">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-500/10 rounded-xl">
                  <CheckCircleIcon className="h-6 w-6 text-green-500" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{taskStats.completed}</div>
                  <div className="text-sm text-neutral-400">Completed</div>
                </div>
              </div>
            </div>

            <div className="bg-neutral-900 rounded-xl p-4 border border-neutral-800">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-500/10 rounded-xl">
                  <ChartBarIcon className="h-6 w-6 text-purple-500" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{Math.round(taskStats.completionRate)}%</div>
                  <div className="text-sm text-neutral-400">Completion Rate</div>
                </div>
              </div>
            </div>
          </div>

          {/* Task List */}
          <div className="bg-neutral-900 rounded-xl border border-neutral-800">
            <div className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <h2 className="text-xl font-bold">Tasks</h2>
                <div className="flex gap-2 overflow-x-auto sm:overflow-visible">
                  {['All', 'To Do', 'In Progress', 'Completed'].map((status) => (
                    <button
                      key={status}
                      onClick={() => setActiveTab(status as TaskStatus)}
                      className={`px-4 py-2 rounded-lg text-sm whitespace-nowrap ${
                        activeTab === status
                          ? 'bg-green-500 text-white'
                          : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                {filteredTasks.map((task) => (
                  <div
                    key={task.id}
                    className="bg-neutral-800 rounded-lg p-4 border border-neutral-700"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${
                          task.status === 'Completed' ? 'bg-green-500/10' :
                          task.status === 'In Progress' ? 'bg-blue-500/10' :
                          'bg-yellow-500/10'
                        }`}>
                          {task.status === 'Completed' ? (
                            <CheckCircleIcon className="h-5 w-5 text-green-500" />
                          ) : task.status === 'In Progress' ? (
                            <ClockIcon className="h-5 w-5 text-blue-500" />
                          ) : (
                            <ClockIcon className="h-5 w-5 text-yellow-500" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-medium">{task.title}</h3>
                          <p className="text-sm text-neutral-400">{task.description}</p>
                          <div className="flex gap-2 mt-2">
                            <span className={`px-2 py-1 rounded text-xs ${
                              task.priority === 'high' ? 'bg-red-500/10 text-red-500' :
                              task.priority === 'medium' ? 'bg-yellow-500/10 text-yellow-500' :
                              'bg-green-500/10 text-green-500'
                            }`}>
                              {task.priority}
                            </span>
                            {task.tags.map((tag) => (
                              <span key={tag} className="px-2 py-1 bg-neutral-700 rounded text-xs text-neutral-300">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedTask(task);
                          setShowTaskDetailsModal(true);
                        }}
                        className="p-2 text-neutral-400 hover:text-white"
                      >
                        <EllipsisHorizontalIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* New Task Modal */}
      {showNewTaskModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-neutral-900 rounded-xl border border-neutral-800 w-full max-w-lg max-h-[85vh] flex flex-col">
            {/* Fixed Header */}
            <div className="p-6 border-b border-neutral-800">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-semibold text-white">Create New Task</h2>
                  <p className="text-sm text-neutral-400 mt-1">Add a new task to your dashboard</p>
                </div>
                <button
                  onClick={() => setShowNewTaskModal(false)}
                  className="p-2 rounded-lg hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-5">
                {/* Title Input */}
                <div>
                  <label className="block text-sm font-medium text-neutral-400 mb-1.5">
                    Title
                  </label>
                  <input
                    type="text"
                    value={newTask.title}
                    onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter task title"
                    className="w-full bg-neutral-800 text-white rounded-lg px-4 py-2.5 border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all placeholder:text-neutral-500"
                  />
                </div>

                {/* Description Input */}
                <div>
                  <label className="block text-sm font-medium text-neutral-400 mb-1.5">
                    Description
                  </label>
                  <textarea
                    value={newTask.description}
                    onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Enter task description"
                    rows={3}
                    className="w-full bg-neutral-800 text-white rounded-lg px-4 py-2.5 border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all placeholder:text-neutral-500 resize-none"
                  />
                </div>

                {/* Due Date and Priority */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-400 mb-1.5">
                      Due Date
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        value={newTask.dueDate}
                        onChange={(e) => setNewTask(prev => ({ ...prev, dueDate: e.target.value }))}
                        className="w-full bg-neutral-800 text-white rounded-lg px-4 py-2.5 border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all"
                      />
                      <CalendarIcon className="h-5 w-5 text-neutral-500 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-400 mb-1.5">
                      Priority
                    </label>
                    <div className="relative">
                      <select
                        value={newTask.priority}
                        onChange={(e) => setNewTask(prev => ({ ...prev, priority: e.target.value as TaskPriority }))}
                        className="w-full bg-neutral-800 text-white rounded-lg px-4 py-2.5 border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all appearance-none"
                      >
                        <option value="low">Low Priority</option>
                        <option value="medium">Medium Priority</option>
                        <option value="high">High Priority</option>
                      </select>
                      <FlagIcon className="h-5 w-5 text-neutral-500 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Tags Input */}
                <div>
                  <label className="block text-sm font-medium text-neutral-400 mb-1.5">
                    Tags
                  </label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {newTask.tags.map((tag, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-sm bg-purple-500/10 text-purple-500"
                      >
                        <TagIcon className="h-4 w-4" />
                        {tag}
                        <button
                          onClick={() => setNewTask(prev => ({
                            ...prev,
                            tags: prev.tags.filter((_, i) => i !== index)
                          }))}
                          className="hover:text-purple-400 transition-colors"
                        >
                          <XMarkIcon className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <select
                      onChange={(e) => {
                        if (e.target.value && !newTask.tags.includes(e.target.value as TaskTag)) {
                          setNewTask(prev => ({
                            ...prev,
                            tags: [...prev.tags, e.target.value as TaskTag]
                          }));
                        }
                        e.target.value = '';
                      }}
                      className="flex-1 bg-neutral-800 text-white rounded-lg px-4 py-2.5 border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all appearance-none"
                      defaultValue=""
                    >
                      <option value="" disabled>Add a tag</option>
                      <option value="work">Work</option>
                      <option value="personal">Personal</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                </div>

                {/* Time Estimate */}
                <div>
                  <label className="block text-sm font-medium text-neutral-400 mb-1.5">
                    Time Estimate (minutes)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      value={newTask.timeEstimate}
                      onChange={(e) => setNewTask(prev => ({ ...prev, timeEstimate: parseInt(e.target.value) || 0 }))}
                      className="w-full bg-neutral-800 text-white rounded-lg px-4 py-2.5 border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all"
                    />
                    <ClockIcon className="h-5 w-5 text-neutral-500 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* Impact and Urgency */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-400 mb-1.5">
                      Impact
                    </label>
                    <select
                      value={newTask.impact}
                      onChange={(e) => setNewTask(prev => ({ ...prev, impact: e.target.value as TaskImpact }))}
                      className="w-full bg-neutral-800 text-white rounded-lg px-4 py-2.5 border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all appearance-none"
                    >
                      <option value="low">Low Impact</option>
                      <option value="medium">Medium Impact</option>
                      <option value="high">High Impact</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-400 mb-1.5">
                      Urgency
                    </label>
                    <select
                      value={newTask.urgency}
                      onChange={(e) => setNewTask(prev => ({ ...prev, urgency: e.target.value as TaskUrgency }))}
                      className="w-full bg-neutral-800 text-white rounded-lg px-4 py-2.5 border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all appearance-none"
                    >
                      <option value="low">Low Urgency</option>
                      <option value="normal">Normal Urgency</option>
                      <option value="high">High Urgency</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Fixed Footer */}
            <div className="p-6 border-t border-neutral-800">
              <div className="flex gap-3">
                <button
                  onClick={() => setShowNewTaskModal(false)}
                  className="flex-1 px-4 py-2.5 rounded-lg border border-neutral-700 text-neutral-400 hover:text-white hover:bg-neutral-800 transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateTask}
                  className="flex-1 px-4 py-2.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all duration-200 font-medium"
                >
                  Create Task
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Task Details Modal */}
      {showTaskDetailsModal && selectedTask && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-neutral-900 rounded-xl border border-neutral-800 w-full max-w-lg max-h-[85vh] flex flex-col">
            {/* Fixed Header */}
            <div className="p-6 border-b border-neutral-800">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-semibold text-white">{selectedTask.title}</h2>
                  <p className="text-sm text-neutral-400 mt-1">Task Details</p>
                </div>
                <button
                  onClick={() => {
                    setShowTaskDetailsModal(false);
                    setSelectedTask(null);
                  }}
                  className="p-2 rounded-lg hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-6">
                {/* Description */}
                <div>
                  <h3 className="text-sm font-medium text-neutral-400 mb-2">Description</h3>
                  <p className="text-white">{selectedTask.description || 'No description provided'}</p>
                </div>

                {/* Status and Priority */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-neutral-400 mb-2">Status</h3>
                    <select
                      value={selectedTask.status}
                      onChange={(e) => handleUpdateTask(selectedTask.id, { status: e.target.value as TaskStatus })}
                      className="w-full bg-neutral-800 text-white rounded-lg px-4 py-2 border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all"
                    >
                      <option value="To Do">To Do</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-neutral-400 mb-2">Priority</h3>
                    <select
                      value={selectedTask.priority}
                      onChange={(e) => handleUpdateTask(selectedTask.id, { priority: e.target.value as TaskPriority })}
                      className="w-full bg-neutral-800 text-white rounded-lg px-4 py-2 border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>

                {/* Due Date and Time Estimate */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-neutral-400 mb-2">Due Date</h3>
                    <div className="relative">
                      <input
                        type="date"
                        value={selectedTask.dueDate ? new Date(selectedTask.dueDate).toISOString().split('T')[0] : ''}
                        onChange={(e) => handleUpdateTask(selectedTask.id, { dueDate: e.target.value })}
                        className="w-full bg-neutral-800 text-white rounded-lg px-4 py-2 border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all"
                      />
                      <CalendarIcon className="h-5 w-5 text-neutral-500 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-neutral-400 mb-2">Time Estimate</h3>
                    <div className="relative">
                      <input
                        type="number"
                        min="0"
                        value={selectedTask.timeEstimate}
                        onChange={(e) => handleUpdateTask(selectedTask.id, { timeEstimate: parseInt(e.target.value) || 0 })}
                        className="w-full bg-neutral-800 text-white rounded-lg px-4 py-2 border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all"
                      />
                      <ClockIcon className="h-5 w-5 text-neutral-500 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <h3 className="text-sm font-medium text-neutral-400 mb-2">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedTask.tags.map((tag, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-sm bg-purple-500/10 text-purple-500"
                      >
                        <TagIcon className="h-4 w-4" />
                        {tag}
                        <button
                          onClick={() => {
                            const newTags = selectedTask.tags.filter((_, i) => i !== index);
                            handleUpdateTask(selectedTask.id, { tags: newTags });
                          }}
                          className="hover:text-purple-400 transition-colors"
                        >
                          <XMarkIcon className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => {
                        const newTag = prompt('Enter a new tag:');
                        if (newTag && !selectedTask.tags.includes(newTag)) {
                          handleUpdateTask(selectedTask.id, { tags: [...selectedTask.tags, newTag] });
                        }
                      }}
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-sm bg-neutral-800 text-neutral-400 hover:bg-neutral-700 hover:text-white transition-colors"
                    >
                      <PlusIcon className="h-4 w-4" />
                      Add Tag
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Fixed Footer */}
            <div className="p-6 border-t border-neutral-800">
              <div className="flex gap-3">
                {selectedTask.status === 'To Do' && (
                  <button
                    onClick={() => {
                      handleUpdateTask(selectedTask.id, { status: 'In Progress' });
                      setShowTaskDetailsModal(false);
                    }}
                    className="flex-1 px-4 py-2.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium flex items-center justify-center gap-2"
                  >
                    <ArrowUpIcon className="h-5 w-5" />
                    Start Task
                  </button>
                )}
                {selectedTask.status === 'In Progress' && (
                  <button
                    onClick={() => {
                      handleUpdateTask(selectedTask.id, { status: 'Completed' });
                      setShowTaskDetailsModal(false);
                    }}
                    className="flex-1 px-4 py-2.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium flex items-center justify-center gap-2"
                  >
                    <CheckCircleIcon className="h-5 w-5" />
                    Complete Task
                  </button>
                )}
                <button
                  onClick={() => {
                    handleDeleteTask(selectedTask.id);
                    setShowTaskDetailsModal(false);
                  }}
                  className="flex-1 px-4 py-2.5 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 transition-colors font-medium flex items-center justify-center gap-2"
                >
                  <TrashIcon className="h-5 w-5" />
                  Delete Task
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 