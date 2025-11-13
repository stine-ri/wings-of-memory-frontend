// Contexts/MemorialContext.tsx - FIXED VERSION
import React, { createContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { MemorialData, TimelineEvent, Favorite, FamilyMember, GalleryImage, ServiceInfo, Memory } from '../types/memorial';

// Export the interface separately at the top level
export interface MemorialContextType {
  memorialData: MemorialData | null;
  updateMemorialData: (updates: Partial<MemorialData>) => void;
  updateTimeline: (events: TimelineEvent[]) => void;
  updateFavorites: (favorites: Favorite[]) => void;
  updateFamilyTree: (members: FamilyMember[]) => void;
  updateGallery: (images: GalleryImage[]) => void;
  updateService: (service: ServiceInfo) => void;
  updateMemories: (memories: Memory[]) => void;
  updateMemoryWall: (memoryWall: Memory[]) => void;
  saveToBackend: () => Promise<void>;
  loading: boolean;
  refreshMemorial: () => Promise<void>;
}

const defaultMemorialData: MemorialData = {
  id: '',
  name: '',
  profileImage: '',
  birthDate: '',
  deathDate: '',
  location: '',
  obituary: '',
  timeline: [],
  favorites: [],
  familyTree: [],
  gallery: [],
  service: {
    venue: '',
    address: '',
    date: '',
    time: ''
  },
  memories: [],
  memoryWall: [],
  isPublished: false,
  customUrl: '',
  theme: 'default'
};

// Create context without exporting it directly
const MemorialContext = createContext<MemorialContextType | undefined>(undefined);

interface MemorialProviderProps {
  children: ReactNode;
  memorialId?: string;
}

// Export only the provider component
const MemorialProvider: React.FC<MemorialProviderProps> = ({ children, memorialId }) => {
  const [memorialData, setMemorialData] = useState<MemorialData | null>(null);
  const [loading, setLoading] = useState(true);
  const [autoSaveTimeout, setAutoSaveTimeout] = useState<number>();
  const [isSaving, setIsSaving] = useState(false);

  // Load memorial data from backend
  const loadMemorialData = useCallback(async () => {
    if (!memorialId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`https://wings-of-memories-backend.onrender.com/api/memorials/${memorialId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        
        // Log what we receive from backend
        console.log('📥 Received from backend:', {
          memorialKeys: Object.keys(data.memorial),
          hasService: 'service' in data.memorial,
          hasServiceInfo: 'serviceInfo' in data.memorial
        });
        
        setMemorialData(data.memorial);
      } else {
        console.error('Failed to load memorial');
        setMemorialData({ ...defaultMemorialData, id: memorialId });
      }
    } catch (error) {
      console.error('Error loading memorial:', error);
      setMemorialData({ ...defaultMemorialData, id: memorialId });
    } finally {
      setLoading(false);
    }
  }, [memorialId]);

  useEffect(() => {
    loadMemorialData();
  }, [loadMemorialData]);

  const refreshMemorial = useCallback(async () => {
    await loadMemorialData();
  }, [loadMemorialData]);

  const saveToBackend = useCallback(async () => {
    if (!memorialData?.id || isSaving) return;

    try {
      setIsSaving(true);
      
      // Create a clean copy without the duplicate fields that cause issues
      const cleanData: Omit<MemorialData, 'service' | 'memories'> & {
        serviceInfo?: ServiceInfo;
      } = { ...memorialData };
      
      // Remove the problematic duplicate fields
      delete (cleanData as Partial<MemorialData>).service;
      delete (cleanData as Partial<MemorialData>).memories;
      
      const backendData = {
        name: cleanData.name,
        profileImage: cleanData.profileImage,
        birthDate: cleanData.birthDate,
        deathDate: cleanData.deathDate,
        location: cleanData.location,
        obituary: cleanData.obituary,
        timeline: cleanData.timeline || [],
        favorites: cleanData.favorites || [],
        familyTree: cleanData.familyTree || [],
        gallery: cleanData.gallery || [],
        memoryWall: cleanData.memoryWall || [],
        serviceInfo: cleanData.serviceInfo || {
          venue: '',
          address: '',
          date: '',
          time: '',
          virtualLink: '',
          virtualPlatform: 'zoom'
        },
        theme: cleanData.theme,
        customUrl: cleanData.customUrl
      };

      console.log('💾 Saving to backend - clean data:', {
        memorialId: cleanData.id,
        hasServiceInfo: !!backendData.serviceInfo
      });

      const response = await fetch(`https://wings-of-memories-backend.onrender.com/api/memorials/${cleanData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(backendData)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Backend error response:', errorText);
        throw new Error(`Failed to save memorial: ${errorText}`);
      }

      const result = await response.json();
      console.log('✅ Memorial saved successfully');
      return result;
    } catch (error) {
      console.error('❌ Error saving memorial:', error);
      throw error;
    } finally {
      setIsSaving(false);
    }
  }, [memorialData, isSaving]);

  // Debounced auto-save - FIXED to prevent infinite loops
  const debouncedSave = useCallback(() => {
    if (autoSaveTimeout) {
      clearTimeout(autoSaveTimeout);
    }
    
    // Only save if not already saving and we have valid data
    if (!isSaving && memorialData?.id) {
      const timeout = setTimeout(() => {
        saveToBackend().catch(error => {
          console.error('Auto-save failed:', error);
        });
      }, 2000) as unknown as number; // 2 second debounce

      setAutoSaveTimeout(timeout);
    }
  }, [autoSaveTimeout, isSaving, memorialData, saveToBackend]);

  // Safe way to check if object has property
  const hasOwnProperty = (obj: object, prop: string): boolean => {
    return Object.prototype.hasOwnProperty.call(obj, prop);
  };

  // FIXED: Update memorial data without causing infinite loops
  const updateMemorialData = useCallback((updates: Partial<MemorialData>) => {
    setMemorialData(prev => {
      if (!prev) return prev;
      
      // Check if there are actual changes to prevent unnecessary updates
      const hasChanges = Object.keys(updates).some(key => {
        const prevValue = prev[key as keyof MemorialData];
        const newValue = updates[key as keyof MemorialData];
        return JSON.stringify(prevValue) !== JSON.stringify(newValue);
      });
      
      if (!hasChanges) {
        return prev; // No changes, return previous data to prevent re-renders
      }
      
      const newData = { ...prev, ...updates };
      
      // Only trigger auto-save for meaningful data changes, not UI state changes
      const shouldAutoSave = !hasOwnProperty(updates, 'loading') && 
                            !hasOwnProperty(updates, 'isSaving');
      
      if (shouldAutoSave) {
        debouncedSave();
      }
      
      return newData;
    });
  }, [debouncedSave]);

  const updateTimeline = useCallback((events: TimelineEvent[]) => {
    updateMemorialData({ timeline: events });
  }, [updateMemorialData]);

  const updateFavorites = useCallback((favorites: Favorite[]) => {
    updateMemorialData({ favorites });
  }, [updateMemorialData]);

  const updateFamilyTree = useCallback((members: FamilyMember[]) => {
    updateMemorialData({ familyTree: members });
  }, [updateMemorialData]);

  const updateGallery = useCallback((images: GalleryImage[]) => {
    updateMemorialData({ gallery: images });
  }, [updateMemorialData]);

  const updateService = useCallback((service: ServiceInfo) => {
    updateMemorialData({ service });
  }, [updateMemorialData]);

  const updateMemories = useCallback((memories: Memory[]) => {
    updateMemorialData({ memories });
  }, [updateMemorialData]);

  const updateMemoryWall = useCallback((memoryWall: Memory[]) => {
    updateMemorialData({ memoryWall });
  }, [updateMemorialData]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (autoSaveTimeout) {
        clearTimeout(autoSaveTimeout);
      }
    };
  }, [autoSaveTimeout]);

  return (
    <MemorialContext.Provider value={{
      memorialData,
      updateMemorialData,
      updateTimeline,
      updateFavorites,
      updateFamilyTree,
      updateGallery,
      updateService,
      updateMemories,
      updateMemoryWall,
      saveToBackend,
      loading,
      refreshMemorial
    }}>
      {children}
    </MemorialContext.Provider>
  );
};

// Export only what's needed - remove the duplicate type export
export { MemorialContext };
export default MemorialProvider;