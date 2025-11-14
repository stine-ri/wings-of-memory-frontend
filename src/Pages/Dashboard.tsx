// Pages/Dashboard.tsx - IMPROVED ERROR HANDLING VERSION
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

// Inner component that has access to MemorialContext
const DashboardContent: React.FC = () => {
  const [activeSection, setActiveSection] = useState('overview');
  const [userMemorials, setUserMemorials] = useState<Memorial[]>([]);
  const { memorialData } = useMemorial();

  // Fetch user's memorials
  const fetchUserMemorials = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('No token found');
        return;
      }

      console.log('Fetching memorials with token:', token.substring(0, 20) + '...');

      const response = await fetch('https://wings-of-memories-backend.onrender.com/api/memorials', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Memorials response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('Memorials data received:', data);
        setUserMemorials(data.memorials || []);
      } else {
        const errorText = await response.text();
        console.error('Failed to fetch memorials:', response.status, errorText);
      }
    } catch (error) {
      console.error('Error fetching memorials:', error);
    }
  }, []);

  // Handle memorial selection
  const handleSelectMemorial = useCallback(async (memorialId: string) => {
    console.log('Selecting memorial:', memorialId);
    localStorage.setItem('currentMemorialId', memorialId);
    window.history.replaceState({}, '', `?memorialId=${memorialId}`);
    window.location.reload();
  }, []);

  // Handle creating new memorial - IMPROVED VERSION
  const handleCreateNewMemorial = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please log in to create a memorial');
        return;
      }

      console.log('Creating new memorial with token:', token.substring(0, 20) + '...');

      const memorialData = {
        name: 'New Memorial',
        profileImage: '',
        birthDate: '',
        deathDate: '',
        location: '',
        obituary: '',
        createdAt: new Date().toISOString()
      };

      console.log('Sending memorial data:', memorialData);

      const response = await fetch('https://wings-of-memories-backend.onrender.com/api/memorials', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(memorialData)
      });

      console.log('Create memorial response status:', response.status);

      if (!response.ok) {
  let errorMessage = 'Failed to create memorial';
  try {
    const errorData = await response.json();
    errorMessage = errorData.message || errorMessage;
    console.error('Backend error details:', errorData);
  } catch {
    const errorText = await response.text();
    console.error('Raw error response:', errorText);
    errorMessage = `Server error: ${response.status} - ${errorText}`;
  }
  throw new Error(errorMessage);
}


      const data = await response.json();
      console.log('Memorial created successfully:', data);

      const newMemorialId = data.memorial?.id || data.id;
      
      if (!newMemorialId) {
        throw new Error('No memorial ID returned from server');
      }

      // Add to local state
      const newMemorial = {
        id: newMemorialId,
        name: data.memorial?.name || 'New Memorial',
        createdAt: data.memorial?.createdAt || new Date().toISOString(),
        isPublished: data.memorial?.isPublished || false
      };
      
      setUserMemorials(prev => [...prev, newMemorial]);
      
      // Select the new memorial
      handleSelectMemorial(newMemorialId);

    } catch (error) {
      console.error('Error creating memorial:', error);
      alert(`Failed to create memorial: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }, [handleSelectMemorial]);

  useEffect(() => {
    fetchUserMemorials();
  }, [fetchUserMemorials]);

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

  const createNewMemorial = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

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
          createdAt: new Date().toISOString()
        })
      });

    if (!response.ok) {
  let errorMessage = 'Failed to create memorial';
  try {
    const errorData = await response.json();
    errorMessage = errorData.message || errorMessage;
  } catch {
    // We can ignore the actual text if we just want a generic message
    errorMessage = `Server error: ${response.status}`;
  }
  throw new Error(errorMessage);
}

      const data = await response.json();
      const newMemorialId = data.memorial?.id || data.id;
      
      if (!newMemorialId) {
        throw new Error('No memorial ID returned from server');
      }
      
      setMemorialId(newMemorialId);
      localStorage.setItem('currentMemorialId', newMemorialId);
      window.history.replaceState({}, '', `?memorialId=${newMemorialId}`);
      
    } catch (error) {
      console.error('Error creating memorial:', error);
      alert(`Failed to create memorial: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }, []);

  const initializeMemorial = useCallback(async () => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const idFromUrl = urlParams.get('memorialId');
      const savedMemorialId = localStorage.getItem('currentMemorialId');

      console.log('Initializing memorial:', { idFromUrl, savedMemorialId });

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