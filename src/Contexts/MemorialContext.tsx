// Contexts/MemorialContext.tsx - FIXED RACE CONDITION
import React, { createContext, useState, useEffect, useCallback, useRef } from 'react';
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
  const [isSaving, setIsSaving] = useState(false);
  
  // Use ref to track the latest data for saves
  const memorialDataRef = useRef<MemorialData | null>(null);
  const autoSaveTimeoutRef = useRef<number | undefined>(undefined);

  // Keep ref in sync with state
  useEffect(() => {
    memorialDataRef.current = memorialData;
  }, [memorialData]);

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
        
        console.log('📥 COMPLETE memorial data loaded:', {
          id: data.memorial.id,
          name: data.memorial.name,
          timeline: data.memorial.timeline?.length || 0,
          favorites: data.memorial.favorites?.length || 0,
          familyTree: data.memorial.familyTree?.length || 0,
          gallery: data.memorial.gallery?.length || 0,
          memoryWall: data.memorial.memoryWall?.length || 0,
          obituary: data.memorial.obituary?.length || 0,
          service: !!data.memorial.service?.venue
        });
        
        // Ensure all arrays exist
        const completeMemorialData = {
          ...data.memorial,
          timeline: Array.isArray(data.memorial.timeline) ? data.memorial.timeline : [],
          favorites: Array.isArray(data.memorial.favorites) ? data.memorial.favorites : [],
          familyTree: Array.isArray(data.memorial.familyTree) ? data.memorial.familyTree : [],
          gallery: Array.isArray(data.memorial.gallery) ? data.memorial.gallery : [],
          memoryWall: Array.isArray(data.memorial.memoryWall) ? data.memorial.memoryWall : [],
          memories: Array.isArray(data.memorial.memories) ? data.memorial.memories : [],
          service: data.memorial.service || {
            venue: '',
            address: '',
            date: '',
            time: '',
            virtualLink: '',
            virtualPlatform: 'zoom'
          }
        };
        
        setMemorialData(completeMemorialData);
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

  // ENHANCED: Save function that sends COMPLETE data
  const saveToBackend = useCallback(async () => {
    const currentData = memorialDataRef.current;
    
    if (!currentData?.id || isSaving) {
      console.log('⚠️ Skipping save:', { 
        hasId: !!currentData?.id, 
        isSaving 
      });
      return;
    }

    try {
      setIsSaving(true);
      
      console.log('🔍 SAVING - Complete data snapshot:', {
        id: currentData.id,
        name: currentData.name,
        timeline: Array.isArray(currentData.timeline) ? currentData.timeline.length : 0,
        favorites: Array.isArray(currentData.favorites) ? currentData.favorites.length : 0,
        familyTree: Array.isArray(currentData.familyTree) ? currentData.familyTree.length : 0,
        gallery: Array.isArray(currentData.gallery) ? currentData.gallery.length : 0,
        memoryWall: Array.isArray(currentData.memoryWall) ? currentData.memoryWall.length : 0,
        obituary: currentData.obituary?.length || 0,
        service: !!currentData.service?.venue
      });
      
      // ALWAYS send COMPLETE data to backend
      const backendData = {
        // Basic info
        name: currentData.name || '',
        profileImage: currentData.profileImage || '',
        birthDate: currentData.birthDate || '',
        deathDate: currentData.deathDate || '',
        location: currentData.location || '',
        obituary: currentData.obituary || '',
        
        // Arrays - ALWAYS include them
        timeline: Array.isArray(currentData.timeline) ? currentData.timeline : [],
        favorites: Array.isArray(currentData.favorites) ? currentData.favorites : [],
        familyTree: Array.isArray(currentData.familyTree) ? currentData.familyTree : [],
        gallery: Array.isArray(currentData.gallery) ? currentData.gallery : [],
        memoryWall: Array.isArray(currentData.memoryWall) ? currentData.memoryWall : [],
        
        // Service info - ALWAYS include it
        service: currentData.service || {
          venue: '',
          address: '',
          date: '',
          time: '',
          virtualLink: '',
          virtualPlatform: 'zoom'
        },
        
        // Other fields
        theme: currentData.theme || 'default',
        customUrl: currentData.customUrl || '',
        isPublished: currentData.isPublished || false
      };

      console.log('💾 Sending COMPLETE data to backend:', {
        timeline: backendData.timeline.length,
        favorites: backendData.favorites.length,
        familyTree: backendData.familyTree.length,
        gallery: backendData.gallery.length,
        memoryWall: backendData.memoryWall.length,
        hasService: !!backendData.service.venue
      });

      const response = await fetch(`https://wings-of-memories-backend.onrender.com/api/memorials/${currentData.id}`, {
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
      console.log('✅ Memorial saved successfully with ALL data preserved');
      return result;
    } catch (error) {
      console.error('❌ Error saving memorial:', error);
      throw error;
    } finally {
      setIsSaving(false);
    }
  }, [isSaving]);

  // FIXED: Debounced save now always uses the latest ref data
  const debouncedSave = useCallback(() => {
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }
    
    if (!isSaving && memorialDataRef.current?.id) {
      autoSaveTimeoutRef.current = setTimeout(() => {
        saveToBackend().catch(error => {
          console.error('Auto-save failed:', error);
        });
      }, 2000) as unknown as number;
    }
  }, [isSaving, saveToBackend]);

  const hasOwnProperty = (obj: object, prop: string): boolean => {
    return Object.prototype.hasOwnProperty.call(obj, prop);
  };

 // FIXED: Optimized updateMemorialData with proper change detection
const updateMemorialData = useCallback((updates: Partial<MemorialData>) => {
  console.log('📝 updateMemorialData called with:', {
    updateKeys: Object.keys(updates),
    timelineLength: Array.isArray(updates.timeline) ? updates.timeline.length : 'not-updated',
    favoritesLength: Array.isArray(updates.favorites) ? updates.favorites.length : 'not-updated',
  });

  setMemorialData(prev => {
    if (!prev) return prev;
    
    // DEEP COMPARISON: Only update if data actually changed
    const hasActualChanges = Object.keys(updates).some(key => {
      const prevValue = prev[key as keyof MemorialData];
      const newValue = updates[key as keyof MemorialData];
      
      // Special handling for arrays and objects
      if (Array.isArray(prevValue) && Array.isArray(newValue)) {
        return JSON.stringify(prevValue) !== JSON.stringify(newValue);
      }
      if (typeof prevValue === 'object' && typeof newValue === 'object') {
        return JSON.stringify(prevValue) !== JSON.stringify(newValue);
      }
      
      return prevValue !== newValue;
    });
    
    if (!hasActualChanges) {
      console.log('🔄 No actual changes detected, skipping update');
      return prev;
    }
    
    const newData = { ...prev, ...updates };
    
    console.log('✅ State updated with actual changes. New data:', {
      id: newData.id,
      timelineLength: Array.isArray(newData.timeline) ? newData.timeline.length : 0,
      favoritesLength: Array.isArray(newData.favorites) ? newData.favorites.length : 0,
    });
    
    // CRITICAL FIX: Only auto-save for meaningful updates
    const shouldAutoSave = !hasOwnProperty(updates, 'loading') && 
                          !hasOwnProperty(updates, 'isSaving') &&
                          hasActualChanges;
    
    if (shouldAutoSave) {
      // Use setTimeout to ensure the ref is updated before save
      setTimeout(() => {
        debouncedSave();
      }, 0);
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

  // Cleanup
  useEffect(() => {
    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, []);

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