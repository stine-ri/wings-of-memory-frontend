// Pages/Dashboard.tsx - FIXED VERSION (No duplicate mobile navigation)
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
import { ServiceSection } from '../Components/Dashboard/ServiceSectionEditor';
import { MemoryWallSection } from '../Components/Dashboard/MemoryWallEditor';
import { DownloadSection } from '../Components/Dashboard/DownloadSection';
import { MemorialProvider } from '../Contexts/MemorialContext';
import { useMemorial } from '../hooks/useMemorial';

// Inner component that has access to MemorialContext
const DashboardContent: React.FC = () => {
  const [activeSection, setActiveSection] = useState('overview');
  const { memorialData } = useMemorial();

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
      
      {/* Main Dashboard Layout - This already has its own mobile navigation */}
      <DashboardLayout
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        memorialData={memorialData ? {
          id: memorialData.id,
          name: memorialData.name,
          isPublished: memorialData.isPublished || false
        } : null}
      >
        {renderSection()}
      </DashboardLayout>
      
      <Footer />
    </>
  );
};

// Main Dashboard component (keep this part the same)
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