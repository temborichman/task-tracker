'use client';

import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { Task, TaskStatus, TaskTag, TaskUrgency, TaskPriority, TaskImpact } from '../types';
import {
  CalendarIcon,
  ChartBarIcon,
  CheckCircleIcon,
  ClockIcon,
  FlagIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

interface DailyBrief {
  date: Date;
  completed: number;
  added: number;
  upcoming: number;
  productivity: number;
}

export default function BriefsPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [dailyBriefs, setDailyBriefs] = useState<DailyBrief[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showInsights, setShowInsights] = useState(true);

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
      // ... more mock tasks ...
    ];
    setTasks(mockTasks);
  }, []);

  // Calculate daily briefs
  useEffect(() => {
    const calculateBriefs = () => {
      const today = new Date();
      const briefs: DailyBrief[] = [];

      // Generate briefs for the last 7 days
      for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        date.setHours(0, 0, 0, 0);

        const nextDay = new Date(date);
        nextDay.setDate(nextDay.getDate() + 1);

        const dayTasks = tasks.filter(task => {
          const taskDate = new Date(task.dateCreated);
          return taskDate >= date && taskDate < nextDay;
        });

        briefs.push({
          date: date,
          completed: dayTasks.filter(t => t.status === 'Completed').length,
          added: dayTasks.length,
          upcoming: dayTasks.filter(t => new Date(t.dueDate) > date).length,
          productivity: dayTasks.filter(t => t.status === 'Completed').length / Math.max(dayTasks.length, 1) * 100
        });
      }

      setDailyBriefs(briefs);
    };

    calculateBriefs();
  }, [tasks]);

  const selectedBrief = dailyBriefs.find(brief => 
    brief.date.toDateString() === selectedDate.toDateString()
  ) || dailyBriefs[0];

  const getProductivityTrend = () => {
    if (dailyBriefs.length < 2) return 0;
    const today = dailyBriefs[0].productivity;
    const yesterday = dailyBriefs[1].productivity;
    return today - yesterday;
  };

  return (
    <div className="flex h-screen bg-[#0A0A0A] text-white">
      <Sidebar activeView="briefs" />
      
      <div className="flex-1 overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-neutral-800">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h1 className="text-2xl font-bold text-white">Daily Briefs</h1>
              <p className="text-neutral-400">Track your daily progress and insights</p>
            </div>
            <button
              onClick={() => setShowInsights(!showInsights)}
              className="px-4 py-2 bg-neutral-800 text-neutral-400 rounded-lg hover:text-white hover:bg-neutral-700 transition-colors"
            >
              {showInsights ? 'Hide' : 'Show'} Insights
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Daily Overview Cards */}
          {selectedBrief && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-neutral-900 rounded-xl p-4 border border-neutral-800">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-500/10 rounded-xl">
                    <CheckCircleIcon className="h-6 w-6 text-green-500" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{selectedBrief.completed}</div>
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
                    <div className="text-2xl font-bold">{selectedBrief.added}</div>
                    <div className="text-sm text-neutral-400">New Tasks</div>
                  </div>
                </div>
              </div>

              <div className="bg-neutral-900 rounded-xl p-4 border border-neutral-800">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-500/10 rounded-xl">
                    <CalendarIcon className="h-6 w-6 text-purple-500" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{selectedBrief.upcoming}</div>
                    <div className="text-sm text-neutral-400">Upcoming Tasks</div>
                  </div>
                </div>
              </div>

              <div className="bg-neutral-900 rounded-xl p-4 border border-neutral-800">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-yellow-500/10 rounded-xl">
                    <ChartBarIcon className="h-6 w-6 text-yellow-500" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold">{Math.round(selectedBrief.productivity)}%</span>
                      {getProductivityTrend() > 0 ? (
                        <ArrowTrendingUpIcon className="h-5 w-5 text-green-500" />
                      ) : (
                        <ArrowTrendingDownIcon className="h-5 w-5 text-red-500" />
                      )}
                    </div>
                    <div className="text-sm text-neutral-400">Productivity</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Timeline */}
          <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-6">
            <h2 className="text-lg font-semibold mb-4">Daily Timeline</h2>
            <div className="space-y-4">
              {dailyBriefs.map((brief, index) => (
                <button
                  key={brief.date.toISOString()}
                  onClick={() => setSelectedDate(brief.date)}
                  className={`w-full p-4 rounded-lg transition-all ${
                    selectedDate.toDateString() === brief.date.toDateString()
                      ? 'bg-green-500/10 border border-green-500/20'
                      : 'bg-neutral-800 hover:bg-neutral-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CalendarIcon className={`h-5 w-5 ${
                        selectedDate.toDateString() === brief.date.toDateString()
                          ? 'text-green-500'
                          : 'text-neutral-400'
                      }`} />
                      <div className="text-left">
                        <div className="font-medium">
                          {index === 0 ? 'Today' : 
                           index === 1 ? 'Yesterday' :
                           brief.date.toLocaleDateString('en-US', { 
                             weekday: 'long',
                             month: 'short',
                             day: 'numeric'
                           })}
                        </div>
                        <div className="text-sm text-neutral-400">
                          {brief.completed} completed, {brief.added} new tasks
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-lg text-sm ${
                        brief.productivity >= 75 ? 'bg-green-500/10 text-green-500' :
                        brief.productivity >= 50 ? 'bg-yellow-500/10 text-yellow-500' :
                        'bg-red-500/10 text-red-500'
                      }`}>
                        {Math.round(brief.productivity)}% productive
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Insights Section */}
          {showInsights && (
            <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-6">
              <div className="flex items-center gap-2 mb-4">
                <SparklesIcon className="h-5 w-5 text-yellow-500" />
                <h2 className="text-lg font-semibold">Daily Insights</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-neutral-800 rounded-lg">
                  <h3 className="text-sm font-medium text-neutral-400 mb-2">Most Productive Time</h3>
                  <p className="text-lg">Morning (9 AM - 12 PM)</p>
                </div>
                <div className="p-4 bg-neutral-800 rounded-lg">
                  <h3 className="text-sm font-medium text-neutral-400 mb-2">Task Distribution</h3>
                  <div className="flex items-center gap-4">
                    <div className="flex-1 bg-neutral-700 rounded-full h-2">
                      <div 
                        className="bg-green-500 rounded-full h-2" 
                        style={{ width: `${selectedBrief?.productivity || 0}%` }}
                      />
                    </div>
                    <span className="text-sm">{Math.round(selectedBrief?.productivity || 0)}%</span>
                  </div>
                </div>
                <div className="p-4 bg-neutral-800 rounded-lg">
                  <h3 className="text-sm font-medium text-neutral-400 mb-2">Priority Focus</h3>
                  <div className="flex items-center gap-2">
                    <FlagIcon className="h-5 w-5 text-red-500" />
                    <span>High priority tasks: 2</span>
                  </div>
                </div>
                <div className="p-4 bg-neutral-800 rounded-lg">
                  <h3 className="text-sm font-medium text-neutral-400 mb-2">Efficiency Score</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">4.5</span>
                    <div className="flex text-yellow-500">
                      {'★'.repeat(4)}{'☆'.repeat(1)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 