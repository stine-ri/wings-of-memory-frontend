// Pages/Dashboard.tsx - FIXED VERSION
import React, { useState, useEffect, useCallback } from 'react';
import TopNav from '../Components/TopNav';
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
import MemorialProvider from '../Contexts/MemorialContext';
import { useMemorial } from '../hooks/useMemorial';

interface Memorial {
  id: string;
  name: string;
  createdAt: string;
  isPublished: boolean;
}

const DashboardContent: React.FC = () => {
  const [activeSection, setActiveSection] = useState('overview');
  const [userMemorials, setUserMemorials] = useState<Memorial[]>([]);
  const { memorialData, loading, error, dataIntegrity, refreshMemorial } = useMemorial();

  // Fetch user memorials
  const fetchUserMemorials = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.warn('⚠️ No authentication token');
        return;
      }

      console.log('🔄 Fetching user memorials...');

      const response = await fetch('https://wings-of-memories-backend.onrender.com/api/memorials', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Fetched memorials:', data.memorials?.length || 0);
        setUserMemorials(data.memorials || []);
      } else {
        console.error('❌ Failed to fetch memorials:', response.status);
      }
    } catch (error) {
      console.error('❌ Error fetching memorials:', error);
    }
  }, []);

  // Select memorial
  const handleSelectMemorial = useCallback((memorialId: string) => {
    console.log('📍 Selecting memorial:', memorialId);
    localStorage.setItem('currentMemorialId', memorialId);
    window.location.href = `/dashboard?memorialId=${memorialId}`;
  }, []);

  // Create new memorial
  const handleCreateNewMemorial = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please log in to create a memorial');
        return;
      }

      console.log('🆕 Creating new memorial...');

      const response = await fetch('https://wings-of-memories-backend.onrender.com/api/memorials', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: 'New Memorial',
          profileImage: '',
          birthDate: '',
          deathDate: '',
          location: '',
          obituary: '',
          timeline: [],
          favorites: [],
          familyTree: [],
          gallery: [],
          memoryWall: [],
          service: {
            venue: '',
            address: '',
            date: '',
            time: '',
            virtualLink: '',
            virtualPlatform: 'zoom'
          }
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to create memorial: ${errorText}`);
      }

      const data = await response.json();
      const newMemorialId = data.memorial?.id || data.id;
      
      if (!newMemorialId) {
        throw new Error('No memorial ID returned from server');
      }

      console.log('✅ Memorial created:', newMemorialId);

      // Update local list
      const newMemorial: Memorial = {
        id: newMemorialId,
        name: data.memorial?.name || 'New Memorial',
        createdAt: data.memorial?.createdAt || new Date().toISOString(),
        isPublished: false
      };
      
      setUserMemorials(prev => [newMemorial, ...prev]);
      handleSelectMemorial(newMemorialId);

    } catch (error) {
      console.error('❌ Error creating memorial:', error);
      alert(`Failed to create memorial: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }, [handleSelectMemorial]);

  // Retry loading
  const handleRetryLoading = useCallback(async () => {
    console.log('🔄 Retrying memorial load...');
    await refreshMemorial();
  }, [refreshMemorial]);

  // Fetch memorials on mount
  useEffect(() => {
    fetchUserMemorials();
  }, [fetchUserMemorials]);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-amber-500 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading memorial data...</p>
          <p className="text-gray-500 text-sm mt-2">Ensuring all data is loaded completely</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error && !memorialData) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50 p-4">
        <div className="text-center max-w-md w-full">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl mb-4">
            <p className="font-bold text-lg mb-2">Error Loading Memorial</p>
            <p className="text-sm">{error}</p>
          </div>
          <button
            onClick={handleRetryLoading}
            className="px-6 py-3 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Don't render if data integrity check fails
  if (!loading && memorialData && !dataIntegrity.isComplete) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50 p-4">
        <div className="text-center max-w-md w-full">
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-3 rounded-xl mb-4">
            <p className="font-bold text-lg mb-2">Incomplete Data</p>
            <p className="text-sm mb-3">
              Some memorial data couldn't be loaded properly. 
              Missing: {dataIntegrity.missingSections.join(', ')}
            </p>
            <p className="text-xs">
              Loaded {dataIntegrity.loadedSections}/{dataIntegrity.totalSections} sections
            </p>
          </div>
          <button
            onClick={handleRetryLoading}
            className="px-6 py-3 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors font-medium"
          >
            Reload Data
          </button>
        </div>
      </div>
    );
  }

  const renderSection = () => {
    if (!memorialData) {
      return (
        <div className="flex justify-center items-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Preparing memorial...</p>
          </div>
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
      <TopNav 
        memorials={userMemorials}
        currentMemorialId={memorialData?.id || ''}
        onSelectMemorial={handleSelectMemorial}
        onCreateNew={handleCreateNewMemorial}
      />
      
      <DashboardLayout
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        memorialData={memorialData ? {
          id: memorialData.id,
          name: memorialData.name,
          isPublished: memorialData.isPublished || false
        } : null}
        memorials={userMemorials}
        currentMemorialId={memorialData?.id || ''}
        onSelectMemorial={handleSelectMemorial}
        onCreateNew={handleCreateNewMemorial}
        dataStatus={{
          loading,
          error,
          integrity: dataIntegrity
        }}
      >
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
  const [initError, setInitError] = useState<string | null>(null);

  const initializeMemorial = useCallback(async () => {
    try {
      setInitError(null);
      
      // Get memorial ID from URL or localStorage
      const urlParams = new URLSearchParams(window.location.search);
      const idFromUrl = urlParams.get('memorialId');
      const savedMemorialId = localStorage.getItem('currentMemorialId');

      console.log('🔍 Initializing memorial:', { idFromUrl, savedMemorialId });

      // Prefer URL parameter over saved ID
      const memorialIdToUse = idFromUrl || savedMemorialId;

      if (memorialIdToUse) {
        // IMPORTANT: Don't create new memorial if we have an ID
        console.log('✅ Using existing memorial ID:', memorialIdToUse);
        setMemorialId(memorialIdToUse);
        localStorage.setItem('currentMemorialId', memorialIdToUse);
        
        // Update URL if needed
        if (!idFromUrl) {
          window.history.replaceState({}, '', `?memorialId=${memorialIdToUse}`);
        }
      } else {
        // NO MEMORIAL ID - Don't auto-create, let user create manually
        console.log('⚠️ No memorial ID found - user needs to create one');
        setMemorialId(undefined);
      }
    } catch (error) {
      console.error('❌ Error initializing memorial:', error);
      setInitError(error instanceof Error ? error.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    initializeMemorial();
  }, [initializeMemorial]);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-amber-500 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Initializing dashboard...</p>
        </div>
      </div>
    );
  }

  if (initError) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50 p-4">
        <div className="text-center max-w-sm w-full">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl mb-4">
            <p className="font-bold">Initialization Error</p>
            <p className="text-sm">{initError}</p>
          </div>
          <button
            onClick={initializeMemorial}
            className="w-full px-6 py-3 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // If no memorial ID, show create screen
  if (!memorialId) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50 p-4">
        <div className="text-center max-w-md w-full">
          <div className="mb-6">
            <div className="w-20 h-20 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">💐</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome to Your Memorials</h2>
            <p className="text-gray-600 mb-6">
              You don't have any memorials yet. Create your first memorial to get started.
            </p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="w-full px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg hover:from-amber-600 hover:to-orange-600 transition-all font-medium shadow-lg"
          >
            Go to Dashboard
          </button>
          <p className="text-sm text-gray-500 mt-4">
            Use the "Create New Memorial" button in the top navigation to start
          </p>
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