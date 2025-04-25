import React, { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { 
  HomeIcon, 
  DocumentTextIcon, 
  ClipboardDocumentListIcon,
  FunnelIcon,
  FolderIcon,
  Bars3Icon,
  ChartBarIcon,
  ChatBubbleLeftRightIcon,
  ChatBubbleLeftIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';

interface SidebarProps {
  activeView: 'dashboard' | 'briefs' | 'filter' | 'projects' | 'progress' | 'chat';
}

const Sidebar: React.FC<SidebarProps> = ({ activeView }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const handleViewChange = (view: 'dashboard' | 'briefs' | 'filter' | 'projects' | 'progress' | 'chat') => {
    router.push(`/${view}`);
  };

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <div className={`bg-neutral-900 h-screen flex flex-col transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'}`}>
      <div className="p-4 flex items-center justify-between">
        {!isCollapsed && <h1 className="text-xl font-bold text-green-500">HomieHub</h1>}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-neutral-400 hover:text-white"
        >
          <Bars3Icon className="h-6 w-6" />
        </button>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        <Link
          href="/dashboard"
          className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
            isActive('/dashboard') ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:bg-neutral-800 hover:text-white'
          }`}
        >
          <HomeIcon className="h-5 w-5" />
          {!isCollapsed && <span>Dashboard</span>}
        </Link>

        <Link
          href="/briefs"
          className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
            isActive('/briefs') ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:bg-neutral-800 hover:text-white'
          }`}
        >
          <DocumentTextIcon className="h-5 w-5" />
          {!isCollapsed && <span>Briefs</span>}
        </Link>

        <Link
          href="/filter"
          className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
            isActive('/filter') ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:bg-neutral-800 hover:text-white'
          }`}
        >
          <FunnelIcon className="h-5 w-5" />
          {!isCollapsed && <span>Filter</span>}
        </Link>

        <Link
          href="/projects"
          className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
            isActive('/projects') ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:bg-neutral-800 hover:text-white'
          }`}
        >
          <FolderIcon className="h-5 w-5" />
          {!isCollapsed && <span>Projects</span>}
        </Link>

        <Link
          href="/progress"
          className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
            isActive('/progress') ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:bg-neutral-800 hover:text-white'
          }`}
        >
          <ChartBarIcon className="h-5 w-5" />
          {!isCollapsed && <span>Progress</span>}
        </Link>

        <Link
          href="/chat"
          className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
            isActive('/chat') ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:bg-neutral-800 hover:text-white'
          }`}
        >
          <ChatBubbleLeftIcon className="h-5 w-5" />
          {!isCollapsed && <span>Chat</span>}
        </Link>
      </nav>

      {/* User Profile Section */}
      <div className="p-4 border-t border-neutral-800">
        <div className="flex items-center gap-3">
          <div className="bg-green-500 rounded-full h-8 w-8 flex items-center justify-center font-bold">
            R
          </div>
          {!isCollapsed && (
            <div>
              <div className="font-medium">Richman</div>
              <div className="text-xs text-neutral-400">Software Developer</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar; 