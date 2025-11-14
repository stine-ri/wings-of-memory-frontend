// Contexts/MemorialContext.tsx
// FIXED VERSION

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
  saving: boolean;
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
  const [saving, setSaving] = useState(false);
  
  // Track what needs to be saved
  const pendingChangesRef = useRef<Partial<MemorialData>>({});
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load memorial from backend
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
        
        console.log('✅ Loaded memorial from backend:', {
          id: data.memorial.id,
          name: data.memorial.name,
          hasData: {
            timeline: data.memorial.timeline?.length || 0,
            favorites: data.memorial.favorites?.length || 0,
            familyTree: data.memorial.familyTree?.length || 0,
            gallery: data.memorial.gallery?.length || 0,
            memoryWall: data.memorial.memoryWall?.length || 0,
          }
        });
        
        // Ensure all arrays exist
        const memorial = {
          ...data.memorial,
          timeline: data.memorial.timeline || [],
          favorites: data.memorial.favorites || [],
          familyTree: data.memorial.familyTree || [],
          gallery: data.memorial.gallery || [],
          memoryWall: data.memorial.memoryWall || [],
        };
        
        setMemorialData(memorial);
        pendingChangesRef.current = {}; // Clear any pending changes
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

  // Save to backend
  const saveToBackend = useCallback(async () => {
    if (!memorialData?.id || saving) {
      console.log('⏭️ Skipping save:', { hasId: !!memorialData?.id, saving });
      return;
    }

    const changesToSave = { ...pendingChangesRef.current };
    
    // If nothing to save, skip
    if (Object.keys(changesToSave).length === 0) {
      console.log('⏭️ No changes to save');
      return;
    }

    try {
      setSaving(true);
      pendingChangesRef.current = {}; // Clear immediately
      
      console.log('💾 Saving changes:', Object.keys(changesToSave));
      
      const response = await fetch(`https://wings-of-memories-backend.onrender.com/api/memorials/${memorialData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(changesToSave)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Save failed:', errorText);
        
        // Restore changes if save failed
        pendingChangesRef.current = { ...changesToSave, ...pendingChangesRef.current };
        throw new Error(`Failed to save: ${errorText}`);
      }

      const result = await response.json();
      console.log('✅ Saved successfully');
      
      // Update state with confirmed backend data
      setMemorialData(result.memorial);
      
    } catch (error) {
      console.error('❌ Save error:', error);
      alert('Failed to save changes. Please try again.');
    } finally {
      setSaving(false);
    }
  }, [memorialData, saving]);

  // Schedule auto-save
  const scheduleSave = useCallback(() => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    
    // Auto-save after 2 seconds of no changes
    saveTimeoutRef.current = setTimeout(() => {
      saveToBackend();
    }, 2000);
  }, [saveToBackend]);

  // Update memorial data
  const updateMemorialData = useCallback((updates: Partial<MemorialData>) => {
    console.log('📝 Updating memorial:', Object.keys(updates));
    
    setMemorialData(prev => {
      if (!prev) return prev;
      
      const newData = { ...prev, ...updates };
      
      // Track what changed - merge updates into pending changes
      pendingChangesRef.current = {
        ...pendingChangesRef.current,
        ...updates
      };
      
      console.log('📊 Pending changes:', Object.keys(pendingChangesRef.current));
      
      // Schedule save
      scheduleSave();
      
      return newData;
    });
  }, [scheduleSave]);

  // Specific update functions
  const updateTimeline = useCallback((events: TimelineEvent[]) => {
    console.log('📅 Updating timeline:', events.length, 'events');
    updateMemorialData({ timeline: events });
  }, [updateMemorialData]);

  const updateFavorites = useCallback((favorites: Favorite[]) => {
    console.log('⭐ Updating favorites:', favorites.length, 'items');
    updateMemorialData({ favorites });
  }, [updateMemorialData]);

  const updateFamilyTree = useCallback((members: FamilyMember[]) => {
    console.log('👨‍👩‍👧‍👦 Updating family tree:', members.length, 'members');
    updateMemorialData({ familyTree: members });
  }, [updateMemorialData]);

  const updateGallery = useCallback((images: GalleryImage[]) => {
    console.log('🖼️ Updating gallery:', images.length, 'images');
    updateMemorialData({ gallery: images });
  }, [updateMemorialData]);

  const updateService = useCallback((service: ServiceInfo) => {
    console.log('⛪ Updating service info');
    updateMemorialData({ service });
  }, [updateMemorialData]);

  const updateMemories = useCallback((memories: Memory[]) => {
    console.log('💭 Updating memories:', memories.length, 'items');
    updateMemorialData({ memories });
  }, [updateMemorialData]);

  const updateMemoryWall = useCallback((memoryWall: Memory[]) => {
    console.log('🧱 Updating memory wall:', memoryWall.length, 'items');
    updateMemorialData({ memoryWall });
  }, [updateMemorialData]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      // Save any pending changes before unmount
      if (Object.keys(pendingChangesRef.current).length > 0) {
        console.log('🔄 Saving pending changes on unmount');
        saveToBackend();
      }
    };
  }, [saveToBackend]);

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
      saving,
      refreshMemorial
    }}>
      {children}
    </MemorialContext.Provider>
  );
};

export { MemorialContext };
export default MemorialProvider;