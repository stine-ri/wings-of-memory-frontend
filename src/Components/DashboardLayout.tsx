// Components/DashboardLayout.tsx - FIXED VERSION
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, User, Clock, Heart, Users, Images, Calendar,
  Download, Menu, LogOut, X, ChevronDown, Plus
} from 'lucide-react';

interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface Memorial {
  id: string;
  name: string;
  createdAt: string;
  isPublished?: boolean;
}

interface MemorialData {
  id: string;
  name: string;
  isPublished?: boolean;
}

// Data Integrity Interface
interface DataIntegrityCheck {
  isComplete: boolean;
  missingSections: string[];
  totalSections: number;
  loadedSections: number;
}

export interface DashboardLayoutProps {
  children: React.ReactNode;
  activeSection: string;
  onSectionChange: (section: string) => void;
  memorialData: MemorialData | null;
  // New props for memorial management
  memorials?: Memorial[];
  currentMemorialId?: string;
  onSelectMemorial?: (id: string) => void;
  onCreateNew?: () => void;
  // Optional data status props
  dataStatus?: {
    loading?: boolean;
    error?: string | null;
    integrity?: DataIntegrityCheck;
  };
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

// Memorial Selector Component
const MemorialSelector: React.FC<{
  memorials: Memorial[];
  currentMemorialId: string;
  onSelectMemorial: (id: string) => void;
  onCreateNew: () => void;
}> = ({ memorials, currentMemorialId, onSelectMemorial, onCreateNew }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const currentMemorial = memorials.find(m => m.id === currentMemorialId);
  
  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between gap-2 px-4 py-3 bg-white border-2 border-amber-300 rounded-xl hover:bg-amber-50 transition-all shadow-sm"
      >
        <div className="flex-1 text-left min-w-0">
          <p className="text-xs text-amber-600 font-medium mb-0.5">Current Memorial</p>
          <p className="font-semibold text-sm text-gray-800 truncate">
            {currentMemorial?.name || 'Select Memorial'}
          </p>
        </div>
        <ChevronDown className={`w-4 h-4 text-amber-600 transition-transform shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-50" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-amber-300 rounded-xl shadow-xl z-50 max-h-80 overflow-y-auto">
            <div className="p-2">
              <button
                onClick={() => {
                  onCreateNew();
                  setIsOpen(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-3 text-left hover:bg-amber-50 rounded-lg transition-colors text-amber-600 font-medium text-sm border-b-2 border-amber-100"
              >
                <Plus className="w-5 h-5" />
                <span>Create New Memorial</span>
              </button>
            </div>
            
            <div className="p-2 space-y-1">
              {memorials.map((memorial) => (
                <button
                  key={memorial.id}
                  onClick={() => {
                    onSelectMemorial(memorial.id);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-3 py-3 rounded-lg transition-all text-sm ${
                    memorial.id === currentMemorialId
                      ? 'bg-gradient-to-r from-amber-400 to-orange-400 text-white shadow-md'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  <div className={`font-semibold ${memorial.id === currentMemorialId ? 'text-white' : 'text-gray-800'}`}>
                    {memorial.name}
                  </div>
                  <div className={`text-xs mt-1 ${memorial.id === currentMemorialId ? 'text-white/90' : 'text-gray-500'}`}>
                    Created: {new Date(memorial.createdAt).toLocaleDateString()}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

// Data Status Indicator Component
const DataStatusIndicator: React.FC<{
  dataStatus?: {
    loading?: boolean;
    error?: string | null;
    integrity?: DataIntegrityCheck;
  };
}> = ({ dataStatus }) => {
  if (!dataStatus) return null;

  if (dataStatus.loading) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
        <div className="flex items-center">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mr-2"></div>
          <span className="text-blue-700 text-sm">Loading memorial data...</span>
        </div>
      </div>
    );
  }

  if (dataStatus.error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
        <div className="flex items-center">
          <svg className="w-4 h-4 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <span className="text-red-700 text-sm">Error: {dataStatus.error}</span>
        </div>
      </div>
    );
  }

  if (dataStatus.integrity && !dataStatus.integrity.isComplete) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <svg className="w-4 h-4 text-yellow-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span className="text-yellow-700 text-sm">
              Data incomplete ({dataStatus.integrity.loadedSections}/{dataStatus.integrity.totalSections} sections loaded)
            </span>
          </div>
          {dataStatus.integrity.missingSections.length > 0 && (
            <span className="text-yellow-600 text-xs bg-yellow-100 px-2 py-1 rounded">
              {dataStatus.integrity.missingSections.length} missing
            </span>
          )}
        </div>
      </div>
    );
  }

  return null;
};

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  activeSection,
  onSectionChange,
  memorialData,
  memorials = [],
  currentMemorialId = '',
  onSelectMemorial,
  onCreateNew,
  dataStatus, // Add the dataStatus prop
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);

  useEffect(() => {
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
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-60 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed top-0 bottom-0 left-0 z-50 w-[85vw] max-w-sm bg-white shadow-2xl transform transition-all duration-300 ease-in-out lg:translate-x-0 lg:sticky lg:top-0 lg:z-30 lg:w-80
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full border-r-2 border-gray-200">
          {/* Mobile Header */}
          <div className="lg:hidden flex items-center justify-between p-4 border-b border-gray-200 bg-white">
            <h2 className="text-lg font-semibold text-gray-800">Menu</h2>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-2 text-gray-500 hover:text-gray-700 transition-colors rounded-lg hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Decorative Top Bar */}
          <div className="hidden lg:block h-1 bg-gradient-to-r from-amber-400 via-orange-400 to-amber-400"></div>
          
          {/* Header with User Info */}
          <div className="p-3 lg:p-6 border-b-2 border-gray-200 bg-gradient-to-br from-amber-50 to-orange-50 space-y-3">
            {/* User Info */}
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

            {/* Memorial Selector */}
            {memorials.length > 0 && onSelectMemorial && onCreateNew && (
              <MemorialSelector
                memorials={memorials}
                currentMemorialId={currentMemorialId}
                onSelectMemorial={onSelectMemorial}
                onCreateNew={onCreateNew}
              />
            )}
          </div>

          {/* Navigation */}
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

          {/* Footer Actions */}
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
        {/* Decorative Line */}
        <div className="hidden lg:block h-1 bg-gradient-to-r from-amber-400 via-orange-400 to-amber-400"></div>
        
        {/* Top bar */}
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

            {/* Status indicator */}
            <div className="flex items-center gap-2">
              {memorialData?.isPublished && (
                <div className="px-3 py-1.5 bg-green-100 text-green-800 rounded-full text-xs font-medium border border-green-200 whitespace-nowrap">
                  <span className="hidden xs:inline">✓ Published</span>
                  <span className="xs:hidden">✓ Live</span>
                </div>
              )}
              
              {/* Data Status Badge */}
              {dataStatus?.integrity && !dataStatus.integrity.isComplete && (
                <div className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium border border-yellow-200 whitespace-nowrap">
                  <span className="hidden sm:inline">⚠ Incomplete</span>
                  <span className="sm:hidden">⚠</span>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-3 xs:p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-gray-50 to-gray-100">
          <div className="max-w-7xl mx-auto w-full">
            {/* Mobile Section Title */}
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
            
            {/* Data Status Indicator */}
            <DataStatusIndicator dataStatus={dataStatus} />
            
            {/* Content area */}
            <div className="bg-white rounded-lg xs:rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 p-4 xs:p-6 min-h-[60vh]">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};