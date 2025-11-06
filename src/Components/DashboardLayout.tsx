// Components/DashboardLayout.tsx - UPDATED WITHOUT SETTINGS
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, User, Clock, Heart, Users, Images, Calendar,
  Download, Menu, LogOut, X
} from 'lucide-react';

interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface MemorialData {
  id: string;
  name: string;
  isPublished?: boolean;
}

interface DashboardLayoutProps {
  children: React.ReactNode;
  activeSection: string;
  onSectionChange: (section: string) => void;
  memorialData: MemorialData | null;
}

const sidebarSections = [
  { id: 'overview', name: 'Overview', icon: LayoutDashboard },
  { id: 'profile', name: 'Profile', icon: User },
  { id: 'timeline', name: 'Timeline', icon: Clock },
  { id: 'favorites', name: 'Favorites', icon: Heart },
  { id: 'family', name: 'Family Tree', icon: Users },
  { id: 'gallery', name: 'Gallery', icon: Images },
  { id: 'service', name: 'Service', icon: Calendar },
  { id: 'memory-wall', name: 'Memory Wall', icon: Heart },
  { id: 'download', name: 'Download & Share', icon: Download },
];

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  activeSection,
  onSectionChange,
  memorialData,
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);

  useEffect(() => {
    // Get user data from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userId');
    localStorage.removeItem('currentMemorialId');
    window.location.href = '/';
  };

  return (
    <div className="bg-gray-50 flex min-h-screen">
      {/* Mobile sidebar backdrop with better touch handling */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-60 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Improved mobile responsiveness */}
      <div className={`
        fixed top-0 bottom-0 left-0 z-50 w-[85vw] max-w-sm bg-white shadow-2xl transform transition-all duration-300 ease-in-out lg:translate-x-0 lg:sticky lg:top-0 lg:z-30 lg:w-80
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full border-r-2 border-gray-200">
          {/* Mobile Header - Improved spacing */}
          <div className="lg:hidden flex items-center justify-between p-4 border-b border-gray-200 bg-white">
            <h2 className="text-lg font-semibold text-gray-800">Menu</h2>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-2 text-gray-500 hover:text-gray-700 transition-colors rounded-lg hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Decorative Top Bar - Hidden on mobile */}
          <div className="hidden lg:block h-1 bg-gradient-to-r from-amber-400 via-orange-400 to-amber-400"></div>
          
          {/* Header - Better mobile spacing */}
          <div className="p-3 lg:p-6 border-b-2 border-gray-200 bg-gradient-to-br from-amber-50 to-orange-50">
            {/* User Info - Enhanced mobile layout */}
            {user && (
              <div className="flex items-center gap-3 p-3 bg-white rounded-xl shadow-sm border border-amber-200">
                <div className="w-12 h-12 lg:w-14 lg:h-14 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center shrink-0">
                  <span className="text-white text-base lg:text-lg font-bold">
                    {user.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate">{user.name}</p>
                  <p className="text-xs text-gray-600 truncate mt-0.5">{user.email}</p>
                  <p className="text-xs text-amber-600 font-medium mt-1 capitalize">{user.role || 'Member'}</p>
                </div>
              </div>
            )}
          </div>

          {/* Navigation - Better touch targets for mobile */}
          <nav className="flex-1 p-2 lg:p-4 space-y-1 overflow-y-auto">
            {sidebarSections.map((section) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => {
                    onSectionChange(section.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-4 lg:py-3 rounded-xl transition-all duration-200 ease-in-out ${
                    activeSection === section.id
                      ? 'bg-gradient-to-r from-amber-400 to-orange-400 text-white shadow-md'
                      : 'text-gray-600 hover:bg-gray-100 active:bg-gray-200'
                  }`}
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  <span className="font-medium text-sm lg:text-base">{section.name}</span>
                </button>
              );
            })}
          </nav>

          {/* Footer Actions - Settings removed, only Logout remains */}
          <div className="p-3 border-t-2 border-gray-200 space-y-2 bg-gray-50">
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-4 lg:py-3 text-red-600 hover:bg-red-50 active:bg-red-100 rounded-xl transition-all duration-200 text-sm lg:text-base border border-transparent hover:border-red-200"
            >
              <LogOut className="w-5 h-5 shrink-0" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen w-full lg:w-auto">
        {/* Decorative Line Below Navbar - Hidden on mobile */}
        <div className="hidden lg:block h-1 bg-gradient-to-r from-amber-400 via-orange-400 to-amber-400"></div>
        
        {/* Top bar - Enhanced mobile header */}
        <header className="bg-white shadow-sm border-b border-gray-200 shrink-0 sticky top-0 z-40">
          <div className="flex items-center justify-between px-4 py-3 sm:px-6">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-gray-600 hover:text-gray-800 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label="Open menu"
              >
                <Menu className="w-6 h-6" />
              </button>
              
              <div className="flex flex-col min-w-0">
                <h1 className="text-lg font-semibold text-gray-800 truncate max-w-[140px] xs:max-w-[200px] sm:max-w-none">
                  {memorialData?.name || 'Your Memorial'}
                </h1>
                <span className="text-xs text-gray-500 capitalize sm:hidden">
                  {activeSection.replace('-', ' ')}
                </span>
              </div>
            </div>

            {/* Status indicator - Better mobile visibility */}
            <div className="flex items-center">
              {memorialData?.isPublished && (
                <div className="px-3 py-1.5 bg-green-100 text-green-800 rounded-full text-xs font-medium border border-green-200 whitespace-nowrap">
                  <span className="hidden xs:inline">✓ Published</span>
                  <span className="xs:hidden">✓ Live</span>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page content - Improved mobile padding */}
        <main className="flex-1 overflow-y-auto p-3 xs:p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-gray-50 to-gray-100">
          <div className="max-w-7xl mx-auto w-full">
            {/* Mobile Section Title - Enhanced */}
            <div className="lg:hidden mb-4 xs:mb-6">
              <h2 className="text-xl xs:text-2xl font-bold text-gray-800 capitalize mb-1">
                {activeSection.replace('-', ' ')}
              </h2>
              {activeSection === 'overview' && (
                <p className="text-gray-600 text-sm xs:text-base">Manage your memorial content</p>
              )}
              {activeSection === 'download' && (
                <p className="text-gray-600 text-sm xs:text-base">Share and download memorial</p>
              )}
            </div>
            
            {/* Content area with better mobile constraints */}
            <div className="bg-white rounded-lg xs:rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 p-4 xs:p-6 min-h-[60vh]">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};