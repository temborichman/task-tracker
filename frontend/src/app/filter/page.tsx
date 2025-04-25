'use client';

import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { Task, TaskStatus, TaskTag, TaskUrgency, TaskPriority, TaskImpact } from '../types';
import {
  FunnelIcon,
  XMarkIcon,
  CheckCircleIcon,
  ClockIcon,
  TagIcon,
  FlagIcon,
  ArrowTrendingUpIcon,
  CalendarIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';

export default function FilterPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<{
    status: TaskStatus[];
    priority: TaskPriority[];
    tags: TaskTag[];
    impact: TaskImpact[];
    urgency: TaskUrgency[];
  }>({
    status: [],
    priority: [],
    tags: [],
    impact: [],
    urgency: []
  });

  // Simulate loading tasks
  useEffect(() => {
    // TODO: Replace with actual API call
    const mockTasks = [
      {
        id: '1',
        projectId: 'proj-1',
        title: 'Implement user authentication',
        description: 'Add JWT-based authentication system',
        status: 'in_progress' as TaskStatus,
        dueDate: '2024-04-15',
        priority: 'high' as TaskPriority,
        tags: ['backend', 'security'] as TaskTag[],
        timeEstimate: 180,
        impact: 'high' as TaskImpact,
        urgency: 'urgent' as TaskUrgency,
        dateCreated: '2024-04-10'
      },
      {
        id: '2',
        projectId: 'proj-1',
        title: 'Design landing page',
        description: 'Create responsive landing page design',
        status: 'todo' as TaskStatus,
        dueDate: '2024-04-20',
        priority: 'medium' as TaskPriority,
        tags: ['frontend', 'design'] as TaskTag[],
        timeEstimate: 120,
        impact: 'medium' as TaskImpact,
        urgency: 'normal' as TaskUrgency,
        dateCreated: '2024-04-11'
      }
    ];
    setTasks(mockTasks);
    setFilteredTasks(mockTasks);
  }, []);

  // Apply filters when they change
  useEffect(() => {
    let filtered = [...tasks];

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply status filters
    if (activeFilters.status.length > 0) {
      filtered = filtered.filter(task => activeFilters.status.includes(task.status));
    }

    // Apply priority filters
    if (activeFilters.priority.length > 0) {
      filtered = filtered.filter(task => activeFilters.priority.includes(task.priority));
    }

    // Apply tag filters
    if (activeFilters.tags.length > 0) {
      filtered = filtered.filter(task =>
        task.tags.some(tag => activeFilters.tags.includes(tag))
      );
    }

    // Apply impact filters
    if (activeFilters.impact.length > 0) {
      filtered = filtered.filter(task => activeFilters.impact.includes(task.impact));
    }

    // Apply urgency filters
    if (activeFilters.urgency.length > 0) {
      filtered = filtered.filter(task => activeFilters.urgency.includes(task.urgency));
    }

    setFilteredTasks(filtered);
  }, [tasks, searchQuery, activeFilters]);

  const toggleFilter = (
    type: 'status' | 'priority' | 'tags' | 'impact' | 'urgency',
    value: TaskStatus | TaskPriority | TaskTag | TaskImpact | TaskUrgency
  ) => {
    setActiveFilters(prev => {
      const newFilters = { ...prev };
      if (type === 'status') {
        newFilters.status = prev.status.includes(value as TaskStatus)
          ? prev.status.filter(status => status !== value)
          : [...prev.status, value as TaskStatus];
      } else if (type === 'priority') {
        newFilters.priority = prev.priority.includes(value as TaskPriority)
          ? prev.priority.filter(priority => priority !== value)
          : [...prev.priority, value as TaskPriority];
      } else if (type === 'tags') {
        newFilters.tags = prev.tags.includes(value as TaskTag)
          ? prev.tags.filter(tag => tag !== value)
          : [...prev.tags, value as TaskTag];
      } else if (type === 'impact') {
        newFilters.impact = prev.impact.includes(value as TaskImpact)
          ? prev.impact.filter(impact => impact !== value)
          : [...prev.impact, value as TaskImpact];
      } else if (type === 'urgency') {
        newFilters.urgency = prev.urgency.includes(value as TaskUrgency)
          ? prev.urgency.filter(urgency => urgency !== value)
          : [...prev.urgency, value as TaskUrgency];
      }
      return newFilters;
    });
  };

  const clearFilters = () => {
    setActiveFilters({
      status: [],
      priority: [],
      tags: [],
      impact: [],
      urgency: []
    });
    setSearchQuery('');
  };

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case 'To Do': return 'bg-yellow-500/10 text-yellow-500';
      case 'In Progress': return 'bg-blue-500/10 text-blue-500';
      case 'Completed': return 'bg-green-500/10 text-green-500';
      default: return 'bg-gray-500/10 text-gray-500';
    }
  };

  const getPriorityColor = (priority: TaskPriority) => {
    switch (priority) {
      case 'high': return 'bg-red-500/10 text-red-500';
      case 'medium': return 'bg-yellow-500/10 text-yellow-500';
      case 'low': return 'bg-green-500/10 text-green-500';
      default: return 'bg-gray-500/10 text-gray-500';
    }
  };

  const renderFilterSection = (
    title: string,
    type: 'status' | 'priority' | 'tags' | 'impact' | 'urgency',
    values: (TaskStatus | TaskPriority | TaskTag | TaskImpact | TaskUrgency)[]
  ) => (
    <div className="mb-6">
      <h3 className="text-sm font-medium text-gray-700 mb-2">{title}</h3>
      <div className="space-y-2">
        {values.map(value => (
          <button
            key={value}
            onClick={() => toggleFilter(type, value)}
            className={`w-full text-left px-3 py-2 rounded-md text-sm ${
              (type === 'status' && activeFilters.status.includes(value as TaskStatus)) ||
              (type === 'priority' && activeFilters.priority.includes(value as TaskPriority)) ||
              (type === 'tags' && activeFilters.tags.includes(value as TaskTag)) ||
              (type === 'impact' && activeFilters.impact.includes(value as TaskImpact)) ||
              (type === 'urgency' && activeFilters.urgency.includes(value as TaskUrgency))
                ? 'bg-green-100 text-green-800'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            {value}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-[#0A0A0A] text-white">
      <Sidebar activeView="filter" />
      
      <div className="flex-1 overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-neutral-800">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h1 className="text-2xl font-bold text-white">Task Filter</h1>
              <p className="text-neutral-400">Filter and find your tasks</p>
            </div>
            <button
              onClick={clearFilters}
              className="px-4 py-2 bg-neutral-800 text-neutral-400 rounded-lg hover:text-white hover:bg-neutral-700 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Search and Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Search Bar */}
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-3 h-5 w-5 text-neutral-400" />
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Active Filters */}
            <div className="flex flex-wrap gap-2">
              {Object.entries(activeFilters).map(([category, values]) =>
                values.map(value => (
                  <button
                    key={`${category}-${value}`}
                    onClick={() => toggleFilter(category as keyof typeof activeFilters, value)}
                    className="flex items-center gap-2 px-3 py-1 bg-neutral-800 text-neutral-300 rounded-lg hover:bg-neutral-700 transition-colors"
                  >
                    <span className="capitalize">{value}</span>
                    <XMarkIcon className="h-4 w-4" />
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Filter Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Status Filter */}
            <div className="bg-neutral-900 rounded-xl p-4 border border-neutral-800">
              <h3 className="text-lg font-semibold mb-3">Status</h3>
              <div className="space-y-2">
                {(['To Do', 'In Progress', 'Completed'] as const).map(status => (
                  <button
                    key={status}
                    onClick={() => toggleFilter('status', status)}
                    className={`w-full flex items-center justify-between p-2 rounded-lg transition-colors ${
                      activeFilters.status.includes(status)
                        ? 'bg-blue-500/10 text-blue-500'
                        : 'hover:bg-neutral-800'
                    }`}
                  >
                    <span className="capitalize">{status}</span>
                    <span className={`px-2 py-1 rounded text-sm ${getStatusColor(status)}`}>
                      {tasks.filter(t => t.status === status).length}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Priority Filter */}
            <div className="bg-neutral-900 rounded-xl p-4 border border-neutral-800">
              <h3 className="text-lg font-semibold mb-3">Priority</h3>
              <div className="space-y-2">
                {['high', 'medium', 'low'].map(priority => (
                  <button
                    key={priority}
                    onClick={() => toggleFilter('priority', priority as TaskPriority)}
                    className={`w-full flex items-center justify-between p-2 rounded-lg transition-colors ${
                      activeFilters.priority.includes(priority as TaskPriority)
                        ? 'bg-blue-500/10 text-blue-500'
                        : 'hover:bg-neutral-800'
                    }`}
                  >
                    <span className="capitalize">{priority}</span>
                    <span className={`px-2 py-1 rounded text-sm ${getPriorityColor(priority as TaskPriority)}`}>
                      {tasks.filter(t => t.priority === priority).length}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Tags Filter */}
            <div className="bg-neutral-900 rounded-xl p-4 border border-neutral-800">
              <h3 className="text-lg font-semibold mb-3">Tags</h3>
              <div className="space-y-2">
                {['frontend', 'backend', 'design', 'security'].map(tag => (
                  <button
                    key={tag}
                    onClick={() => toggleFilter('tags', tag as TaskTag)}
                    className={`w-full flex items-center justify-between p-2 rounded-lg transition-colors ${
                      activeFilters.tags.includes(tag as TaskTag)
                        ? 'bg-blue-500/10 text-blue-500'
                        : 'hover:bg-neutral-800'
                    }`}
                  >
                    <span className="capitalize">{tag}</span>
                    <span className="px-2 py-1 rounded text-sm bg-neutral-800">
                      {tasks.filter(t => t.tags.includes(tag as TaskTag)).length}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="bg-neutral-900 rounded-xl border border-neutral-800 overflow-hidden">
            <div className="p-4 border-b border-neutral-800">
              <h3 className="text-lg font-semibold">
                Results ({filteredTasks.length} tasks)
              </h3>
            </div>
            <div className="divide-y divide-neutral-800">
              {filteredTasks.map(task => (
                <div key={task.id} className="p-4 hover:bg-neutral-800 transition-colors">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium">{task.title}</h4>
                      <p className="text-sm text-neutral-400 mt-1">{task.description}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className={`px-2 py-1 rounded text-sm ${getStatusColor(task.status)}`}>
                          {task.status.replace('_', ' ')}
                        </span>
                        <span className={`px-2 py-1 rounded text-sm ${getPriorityColor(task.priority)}`}>
                          {task.priority}
                        </span>
                        {task.tags.map(tag => (
                          <span key={tag} className="px-2 py-1 rounded text-sm bg-neutral-800">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="h-5 w-5 text-neutral-400" />
                      <span className="text-sm text-neutral-400">
                        Due {new Date(task.dueDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 