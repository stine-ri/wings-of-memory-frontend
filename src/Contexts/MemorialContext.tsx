// Contexts/MemorialContext.tsx - FIXED VERSION
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

const MemorialContext = createContext<MemorialContextType | undefined>(undefined);

interface MemorialProviderProps {
  children: ReactNode;
  memorialId?: string;
}

const MemorialProvider: React.FC<MemorialProviderProps> = ({ children, memorialId }) => {
  const [memorialData, setMemorialData] = useState<MemorialData | null>(null);
  const [loading, setLoading] = useState(true);
  const [autoSaveTimeout, setAutoSaveTimeout] = useState<number>();
  const [isSaving, setIsSaving] = useState(false);

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
        
        console.log('📥 Loaded memorial from backend:', {
          id: data.memorial.id,
          name: data.memorial.name,
          timelineCount: data.memorial.timeline?.length || 0,
          favoritesCount: data.memorial.favorites?.length || 0,
          familyTreeCount: data.memorial.familyTree?.length || 0,
          galleryCount: data.memorial.gallery?.length || 0,
          memoryWallCount: data.memorial.memoryWall?.length || 0,
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
    if (!memorialData?.id || isSaving) {
      console.log('⚠️ Skipping save:', { 
        hasId: !!memorialData?.id, 
        isSaving 
      });
      return;
    }

    try {
      setIsSaving(true);
      
      // CRITICAL: Log the actual memorialData state at the moment of save
      console.log('🔍 CURRENT memorialData state:', {
        id: memorialData.id,
        name: memorialData.name,
        timeline: memorialData.timeline,
        favorites: memorialData.favorites,
        familyTree: memorialData.familyTree,
        gallery: memorialData.gallery,
        memoryWall: memorialData.memoryWall,
        timelineLength: Array.isArray(memorialData.timeline) ? memorialData.timeline.length : 0,
        favoritesLength: Array.isArray(memorialData.favorites) ? memorialData.favorites.length : 0,
        familyTreeLength: Array.isArray(memorialData.familyTree) ? memorialData.familyTree.length : 0,
        galleryLength: Array.isArray(memorialData.gallery) ? memorialData.gallery.length : 0,
        memoryWallLength: Array.isArray(memorialData.memoryWall) ? memorialData.memoryWall.length : 0,
      });
      
      // Build the payload directly from memorialData - no intermediate cleaning
      const backendData = {
        name: memorialData.name || '',
        profileImage: memorialData.profileImage || '',
        birthDate: memorialData.birthDate || '',
        deathDate: memorialData.deathDate || '',
        location: memorialData.location || '',
        obituary: memorialData.obituary || '',
        timeline: Array.isArray(memorialData.timeline) ? memorialData.timeline : [],
        favorites: Array.isArray(memorialData.favorites) ? memorialData.favorites : [],
        familyTree: Array.isArray(memorialData.familyTree) ? memorialData.familyTree : [],
        gallery: Array.isArray(memorialData.gallery) ? memorialData.gallery : [],
        memoryWall: Array.isArray(memorialData.memoryWall) ? memorialData.memoryWall : [],
        service: memorialData.service || {
          venue: '',
          address: '',
          date: '',
          time: '',
          virtualLink: '',
          virtualPlatform: 'zoom'
        },
        theme: memorialData.theme || 'default',
        customUrl: memorialData.customUrl || ''
      };

      console.log('💾 Sending to backend:', {
        id: memorialData.id,
        timelineLength: backendData.timeline.length,
        favoritesLength: backendData.favorites.length,
        familyTreeLength: backendData.familyTree.length,
        galleryLength: backendData.gallery.length,
        memoryWallLength: backendData.memoryWall.length,
        fullPayload: JSON.stringify(backendData).substring(0, 200) + '...'
      });

      const response = await fetch(`https://wings-of-memories-backend.onrender.com/api/memorials/${memorialData.id}`, {
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

  const debouncedSave = useCallback(() => {
    if (autoSaveTimeout) {
      clearTimeout(autoSaveTimeout);
    }
    
    if (!isSaving && memorialData?.id) {
      const timeout = setTimeout(() => {
        saveToBackend().catch(error => {
          console.error('Auto-save failed:', error);
        });
      }, 2000) as unknown as number;

      setAutoSaveTimeout(timeout);
    }
  }, [autoSaveTimeout, isSaving, memorialData, saveToBackend]);

  const hasOwnProperty = (obj: object, prop: string): boolean => {
    return Object.prototype.hasOwnProperty.call(obj, prop);
  };

  const updateMemorialData = useCallback((updates: Partial<MemorialData>) => {
    console.log('📝 updateMemorialData called with:', {
      updateKeys: Object.keys(updates),
      timelineLength: Array.isArray(updates.timeline) ? updates.timeline.length : 'not-updated',
      favoritesLength: Array.isArray(updates.favorites) ? updates.favorites.length : 'not-updated',
    });

    setMemorialData(prev => {
      if (!prev) return prev;
      
      const hasChanges = Object.keys(updates).some(key => {
        const prevValue = prev[key as keyof MemorialData];
        const newValue = updates[key as keyof MemorialData];
        return JSON.stringify(prevValue) !== JSON.stringify(newValue);
      });
      
      if (!hasChanges) {
        return prev;
      }
      
      const newData = { ...prev, ...updates };
      
      console.log('✅ State updated. New data:', {
        id: newData.id,
        timelineLength: Array.isArray(newData.timeline) ? newData.timeline.length : 0,
        favoritesLength: Array.isArray(newData.favorites) ? newData.favorites.length : 0,
        familyTreeLength: Array.isArray(newData.familyTree) ? newData.familyTree.length : 0,
        galleryLength: Array.isArray(newData.gallery) ? newData.gallery.length : 0,
        memoryWallLength: Array.isArray(newData.memoryWall) ? newData.memoryWall.length : 0,
      });
      
      const shouldAutoSave = !hasOwnProperty(updates, 'loading') && 
                            !hasOwnProperty(updates, 'isSaving');
      
      if (shouldAutoSave) {
        debouncedSave();
      }
      
      return newData;
    });
  }, [debouncedSave]);

  const updateTimeline = useCallback((events: TimelineEvent[]) => {
    console.log('📅 updateTimeline called with', events.length, 'events');
    updateMemorialData({ timeline: events });
  }, [updateMemorialData]);

  const updateFavorites = useCallback((favorites: Favorite[]) => {
    console.log('⭐ updateFavorites called with', favorites.length, 'favorites');
    updateMemorialData({ favorites });
  }, [updateMemorialData]);

  const updateFamilyTree = useCallback((members: FamilyMember[]) => {
    console.log('👨‍👩‍👧‍👦 updateFamilyTree called with', members.length, 'members');
    updateMemorialData({ familyTree: members });
  }, [updateMemorialData]);

  const updateGallery = useCallback((images: GalleryImage[]) => {
    console.log('🖼️ updateGallery called with', images.length, 'images');
    updateMemorialData({ gallery: images });
  }, [updateMemorialData]);

  const updateService = useCallback((service: ServiceInfo) => {
    console.log('⛪ updateService called');
    updateMemorialData({ service });
  }, [updateMemorialData]);

  const updateMemories = useCallback((memories: Memory[]) => {
    console.log('💭 updateMemories called with', memories.length, 'memories');
    updateMemorialData({ memories });
  }, [updateMemorialData]);

  const updateMemoryWall = useCallback((memoryWall: Memory[]) => {
    console.log('🧱 updateMemoryWall called with', memoryWall.length, 'memories');
    updateMemorialData({ memoryWall });
  }, [updateMemorialData]);

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

export { MemorialContext };
export default MemorialProvider;