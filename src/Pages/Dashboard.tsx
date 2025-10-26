// Pages/Dashboard.tsx - RESPONSIVE VERSION
import React, { useState, useEffect, useCallback } from 'react';
import { TopNav } from '../Components/TopNav';
import { Footer } from '../Components/Footer';
import { DashboardLayout } from '../Components/DashboardLayout';
import { OverviewSection } from '../Components/Dashboard/OverviewSection';
import { ProfileSection } from '../Components/Dashboard/ProfileSection';
import { TimelineSection } from '../Components/Dashboard/TimeLlneSection';
import { FavoritesSection } from '../Components/Dashboard/FavouriteSection';
import { FamilyTreeSection } from '../Components/Dashboard/FamilyTreeSection';
import { GallerySection } from '../Components/Dashboard/GallerySection';
import { ServiceSection } from '../Components/Dashboard/ServiceSection';
import { MemoryWallSection } from '../Components/Dashboard/MemoryWallPublic';
import { DownloadSection } from '../Components/Dashboard/DownloadSection';
import { MemorialProvider } from '../Contexts/MemorialContext';
import { useMemorial } from '../hooks/useMemorial';
import { Menu, X } from 'lucide-react';

// Mobile sidebar component
const MobileSidebar: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  activeSection: string;
  onSectionChange: (section: string) => void;
  memorialData: { id: string; name: string; isPublished: boolean } | null;
  onPublish: () => void;
  onSaveChanges: () => void;
}> = ({ isOpen, onClose, activeSection, onSectionChange, memorialData, onPublish, onSaveChanges }) => {
  const sections = [
    { id: 'overview', label: 'Overview' },
    { id: 'profile', label: 'Profile' },
    { id: 'timeline', label: 'Timeline' },
    { id: 'favorites', label: 'Favorites' },
    { id: 'family', label: 'Family Tree' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'service', label: 'Service' },
    { id: 'memory-wall', label: 'Memory Wall' },
    { id: 'download', label: 'Download' },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Mobile Sidebar */}
      <div className={`
        fixed top-0 left-0 h-full w-80 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out lg:hidden
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">Navigation</h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 overflow-y-auto p-4">
            <div className="space-y-2">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => {
                    onSectionChange(section.id);
                    onClose();
                  }}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors duration-200 ${
                    activeSection === section.id
                      ? 'bg-amber-500 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {section.label}
                </button>
              ))}
            </div>
          </nav>

          {/* Footer Actions */}
          <div className="p-4 border-t border-gray-200 space-y-3">
            <button
              onClick={() => {
                onSaveChanges();
                onClose();
              }}
              className="w-full px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium"
            >
              Save Changes
            </button>
            {memorialData && (
              <button
                onClick={() => {
                  onPublish();
                  onClose();
                }}
                className={`w-full px-4 py-3 rounded-lg transition-colors font-medium ${
                  memorialData.isPublished
                    ? 'bg-gray-500 text-white hover:bg-gray-600'
                    : 'bg-amber-500 text-white hover:bg-amber-600'
                }`}
              >
                {memorialData.isPublished ? 'Published' : 'Publish Memorial'}
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

// Inner component that has access to MemorialContext
const DashboardContent: React.FC = () => {
  const [activeSection, setActiveSection] = useState('overview');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const { memorialData, saveToBackend, refreshMemorial } = useMemorial();

  const handlePublish = async () => {
    if (!memorialData?.id) return;

    try {
      // First save any pending changes
      await saveToBackend();
      
      const response = await fetch(`https://wings-of-memories-backend.onrender.com/api/memorials/${memorialData.id}/publish`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        await refreshMemorial();
        alert('Memorial published successfully!');
      } else {
        throw new Error('Failed to publish memorial');
      }
    } catch (error) {
      console.error('Error publishing memorial:', error);
      alert('Failed to publish memorial. Please try again.');
    }
  };

  const renderSection = () => {
    if (!memorialData) {
      return (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
        </div>
      );
    }

    switch (activeSection) {
      case 'overview':
        return <OverviewSection />;
      case 'profile':
        return <ProfileSection />;
      case 'timeline':
        return <TimelineSection />;
      case 'favorites':
        return <FavoritesSection />;
      case 'family':
        return <FamilyTreeSection />;
      case 'gallery':
        return <GallerySection />;
      case 'service':
        return <ServiceSection />;
      case 'memory-wall':
        return <MemoryWallSection />;
      case 'download':
        return <DownloadSection />;
      default:
        return <OverviewSection />;
    }
  };

  return (
    <>
      <TopNav />
      
      {/* Mobile Header */}
      <div className="lg:hidden bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="p-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
          
          <div className="flex-1 text-center">
            <h1 className="text-lg font-semibold text-gray-800 truncate">
              {memorialData?.name || 'Memorial Dashboard'}
            </h1>
          </div>
          
          <div className="w-6"></div> {/* Spacer for balance */}
        </div>
      </div>

      {/* Mobile Sidebar */}
      <MobileSidebar
        isOpen={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        memorialData={memorialData ? {
          id: memorialData.id,
          name: memorialData.name,
          isPublished: memorialData.isPublished || false
        } : null}
        onPublish={handlePublish}
        onSaveChanges={saveToBackend}
      />

      {/* Main Dashboard Layout */}
      <DashboardLayout
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        memorialData={memorialData ? {
          id: memorialData.id,
          name: memorialData.name,
          isPublished: memorialData.isPublished || false
        } : null}
        onPublish={handlePublish}
        onSaveChanges={saveToBackend}
      >
        {/* Mobile Section Title */}
        <div className="lg:hidden mb-6">
          <h2 className="text-2xl font-bold text-gray-800 capitalize">
            {activeSection.replace('-', ' ')}
          </h2>
          {activeSection === 'overview' && (
            <p className="text-gray-600 mt-1">Manage your memorial settings and content</p>
          )}
        </div>

        {renderSection()}
      </DashboardLayout>
      
      <Footer />
    </>
  );
};

// Main Dashboard component
export const Dashboard: React.FC = () => {
  const [memorialId, setMemorialId] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  const createNewMemorial = useCallback(async () => {
    try {
      const response = await fetch('https://wings-of-memories-backend.onrender.com/api/memorials', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          name: 'New Memorial',
          profileImage: '',
          birthDate: '',
          deathDate: '',
          location: '',
          obituary: ''
        })
      });

      if (response.ok) {
        const data = await response.json();
        const newMemorialId = data.memorial.id;
        setMemorialId(newMemorialId);
        localStorage.setItem('currentMemorialId', newMemorialId);
        // Update URL without reload
        window.history.replaceState({}, '', `?memorialId=${newMemorialId}`);
      } else {
        throw new Error('Failed to create memorial');
      }
    } catch (error) {
      console.error('Error creating memorial:', error);
      alert('Failed to create memorial. Please refresh the page.');
    }
  }, []);

  const initializeMemorial = useCallback(async () => {
    try {
      // Get memorial ID from URL or localStorage, or create new one
      const urlParams = new URLSearchParams(window.location.search);
      const idFromUrl = urlParams.get('memorialId');
      const savedMemorialId = localStorage.getItem('currentMemorialId');

      if (idFromUrl) {
        setMemorialId(idFromUrl);
        localStorage.setItem('currentMemorialId', idFromUrl);
      } else if (savedMemorialId) {
        setMemorialId(savedMemorialId);
      } else {
        await createNewMemorial();
      }
    } catch (error) {
      console.error('Error initializing memorial:', error);
      await createNewMemorial();
    } finally {
      setLoading(false);
    }
  }, [createNewMemorial]);

  useEffect(() => {
    initializeMemorial();
  }, [initializeMemorial]);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50 p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-amber-500 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading your memorial...</p>
        </div>
      </div>
    );
  }

  if (!memorialId) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50 p-4">
        <div className="text-center max-w-sm w-full">
          <p className="text-gray-600 text-lg mb-4">Unable to load memorial.</p>
          <button
            onClick={createNewMemorial}
            className="w-full px-6 py-3 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors font-medium"
          >
            Create New Memorial
          </button>
        </div>
      </div>
    );
  }

  return (
    <MemorialProvider memorialId={memorialId}>
      <DashboardContent />
    </MemorialProvider>
  );
};