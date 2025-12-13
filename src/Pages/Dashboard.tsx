// Pages/Dashboard.tsx
import React, { useState, useEffect, useCallback } from 'react';
import TopNav from '../Components/TopNav';
// import SearchNavbar from '../Components/SearchFunctionalities';
import { Footer } from '../Components/Footer';
import { DashboardLayout } from '../Components/DashboardLayout';
import { OverviewSection } from '../Components/Dashboard/OverviewSection';
import { ProfileSection } from '../Components/Dashboard/ProfileSection';
import { TimelineSection } from '../Components/Dashboard/TimeLlneSection';
import { FavoritesSection } from '../Components/Dashboard/FavouriteSection';
import { FamilyTreeSection } from '../Components/Dashboard/FamilyTreeSection';
import { GallerySection } from '../Components/Dashboard/GallerySectionEditor';
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
  
  // Add search and filter state that's actually used
  const [searchQuery] = useState('');
  const [sortBy] = useState('recent');
  const [filteredMemorials, setFilteredMemorials] = useState<Memorial[]>([]);

  // Filter and sort memorials based on search and sort criteria
  useEffect(() => {
    let filtered = [...userMemorials];
    
    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(memorial => 
        memorial.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'recent':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });
    
    setFilteredMemorials(filtered);
  }, [userMemorials, searchQuery, sortBy]);

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

  //delete memorial
  const handleDeleteMemorial = useCallback(async (memorialId: string) => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    alert('You need to be logged in to delete memorials');
    return;
  }

  // Don't allow deleting if it's the only memorial
  if (userMemorials.length <= 1) {
    alert('You need to have at least one memorial. Please create another one before deleting this.');
    return;
  }

  const confirmDelete = window.confirm('Are you sure you want to delete this memorial? This action cannot be undone.');
  if (!confirmDelete) return;

  try {
    console.log('🗑️ Deleting memorial:', memorialId);

    const response = await fetch(`https://wings-of-memories-backend.onrender.com/api/memorials/${memorialId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to delete memorial');
    }

    console.log('✅ Memorial deleted successfully');

    // Remove from local state
    setUserMemorials(prev => prev.filter(m => m.id !== memorialId));

    // If the deleted memorial was the current one, select another
    if (memorialData?.id === memorialId) {
      const remainingMemorials = userMemorials.filter(m => m.id !== memorialId);
      if (remainingMemorials.length > 0) {
        const nextMemorial = remainingMemorials[0];
        handleSelectMemorial(nextMemorial.id);
      } else {
        // No memorials left, redirect to create new
        window.location.href = '/dashboard';
      }
    }

  } catch (error) {
    console.error('❌ Error deleting memorial:', error);
    alert(`Failed to delete memorial: ${error instanceof Error ? error.message : 'Unknown error'}`);
    throw error;
  }
}, [userMemorials, memorialData?.id, handleSelectMemorial]);


  // Handle search functionality
  // const handleSearch = useCallback((query: string) => {
  //   setSearchQuery(query);
  //   console.log('🔍 Searching memorials:', query);
  // }, []);

  // Handle filter changes
  // const handleFilterChange = useCallback((filterType: string) => {
  //   setSortBy(filterType);
  //   console.log('🎛️ Sorting memorials by:', filterType);
  // }, []);

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
        memorials={filteredMemorials} // Use filtered memorials
        currentMemorialId={memorialData?.id || ''}
        onSelectMemorial={handleSelectMemorial}
        onCreateNew={handleCreateNewMemorial}
        onDeleteMemorial={handleDeleteMemorial} 
      />
      
      {/* Pass the handlers to SearchNavbar */}
      {/* <SearchNavbar 
        onSearch={handleSearch} 
        onFilterChange={handleFilterChange} 
      /> */}
      
      <DashboardLayout
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        memorialData={memorialData ? {
          id: memorialData.id,
          name: memorialData.name,
          isPublished: memorialData.isPublished || false
        } : null}
        memorials={filteredMemorials} // Use filtered memorials
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
  const [userMemorials, setUserMemorials] = useState<Memorial[]>([]);

  // Fetch user memorials for the welcome screen
  const fetchUserMemorials = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.warn('⚠️ No authentication token');
        return [];
      }

      console.log('🔄 Fetching user memorials for welcome screen...');

      const response = await fetch('https://wings-of-memories-backend.onrender.com/api/memorials', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Fetched memorials:', data.memorials?.length || 0);
        return data.memorials || [];
      } else {
        console.error('❌ Failed to fetch memorials:', response.status);
        return [];
      }
    } catch (error) {
      console.error('❌ Error fetching memorials:', error);
      return [];
    }
  }, []);

  // Create new memorial from welcome screen
  const handleCreateNewMemorial = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please log in to create a memorial');
        return;
      }

      console.log('🆕 Creating new memorial from welcome screen...');

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
      
      // Redirect to the new memorial
      localStorage.setItem('currentMemorialId', newMemorialId);
      window.location.href = `/dashboard?memorialId=${newMemorialId}`;

    } catch (error) {
      console.error('❌ Error creating memorial:', error);
      alert(`Failed to create memorial: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }, []);

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
        // NO MEMORIAL ID - Check if user has any memorials
        console.log('⚠️ No memorial ID found - checking if user has memorials');
        const memorials = await fetchUserMemorials();
        setUserMemorials(memorials);
        
        if (memorials.length > 0) {
          // User has memorials but none selected - auto-select the first one
          console.log('📍 Auto-selecting first memorial:', memorials[0].id);
          setMemorialId(memorials[0].id);
          localStorage.setItem('currentMemorialId', memorials[0].id);
          window.history.replaceState({}, '', `?memorialId=${memorials[0].id}`);
        } else {
          // User has no memorials at all - show welcome screen
          console.log('👋 No memorials found - showing welcome screen');
          setMemorialId(undefined);
        }
      }
    } catch (error) {
      console.error('❌ Error initializing memorial:', error);
      setInitError(error instanceof Error ? error.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  }, [fetchUserMemorials]);

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

  // If no memorial ID and user has no memorials, show welcome screen with CREATE button
  if (!memorialId && userMemorials.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Render TopNav even for new users so they can see the navigation */}
        <TopNav 
          memorials={[]}
          currentMemorialId=""
          onSelectMemorial={() => {}}
          onCreateNew={handleCreateNewMemorial}
           onDeleteMemorial={async () => {}} 
        />
        
        {/* Show SearchNavbar with empty handlers for consistency */}
        {/* <SearchNavbar 
          onSearch={() => {}} 
          onFilterChange={() => {}} 
        /> */}

        <div className="flex justify-center items-center pt-20 p-4">
          <div className="text-center max-w-md w-full">
            <div className="mb-6">
              <div className="w-20 h-20 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">💐</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome to Your Memorials</h2>
              <p className="text-gray-600 mb-6">
                Create your first memorial to honor and celebrate the life of your loved one.
              </p>
            </div>
            <button
              onClick={handleCreateNewMemorial}
              className="w-full px-6 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg hover:from-amber-600 hover:to-orange-600 transition-all font-medium shadow-lg text-lg"
            >
              Create Your First Memorial
            </button>
            <p className="text-sm text-gray-500 mt-4">
              You can add photos, stories, timeline events, and more
            </p>
          </div>
        </div>
        
        <Footer />
      </div>
    );
  }

  // If no memorial ID but user has memorials (shouldn't happen due to auto-select), show selection screen
  if (!memorialId && userMemorials.length > 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <TopNav 
          memorials={userMemorials}
          currentMemorialId=""
          onSelectMemorial={(id) => {
            localStorage.setItem('currentMemorialId', id);
            window.location.href = `/dashboard?memorialId=${id}`;
          }}
          onCreateNew={handleCreateNewMemorial}
          onDeleteMemorial={async (memorialId) => {
    // You can reuse the same delete logic or create a simplified version
    const token = localStorage.getItem('token');
    if (!token) return;

    const confirmDelete = window.confirm('Are you sure you want to delete this memorial? This action cannot be undone.');
    if (!confirmDelete) return;

    try {
      const response = await fetch(`https://wings-of-memories-backend.onrender.com/api/memorials/${memorialId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        // Refresh the page to show updated list
        window.location.reload();
      }
    } catch (error) {
      console.error('Error deleting memorial:', error);
      alert('Failed to delete memorial');
    }
  }}
        />
        
        {/* <SearchNavbar 
          onSearch={() => {}} 
          onFilterChange={() => {}} 
        /> */}
        
        <div className="flex justify-center items-center pt-20 p-4">
          <div className="text-center max-w-md w-full">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Select a Memorial</h2>
            <p className="text-gray-600 mb-6">
              Choose which memorial you'd like to work on, or create a new one.
            </p>
            <div className="space-y-3">
              {userMemorials.map(memorial => (
                <button
                  key={memorial.id}
                  onClick={() => {
                    localStorage.setItem('currentMemorialId', memorial.id);
                    window.location.href = `/dashboard?memorialId=${memorial.id}`;
                  }}
                  className="w-full px-6 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-left"
                >
                  <div className="font-medium text-gray-800">{memorial.name}</div>
                  <div className="text-sm text-gray-500">
                    Created {new Date(memorial.createdAt).toLocaleDateString()}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
        
        <Footer />
      </div>
    );
  }

  return (
    <MemorialProvider memorialId={memorialId}>
      <DashboardContent />
    </MemorialProvider>
  );
};