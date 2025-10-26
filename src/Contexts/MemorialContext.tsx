// Contexts/MemorialContext.tsx - UPDATED with memoryWall
import React, { createContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { MemorialData, TimelineEvent, Favorite, FamilyMember, GalleryImage, ServiceInfo, Memory } from '../types/memorial';

export interface MemorialContextType {
  memorialData: MemorialData | null;
  updateMemorialData: (updates: Partial<MemorialData>) => void;
  updateTimeline: (events: TimelineEvent[]) => void;
  updateFavorites: (favorites: Favorite[]) => void;
  updateFamilyTree: (members: FamilyMember[]) => void;
  updateGallery: (images: GalleryImage[]) => void;
  updateService: (service: ServiceInfo) => void;
  updateMemories: (memories: Memory[]) => void;
  updateMemoryWall: (memoryWall: Memory[]) => void; // ADD THIS LINE
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
  memoryWall: [], // ADD THIS LINE
  isPublished: false,
  customUrl: '',
  theme: 'default'
};

export const MemorialContext = createContext<MemorialContextType | undefined>(undefined);

interface MemorialProviderProps {
  children: ReactNode;
  memorialId?: string;
}

export const MemorialProvider: React.FC<MemorialProviderProps> = ({ children, memorialId }) => {
  const [memorialData, setMemorialData] = useState<MemorialData | null>(null);
  const [loading, setLoading] = useState(true);
  const [autoSaveTimeout, setAutoSaveTimeout] = useState<number>();

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
        setMemorialData(data.memorial);
      } else {
        console.error('Failed to load memorial');
        // Set default data if load fails
        setMemorialData({ ...defaultMemorialData, id: memorialId });
      }
    } catch (error) {
      console.error('Error loading memorial:', error);
      // Set default data on error
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
    if (!memorialData?.id) return;

    try {
      const response = await fetch(`https://wings-of-memories-backend.onrender.com/api/memorials/${memorialData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(memorialData)
      });

      if (!response.ok) {
        throw new Error('Failed to save memorial');
      }

      console.log('Memorial saved successfully');
    } catch (error) {
      console.error('Error saving memorial:', error);
      throw error;
    }
  }, [memorialData]);

  // Debounced auto-save
  const debouncedSave = useCallback(() => {
    if (autoSaveTimeout) {
      clearTimeout(autoSaveTimeout);
    }
    
    const timeout = setTimeout(() => {
      saveToBackend().catch(error => {
        console.error('Auto-save failed:', error);
      });
    }, 2000) as unknown as number; // 2 second debounce

    setAutoSaveTimeout(timeout);
  }, [autoSaveTimeout, saveToBackend]);

  const updateMemorialData = useCallback((updates: Partial<MemorialData>) => {
    setMemorialData(prev => {
      if (!prev) return prev;
      const newData = { ...prev, ...updates };
      // Auto-save to backend with debounce
      debouncedSave();
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

  // ADD THIS METHOD
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
      updateMemoryWall, // ADD THIS LINE
      saveToBackend,
      loading,
      refreshMemorial
    }}>
      {children}
    </MemorialContext.Provider>
  );
};