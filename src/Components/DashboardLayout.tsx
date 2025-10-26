// Components/DashboardLayout.tsx - RESPONSIVE VERSION
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, User, Clock, Heart, Users, Images, Calendar,
  Download, Settings, Menu, LogOut, Eye, ExternalLink, X
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
  onPublish: () => void;
  onSaveChanges: () => Promise<void>;
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
  onPublish,
  onSaveChanges,
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);
  const [publishing, setPublishing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  useEffect(() => {
    // Get user data from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handlePreview = async () => {
    if (!memorialData?.id) {
      alert('Please create a memorial first.');
      return;
    }

    setSaving(true);
    try {
      // Save current changes before preview
      await onSaveChanges();
      
      // Open preview in modal
      setShowPreviewModal(true);
    } catch (error) {
      console.error('Error saving before preview:', error);
      alert('Please save your changes first.');
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    if (!memorialData?.name.trim()) {
      alert('Please enter a name for the memorial before publishing.');
      return;
    }

    setPublishing(true);
    try {
      // First save any pending changes
      await onSaveChanges();
      await onPublish();
    } catch (error) {
      console.error('Error publishing memorial:', error);
    } finally {
      setPublishing(false);
    }
  };

  const handleSaveAndPreview = async () => {
    setSaving(true);
    try {
      await onSaveChanges();
      setShowPreviewModal(true);
    } catch (error) {
      console.error('Error saving:', error);
      alert('Failed to save changes. Please try again.');
    } finally {
      setSaving(false);
    }
  };

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
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed top-0 bottom-0 left-0 z-50 w-80 bg-white shadow-2xl transform transition-all duration-300 ease-in-out lg:translate-x-0 lg:sticky lg:top-0 lg:z-30
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full border-r-2 border-gray-200">
          {/* Mobile Header */}
          <div className="lg:hidden flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">Navigation</h2>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Decorative Top Bar - Hidden on mobile */}
          <div className="hidden lg:block h-1 bg-gradient-to-r from-amber-400 via-orange-400 to-amber-400"></div>
          
          {/* Header */}
          <div className="p-4 lg:p-6 border-b-2 border-gray-200 bg-gradient-to-br from-amber-50 to-orange-50">
            {/* User Info - Responsive */}
            {user && (
              <div className="flex items-center gap-3 p-3 lg:p-4 bg-white rounded-xl lg:rounded-2xl shadow-md border border-amber-200">
                <div className="w-10 h-10 lg:w-14 lg:h-14 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center shrink-0">
                  <span className="text-white text-sm lg:text-lg font-bold">
                    {user.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm lg:text-base font-semibold text-gray-800 truncate">{user.name}</p>
                  <p className="text-xs lg:text-sm text-gray-600 truncate">{user.email}</p>
                  <p className="text-xs text-amber-600 font-medium mt-0.5 lg:mt-1 capitalize">{user.role || 'Member'}</p>
                </div>
              </div>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-3 lg:p-4 space-y-1 overflow-y-auto">
            {sidebarSections.map((section) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => {
                    onSectionChange(section.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 lg:px-4 py-3 rounded-xl transition-all duration-300 ease-in-out ${
                    activeSection === section.id
                      ? 'bg-gradient-to-r from-amber-400 to-orange-400 text-white shadow-lg'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  <span className="font-medium text-sm lg:text-base">{section.name}</span>
                </button>
              );
            })}
          </nav>

          {/* Footer Actions */}
          <div className="p-3 lg:p-4 border-t-2 border-gray-200 space-y-2 bg-gray-50">
            <button 
              onClick={handlePreview}
              disabled={!memorialData?.id || saving}
              className="w-full flex items-center gap-3 px-3 lg:px-4 py-3 bg-amber-500 text-white rounded-xl hover:bg-amber-600 transition-all duration-300 disabled:opacity-50 text-sm lg:text-base"
            >
              <Eye className="w-4 lg:w-5 h-4 lg:h-5 shrink-0" />
              <span className="font-medium">
                {saving ? 'Saving...' : 'Preview Memorial'}
              </span>
            </button>
            
            <button 
              onClick={handlePublish}
              disabled={!memorialData?.name.trim() || publishing}
              className={`w-full flex items-center gap-3 px-3 lg:px-4 py-3 rounded-xl transition-all duration-300 text-sm lg:text-base ${
                memorialData?.isPublished
                  ? 'bg-green-500 text-white hover:bg-green-600'
                  : 'bg-amber-500 text-white hover:bg-amber-600'
              } disabled:opacity-50`}
            >
              <Download className="w-4 lg:w-5 h-4 lg:h-5 shrink-0" />
              <span className="font-medium">
                {publishing ? 'Publishing...' : (memorialData?.isPublished ? 'Published' : 'Publish Memorial')}
              </span>
            </button>
            
            <button className="w-full flex items-center gap-3 px-3 lg:px-4 py-3 text-gray-600 hover:bg-white hover:shadow-md rounded-xl transition-all duration-300 text-sm lg:text-base">
              <Settings className="w-4 lg:w-5 h-4 lg:h-5 shrink-0" />
              <span className="font-medium">Settings</span>
            </button>
            
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 lg:px-4 py-3 text-red-600 hover:bg-red-50 hover:shadow-md rounded-xl transition-all duration-300 text-sm lg:text-base"
            >
              <LogOut className="w-4 lg:w-5 h-4 lg:h-5 shrink-0" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen w-full lg:w-auto">
        {/* Decorative Line Below Navbar - Hidden on mobile */}
        <div className="hidden lg:block h-1 bg-gradient-to-r from-amber-400 via-orange-400 to-amber-400"></div>
        
        {/* Top bar */}
        <header className="bg-white shadow-md border-b-2 border-gray-200 shrink-0 sticky top-0 z-40">
          <div className="flex items-center justify-between px-4 sm:px-6 py-3">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-gray-600 hover:text-gray-800 p-1"
              >
                <Menu className="w-6 h-6" />
              </button>
              
              <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
                <h1 className="text-lg font-semibold text-gray-800 truncate max-w-[150px] sm:max-w-none">
                  {memorialData?.name || 'Your Memorial'}
                </h1>
                <span className="text-sm text-gray-500 capitalize hidden sm:block">
                  - {activeSection.replace('-', ' ')}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Mobile: Only show essential buttons */}
              <div className="hidden sm:flex gap-2">
                <button 
                  onClick={handleSaveAndPreview}
                  disabled={saving || !memorialData?.id}
                  className="flex items-center gap-2 px-3 py-2 bg-amber-500 text-white rounded-full hover:bg-amber-600 transition-all font-medium text-sm shadow-md hover:shadow-lg disabled:opacity-50"
                >
                  <Eye className="w-4 h-4" />
                  <span className="hidden sm:inline">{saving ? 'Saving...' : 'Quick Preview'}</span>
                </button>
                <button 
                  onClick={() => window.open(`/preview/${memorialData?.id}`, '_blank')}
                  disabled={!memorialData?.id}
                  className="hidden md:flex items-center gap-2 px-3 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-all font-medium text-sm shadow-md hover:shadow-lg disabled:opacity-50"
                >
                  <ExternalLink className="w-4 h-4" />
                  Full Preview
                </button>
              </div>
              
              {/* Mobile: Compact publish button */}
              <button 
                onClick={handlePublish}
                disabled={!memorialData?.name.trim() || publishing}
                className="px-3 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-all font-medium text-sm shadow-md hover:shadow-lg disabled:opacity-50 min-w-[80px]"
              >
                {publishing ? '...' : (memorialData?.isPublished ? '✓' : 'Publish')}
              </button>

              {/* Mobile: Quick preview icon button */}
              <button 
                onClick={handleSaveAndPreview}
                disabled={saving || !memorialData?.id}
                className="sm:hidden flex items-center justify-center w-10 h-10 bg-amber-500 text-white rounded-full hover:bg-amber-600 transition-all shadow-md hover:shadow-lg disabled:opacity-50"
              >
                <Eye className="w-5 h-5" />
              </button>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-gray-50 to-gray-100">
          <div className="max-w-7xl mx-auto w-full">
            {/* Mobile Section Title */}
            <div className="lg:hidden mb-6">
              <h2 className="text-2xl font-bold text-gray-800 capitalize">
                {activeSection.replace('-', ' ')}
              </h2>
              {activeSection === 'overview' && (
                <p className="text-gray-600 mt-1 text-sm">Manage your memorial settings and content</p>
              )}
            </div>
            
            {children}
          </div>
        </main>
      </div>

      {/* Preview Modal */}
      {showPreviewModal && (
        <PreviewModal 
          memorialId={memorialData?.id}
          onClose={() => setShowPreviewModal(false)}
        />
      )}
    </div>
  );
};

// Preview Modal Component - Responsive
const PreviewModal: React.FC<{ memorialId?: string; onClose: () => void }> = ({ memorialId, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-xl sm:rounded-2xl w-full h-full max-w-6xl max-h-[95vh] flex flex-col">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-3 sm:p-4 border-b gap-2">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-800">Memorial Preview</h3>
          <div className="flex gap-2">
            <button
              onClick={() => window.open(`/preview/${memorialId}`, '_blank')}
              className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm sm:text-base"
            >
              <ExternalLink className="w-4 h-4" />
              <span className="hidden sm:inline">New Tab</span>
            </button>
            <button 
              onClick={onClose}
              className="px-3 sm:px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 text-sm sm:text-base"
            >
              Close
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-hidden">
          {memorialId ? (
            <iframe 
              src={`/preview/${memorialId}`}
              className="w-full h-full border-0"
              title="Memorial Preview"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500">No memorial data available for preview.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};