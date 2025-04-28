'use client';

import { useState, useRef, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { PaperAirplaneIcon, UserIcon } from '@heroicons/react/24/outline';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load initial greeting
  useEffect(() => {
    const initialMessage: Message = {
      id: '1',
      content: `Hi! I'm Homie, your friendly task management assistant. I can help you with:

1. Learning New Skills
- Free courses and resources
- Skill development tips
- Learning strategies

2. Productivity & Organization
- Time management tools
- Task organization methods
- Workflow optimization

3. Mental Health & Well-being
- Stress management
- Focus techniques
- Work-life balance

4. Project Management
- Team collaboration
- Task tracking
- Project planning

What specific area would you like help with? I can provide:
- Free tools and resources
- Step-by-step guides
- Best practices
- Implementation tips

Just ask me anything!`,
      sender: 'bot',
      timestamp: new Date(),
    };
    setMessages([initialMessage]);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: 'user',
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate bot response with typing delay
    setTimeout(() => {
      const botResponse = generateBotResponse(inputMessage);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: botResponse,
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500); // Increased delay for more natural feel
  };

  const generateBotResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Navigation Help - Updated conditions
    if (lowerMessage.includes('how do i') || 
        lowerMessage.includes('where can i') || 
        lowerMessage.includes('how to') || 
        lowerMessage.includes('show me') ||
        lowerMessage.includes('where is') ||
        lowerMessage.includes('access') ||
        lowerMessage.includes('find') ||
        lowerMessage.includes('go to') ||
        lowerMessage.includes('navigate')) {
      
      // Check for specific destinations
      if (lowerMessage.includes('dashboard') || lowerMessage.includes('home') || lowerMessage.includes('main')) {
        return `To go to the Dashboard:
1. Click the dashboard icon in the sidebar (first icon)
2. Or use the navigation menu at the top
3. Or simply click on the app logo

The Dashboard is your main workspace where you can:
- View all your projects
- See task overviews
- Track progress
- Create new projects and tasks

Would you like more details about the Dashboard?`;
      }
      else if (lowerMessage.includes('project') || lowerMessage.includes('projects')) {
        return `To access Projects:
1. Go to the Dashboard first
2. Click on any project card to view details
3. Or use the "+" button to create a new project

In Projects you can:
- View all your active projects
- Create new projects
- Manage project details
- Track project progress

Would you like to know how to create a new project?`;
      }
      else if (lowerMessage.includes('task') || lowerMessage.includes('tasks')) {
        return `To work with Tasks:
1. Go to a specific project
2. Click "Add Task" to create a new task
3. Or view existing tasks in the task list

You can also:
- Filter tasks by status
- Sort tasks by priority
- Search for specific tasks
- Manage task details

Would you like to know how to create or manage tasks?`;
      }
      else if (lowerMessage.includes('filter') || lowerMessage.includes('search')) {
        return `To use the Filter page:
1. Click the filter icon in the sidebar
2. Use the filter options to:
   - Filter by status (To Do, In Progress, Completed)
   - Filter by priority (High, Medium, Low)
   - Filter by tags
   - Sort tasks in different ways

Would you like to know more about filtering options?`;
      }
      else if (lowerMessage.includes('chat') || lowerMessage.includes('help')) {
        return `You're already in the Chat! Here you can:
1. Ask me questions about the app
2. Get help with navigation
3. Learn about features
4. Get productivity tips

Just type your question and I'll help you!`;
      }
      else {
        return `I can help you navigate to different parts of the app:

1. Dashboard - Main workspace with projects and tasks
2. Projects - Create and manage your projects
3. Tasks - Create and track individual tasks
4. Filter - Organize and find tasks
5. Chat - Get help (you're here!)

Just ask me "How do I go to..." or "Where can I find..." followed by what you're looking for, and I'll guide you!`;
      }
    }

    // Dashboard Help
    else if (lowerMessage.includes('dashboard') || lowerMessage.includes('main') || lowerMessage.includes('home')) {
      return `The Dashboard is your main workspace! Here's what you can do:

1. View Projects
- See all your active projects
- Check project progress
- Access project details

2. Manage Tasks
- View all tasks across projects
- Filter tasks by status
- Sort tasks by priority or due date

3. Quick Actions
- Create new projects
- Add tasks to projects
- Mark tasks as complete

4. Project Stats
- Track completion rates
- Monitor deadlines
- View task distribution

To access the dashboard:
1. Click the dashboard icon in the sidebar
2. Or use the navigation menu
3. Or I can help you get there!

Would you like to know more about any specific dashboard feature?`;
    }

    // Projects Help
    else if (lowerMessage.includes('project') || lowerMessage.includes('create project') || lowerMessage.includes('manage project')) {
      return `Here's how to work with projects:

1. Creating Projects
- Click the "+" button in the dashboard
- Enter project name and details
- Set project priority and tags

2. Managing Projects
- View project details
- Add tasks to projects
- Track project progress
- Mark projects as complete

3. Project Features
- Task organization
- Progress tracking
- Deadline management
- Team collaboration

4. Project Views
- List view for quick overview
- Detail view for in-depth management
- Progress view for tracking

Would you like to know how to:
- Create a new project?
- Add tasks to a project?
- Track project progress?
- Or something else?`;
    }

    // Tasks Help
    else if (lowerMessage.includes('task') || lowerMessage.includes('create task') || lowerMessage.includes('manage task')) {
      return `Here's how to work with tasks:

1. Creating Tasks
- Click "Add Task" in a project
- Fill in task details:
  - Title and description
  - Due date
  - Priority level
  - Tags
  - Time estimate

2. Managing Tasks
- Update task status
- Edit task details
- Delete tasks
- Move tasks between projects

3. Task Organization
- Filter by status
- Sort by priority
- Group by tags
- Search tasks

4. Task Tracking
- Monitor deadlines
- Track progress
- View completion rates
- Set reminders

Would you like to know how to:
- Create a new task?
- Update task status?
- Organize your tasks?
- Or something else?`;
    }

    // Filter Help
    else if (lowerMessage.includes('filter') || lowerMessage.includes('sort') || lowerMessage.includes('find task')) {
      return `The Filter page helps you organize and find tasks easily:

1. Filtering Options
- By Status:
  - To Do
  - In Progress
  - Completed
- By Priority:
  - High
  - Medium
  - Low
- By Tags:
  - Custom tags
  - Project tags

2. Sorting Options
- By Due Date
- By Priority
- By Creation Date
- By Project

3. Search Features
- Quick search
- Advanced filters
- Tag-based search
- Project-based search

4. View Options
- List view
- Grid view
- Calendar view
- Progress view

Would you like to know how to:
- Filter tasks by status?
- Sort tasks by priority?
- Search for specific tasks?
- Or something else?`;
    }

    // Learning and Skill Development
    else if (lowerMessage.includes('learn') || lowerMessage.includes('skill') || lowerMessage.includes('course')) {
      return `Here are some excellent free resources for learning new skills:

1. freeCodeCamp
- Free interactive coding lessons and projects
- Link: https://www.freecodecamp.org
- Why: Hands-on coding practice with real-world projects

2. Khan Academy
- Free courses on various subjects
- Link: https://www.khanacademy.org
- Why: High-quality video lessons and practice exercises

3. Coursera (Free Courses)
- Free courses from top universities
- Link: https://www.coursera.org
- Why: Access to university-level education for free

4. edX
- Free courses from MIT, Harvard, and more
- Link: https://www.edx.org
- Why: World-class education without the cost

Would you like recommendations for a specific subject or skill?`;
    }
    
    // Productivity and Organization
    else if (lowerMessage.includes('productivity') || lowerMessage.includes('organize') || lowerMessage.includes('efficient')) {
      return `Here are some free tools and resources to boost your productivity:

1. Notion
- Free all-in-one workspace
- Link: https://www.notion.so
- Why: Flexible workspace for notes, tasks, and databases

2. Todoist
- Free task management app
- Link: https://todoist.com
- Why: Simple and powerful task organization

3. Google Workspace
- Free suite of productivity tools
- Link: https://workspace.google.com
- Why: Integrated tools for docs, sheets, and collaboration

4. Trello
- Free visual project management
- Link: https://trello.com
- Why: Kanban-style task organization

Would you like tips on implementing any of these tools?`;
    }

    // Mental Health and Well-being
    else if (lowerMessage.includes('stress') || lowerMessage.includes('anxiety') || lowerMessage.includes('mental') || lowerMessage.includes('wellness')) {
      return `Here are some free resources for mental health and well-being:

1. Headspace (Free Basics)
- Free meditation and mindfulness
- Link: https://www.headspace.com
- Why: Guided meditation for beginners

2. Calm (Free Version)
- Free meditation and sleep stories
- Link: https://www.calm.com
- Why: Relaxation and sleep support

3. MindShift CBT
- Free anxiety management app
- Link: https://www.anxietycanada.com/resources/mindshift-cbt
- Why: Evidence-based anxiety relief

4. Smiling Mind
- Free mindfulness meditation
- Link: https://www.smilingmind.com.au
- Why: Mindfulness for all ages

Would you like more specific resources for any of these areas?`;
    }

    // Time Management
    else if (lowerMessage.includes('time management') || lowerMessage.includes('schedule') || lowerMessage.includes('deadline')) {
      return `Here are some free resources to help with time management:

1. Pomodoro Technique Guide
- Simple yet effective time management method
- Link: https://todoist.com/productivity-methods/pomodoro-technique
- Why: Helps break work into focused intervals

2. Google Calendar
- Free calendar tool with time blocking
- Link: https://calendar.google.com
- Why: Great for scheduling and visualization

3. Forest App
- Free focus timer with gamification
- Link: https://www.forestapp.cc
- Why: Makes staying focused fun and rewarding

4. Toggl Track
- Free time tracking tool
- Link: https://toggl.com/track
- Why: Helps understand how you spend your time

Would you like tips on implementing any of these methods?`;
    }

    // Focus and Concentration
    else if (lowerMessage.includes('focus') || lowerMessage.includes('concentration') || lowerMessage.includes('distraction')) {
      return `Here are some free resources to improve focus:

1. Focus@Will
- Free background music for concentration
- Link: https://www.focusatwill.com
- Why: Scientifically designed music for focus

2. Noisli
- Free background noise generator
- Link: https://www.noisli.com
- Why: Customizable ambient sounds

3. Freedom
- Free website blocker
- Link: https://freedom.to
- Why: Blocks distracting websites

4. Cold Turkey
- Free focus mode app
- Link: https://getcoldturkey.com
- Why: Blocks distractions during work

Would you like to know more about any of these tools?`;
    }

    // Project Management
    else if (lowerMessage.includes('project') || lowerMessage.includes('team') || lowerMessage.includes('collaboration')) {
      return `Here are some free project management resources:

1. Asana (Free Version)
- Free project management tool
- Link: https://asana.com
- Why: Great for team collaboration

2. ClickUp (Free Version)
- Free all-in-one project management
- Link: https://clickup.com
- Why: Flexible and feature-rich

3. Notion (Free Version)
- Free workspace for projects
- Link: https://www.notion.so
- Why: Combines docs, tasks, and databases

4. Trello
- Free visual project management
- Link: https://trello.com
- Why: Simple and effective Kanban boards

Would you like tips on using any of these tools?`;
    }

    // General Help
    else {
      return `I'm here to help! I can assist you with:

1. Learning New Skills
- Free courses and resources
- Skill development tips
- Learning strategies

2. Productivity & Organization
- Time management tools
- Task organization methods
- Workflow optimization

3. Mental Health & Well-being
- Stress management
- Focus techniques
- Work-life balance

4. Project Management
- Team collaboration
- Task tracking
- Project planning

What specific area would you like help with? I can provide:
- Free tools and resources
- Step-by-step guides
- Best practices
- Implementation tips

Just ask me anything!`;
    }
  };

  return (
    <div className="flex h-screen bg-[#0A0A0A] text-white">
      <Sidebar activeView="chat" />
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="p-4 border-b border-neutral-800">
          <h1 className="text-2xl font-bold">Homie</h1>
          <p className="text-neutral-400">Your friendly task management assistant</p>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map(message => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-4 ${
                  message.sender === 'user'
                    ? 'bg-green-500 text-white'
                    : 'bg-neutral-800 text-white'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  {message.sender === 'user' ? (
                    <UserIcon className="h-5 w-5" />
                  ) : (
                    <div className="h-5 w-5 rounded-full bg-green-500 flex items-center justify-center">
                      <span className="text-xs font-bold">H</span>
                    </div>
                  )}
                  <span className="font-medium">
                    {message.sender === 'user' ? 'You' : 'Homie'}
                  </span>
                </div>
                <div className="whitespace-pre-wrap">{message.content}</div>
                <div className="text-xs opacity-50 mt-2">
                  {message.timestamp.toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-neutral-800 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <div className="h-5 w-5 rounded-full bg-green-500 flex items-center justify-center">
                    <span className="text-xs font-bold">H</span>
                  </div>
                  <span className="font-medium">Homie</span>
                </div>
                <div className="flex gap-1 mt-2">
                  <div className="w-2 h-2 bg-neutral-600 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-neutral-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  <div className="w-2 h-2 bg-neutral-600 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <form onSubmit={handleSendMessage} className="p-4 border-t border-neutral-800">
          <div className="flex gap-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask Homie for help..."
              className="flex-1 bg-neutral-800 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim()}
              className="bg-green-500 text-white rounded-lg px-4 py-2 hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <PaperAirplaneIcon className="h-5 w-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 