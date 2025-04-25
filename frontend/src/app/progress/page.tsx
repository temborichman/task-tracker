'use client';

import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { Task, TaskStatus } from '../types';
import {
  ChartBarIcon,
  CheckCircleIcon,
  ClockIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CalendarIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

interface ProgressStats {
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  todoTasks: number;
  completionRate: number;
  averageCompletionTime: number;
  productivityScore: number;
  dailyProgress: {
    date: string;
    completed: number;
    added: number;
  }[];
}

export default function ProgressPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [stats, setStats] = useState<ProgressStats>({
    totalTasks: 0,
    completedTasks: 0,
    inProgressTasks: 0,
    todoTasks: 0,
    completionRate: 0,
    averageCompletionTime: 0,
    productivityScore: 0,
    dailyProgress: []
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
        status: 'In Progress' as TaskStatus,
        dueDate: '2024-04-15',
        priority: 'high',
        tags: ['backend', 'security'],
        timeEstimate: 180,
        impact: 'high',
        urgency: 'urgent',
        dateCreated: '2024-04-10'
      },
      {
        id: '2',
        projectId: 'proj-1',
        title: 'Design landing page',
        description: 'Create responsive landing page design',
        status: 'Completed' as TaskStatus,
        dueDate: '2024-04-20',
        priority: 'medium',
        tags: ['frontend', 'design'],
        timeEstimate: 120,
        impact: 'medium',
        urgency: 'normal',
        dateCreated: '2024-04-11',
        dateCompleted: '2024-04-13'
      }
    ];
    setTasks(mockTasks);
  }, []);

  // Calculate progress stats
  useEffect(() => {
    if (tasks.length === 0) return;

    const completedTasks = tasks.filter(t => t.status === 'Completed').length;
    const inProgressTasks = tasks.filter(t => t.status === 'In Progress').length;
    const todoTasks = tasks.filter(t => t.status === 'To Do').length;
    const totalTasks = tasks.length;
    const completionRate = (completedTasks / totalTasks) * 100;

    // Calculate average completion time
    const completedTasksWithDates = tasks.filter(t => t.status === 'Completed' && t.dateCreated && t.dateCompleted);
    const averageCompletionTime = completedTasksWithDates.length > 0
      ? completedTasksWithDates.reduce((acc, task) => {
          const startDate = new Date(task.dateCreated);
          const endDate = new Date(task.dateCompleted!);
          const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          return acc + diffDays;
        }, 0) / completedTasksWithDates.length
      : 0;

    // Calculate productivity score (simple metric for now)
    const productivityScore = Math.min(100, (completionRate * 0.7) + (inProgressTasks / totalTasks * 30));

    // Generate daily progress data
    const dailyProgress = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      return {
        date: dateStr,
        completed: tasks.filter(t => t.status === 'Completed' && t.dateCompleted === dateStr).length,
        added: tasks.filter(t => t.dateCreated === dateStr).length
      };
    }).reverse();

    setStats({
      totalTasks,
      completedTasks,
      inProgressTasks,
      todoTasks,
      completionRate,
      averageCompletionTime,
      productivityScore,
      dailyProgress
    });
  }, [tasks]);

  return (
    <div className="flex h-screen bg-[#0A0A0A] text-white">
      <Sidebar activeView="progress" />
      
      <div className="flex-1 overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-neutral-800">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h1 className="text-2xl font-bold text-white">Progress Overview</h1>
              <p className="text-neutral-400">Track your task completion and productivity</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-neutral-900 rounded-xl p-4 border border-neutral-800">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-500/10 rounded-xl">
                  <CheckCircleIcon className="h-6 w-6 text-green-500" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{stats.completedTasks}</div>
                  <div className="text-sm text-neutral-400">Completed Tasks</div>
                </div>
              </div>
            </div>

            <div className="bg-neutral-900 rounded-xl p-4 border border-neutral-800">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-500/10 rounded-xl">
                  <ClockIcon className="h-6 w-6 text-blue-500" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{stats.inProgressTasks}</div>
                  <div className="text-sm text-neutral-400">In Progress</div>
                </div>
              </div>
            </div>

            <div className="bg-neutral-900 rounded-xl p-4 border border-neutral-800">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-yellow-500/10 rounded-xl">
                  <ChartBarIcon className="h-6 w-6 text-yellow-500" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{Math.round(stats.completionRate)}%</div>
                  <div className="text-sm text-neutral-400">Completion Rate</div>
                </div>
              </div>
            </div>

            <div className="bg-neutral-900 rounded-xl p-4 border border-neutral-800">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-500/10 rounded-xl">
                  <SparklesIcon className="h-6 w-6 text-purple-500" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{Math.round(stats.productivityScore)}</div>
                  <div className="text-sm text-neutral-400">Productivity Score</div>
                </div>
              </div>
            </div>
          </div>

          {/* Daily Progress */}
          <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-6">
            <h3 className="text-lg font-semibold mb-4">Daily Progress</h3>
            <div className="space-y-4">
              {stats.dailyProgress.map((day, index) => (
                <div key={day.date} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CalendarIcon className="h-5 w-5 text-neutral-400" />
                    <div>
                      <div className="font-medium">
                        {index === 0 ? 'Today' : 
                         index === 1 ? 'Yesterday' :
                         new Date(day.date).toLocaleDateString('en-US', { 
                           weekday: 'long',
                           month: 'short',
                           day: 'numeric'
                         })}
                      </div>
                      <div className="text-sm text-neutral-400">
                        {day.completed} completed, {day.added} new tasks
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {day.completed > 0 && (
                      <ArrowTrendingUpIcon className="h-5 w-5 text-green-500" />
                    )}
                    {day.completed === 0 && day.added > 0 && (
                      <ArrowTrendingDownIcon className="h-5 w-5 text-yellow-500" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Task Distribution */}
          <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-6">
            <h3 className="text-lg font-semibold mb-4">Task Distribution</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span>Completed</span>
                </div>
                <span className="text-neutral-400">{stats.completedTasks} tasks</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span>In Progress</span>
                </div>
                <span className="text-neutral-400">{stats.inProgressTasks} tasks</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <span>To Do</span>
                </div>
                <span className="text-neutral-400">{stats.todoTasks} tasks</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 