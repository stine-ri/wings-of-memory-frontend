// Components/DashboardLayout.tsx - FIXED
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, User, Clock, Heart, Users, Images, Calendar,
  Download, Settings, Menu, LogOut, Eye, ExternalLink
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
    <div className="bg-gray-50 flex">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed top-16 bottom-0 left-0 z-30 w-64 sm:w-72 bg-white shadow-2xl transform transition-all duration-300 ease-in-out lg:translate-x-0 lg:sticky lg:top-16
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full border-r-2 border-gray-200">
          {/* Decorative Top Bar */}
          <div className="h-1 bg-gradient-to-r from-amber-400 via-orange-400 to-amber-400"></div>
          
          {/* Header */}
          <div className="p-6 border-b-2 border-gray-200 bg-gradient-to-br from-amber-50 to-orange-50">
            {/* User Info - Larger */}
            {user && (
              <div className="flex items-center gap-4 p-4 bg-white rounded-2xl shadow-md border border-amber-200">
                <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center shrink-0">
                  <span className="text-white text-lg font-bold">
                    {user.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-base font-semibold text-gray-800 truncate">{user.name}</p>
                  <p className="text-sm text-gray-600 truncate">{user.email}</p>
                  <p className="text-xs text-amber-600 font-medium mt-1 capitalize">{user.role || 'Member'}</p>
                </div>
              </div>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {sidebarSections.map((section) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => {
                    onSectionChange(section.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ease-in-out transform hover:scale-105 ${
                    activeSection === section.id
                      ? 'bg-gradient-to-r from-amber-400 to-orange-400 text-white shadow-lg scale-105'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  <span className="font-medium text-sm sm:text-base">{section.name}</span>
                </button>
              );
            })}
          </nav>

          {/* Footer Actions */}
          <div className="p-4 border-t-2 border-gray-200 space-y-2 bg-gray-50">
            <button 
              onClick={handlePreview}
              disabled={!memorialData?.id || saving}
              className="w-full flex items-center gap-3 px-4 py-3 bg-amber-500 text-white rounded-xl hover:bg-amber-600 transition-all duration-300 disabled:opacity-50"
            >
              <Eye className="w-5 h-5 shrink-0" />
              <span className="font-medium text-sm sm:text-base">
                {saving ? 'Saving...' : 'Preview Memorial'}
              </span>
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-white hover:shadow-md rounded-xl transition-all duration-300">
              <Download className="w-5 h-5 shrink-0" />
              <span className="font-medium text-sm sm:text-base">Download Memorial</span>
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-white hover:shadow-md rounded-xl transition-all duration-300">
              <Settings className="w-5 h-5 shrink-0" />
              <span className="font-medium text-sm sm:text-base">Settings</span>
            </button>
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 hover:shadow-md rounded-xl transition-all duration-300"
            >
              <LogOut className="w-5 h-5 shrink-0" />
              <span className="font-medium text-sm sm:text-base">Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Decorative Line Below Navbar */}
        <div className="h-1 bg-gradient-to-r from-amber-400 via-orange-400 to-amber-400"></div>
        
        {/* Top bar */}
        <header className="bg-white shadow-md border-b-2 border-gray-200 shrink-0 sticky top-0 z-40">
          <div className="flex items-center justify-between px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-gray-600 hover:text-gray-800 p-1"
              >
                <Menu className="w-6 h-6" />
              </button>
              
              <h1 className="text-lg sm:text-xl font-serif text-gray-800 capitalize">
                {memorialData?.name || 'Your Memorial'} - {activeSection.replace('-', ' ')}
              </h1>
            </div>

            <div className="flex items-center gap-2 sm:gap-4">
              <div className="flex gap-2">
                <button 
                  onClick={handleSaveAndPreview}
                  disabled={saving || !memorialData?.id}
                  className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-full hover:bg-amber-600 transition-all font-medium text-sm shadow-md hover:shadow-lg disabled:opacity-50"
                >
                  <Eye className="w-4 h-4" />
                  {saving ? 'Saving...' : 'Quick Preview'}
                </button>
                <button 
                  onClick={() => window.open(`/preview/${memorialData?.id}`, '_blank')}
                  disabled={!memorialData?.id}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-all font-medium text-sm shadow-md hover:shadow-lg disabled:opacity-50"
                >
                  <ExternalLink className="w-4 h-4" />
                  Full Preview
                </button>
              </div>
              <button 
                onClick={handlePublish}
                disabled={!memorialData?.name.trim() || publishing}
                className="px-4 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-all font-medium text-sm shadow-md hover:shadow-lg disabled:opacity-50"
              >
                {publishing ? 'Publishing...' : (memorialData?.isPublished ? 'Published' : 'Publish')}
              </button>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6 sm:p-8 bg-gradient-to-br from-gray-50 to-gray-100">
          <div className="max-w-7xl mx-auto">
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

// Preview Modal Component
const PreviewModal: React.FC<{ memorialId?: string; onClose: () => void }> = ({ memorialId, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full h-full max-w-6xl max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-xl font-semibold text-gray-800">Memorial Preview</h3>
          <div className="flex gap-3">
            <button
              onClick={() => window.open(`/preview/${memorialId}`, '_blank')}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              <ExternalLink className="w-4 h-4" />
              Open in New Tab
            </button>
            <button 
              onClick={onClose}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
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