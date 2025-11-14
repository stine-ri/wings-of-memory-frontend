// Contexts/MemorialContext.tsx

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
  saveToBackend: () => Promise<boolean>;
  loading: boolean;
  saving: boolean;
  refreshMemorial: () => Promise<void>;
  lastSaved: Date | null;
  hasUnsavedChanges: boolean;
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

// Persistent storage for user's memorials
const USER_MEMORIALS_KEY = 'user_memorials_cache';

const MemorialProvider: React.FC<MemorialProviderProps> = ({ children, memorialId }) => {
  const [memorialData, setMemorialData] = useState<MemorialData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  
  // Track what needs to be saved
  const pendingChangesRef = useRef<Partial<MemorialData>>({});
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const retryCountRef = useRef(0);
  const MAX_RETRIES = 3;

  // Refs to track state without causing re-renders
  const memorialDataRef = useRef<MemorialData | null>(null);
  const isLoadingRef = useRef(false);

  // Update refs when state changes
  useEffect(() => {
    memorialDataRef.current = memorialData;
  }, [memorialData]);

  // Cache user memorials for better UX
  const cacheUserMemorial = useCallback((memorial: MemorialData) => {
    try {
      const cached = localStorage.getItem(USER_MEMORIALS_KEY);
      const memorials = cached ? JSON.parse(cached) : {};
      
      memorials[memorial.id] = {
        ...memorial,
        lastAccessed: new Date().toISOString()
      };
      
      localStorage.setItem(USER_MEMORIALS_KEY, JSON.stringify(memorials));
    } catch (error) {
      console.warn('Failed to cache memorial:', error);
    }
  }, []);

  // Load memorial from backend with caching - FIXED: removed memorialData dependency
  const loadMemorialData = useCallback(async () => {
    if (!memorialId || isLoadingRef.current) {
      setLoading(false);
      return;
    }

    try {
      isLoadingRef.current = true;
      setLoading(true);
      
      // Try cache first for better performance
      try {
        const cached = localStorage.getItem(USER_MEMORIALS_KEY);
        if (cached) {
          const memorials = JSON.parse(cached);
          if (memorials[memorialId]) {
            console.log('📦 Loading from cache:', memorialId);
            const cachedMemorial = memorials[memorialId];
            setMemorialData(cachedMemorial);
            setLastSaved(new Date(cachedMemorial.lastAccessed));
          }
        }
      } catch (cacheError) {
        console.warn('Cache load failed:', cacheError);
      }

      const response = await fetch(`https://wings-of-memories-backend.onrender.com/api/memorials/${memorialId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        // Add timeout for better error handling
        signal: AbortSignal.timeout(10000)
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
        setLastSaved(new Date());
        setHasUnsavedChanges(false);
        pendingChangesRef.current = {}; // Clear any pending changes
        
        // Cache the memorial
        cacheUserMemorial(memorial);
        
      } else if (response.status === 404) {
        console.log('🆕 Memorial not found, creating default');
        const newMemorial = { ...defaultMemorialData, id: memorialId };
        setMemorialData(newMemorial);
        setHasUnsavedChanges(true); // New memorial needs to be saved
      } else {
        console.error('Failed to load memorial:', response.status);
        // Use ref instead of state to check for existing data
        if (!memorialDataRef.current) {
          setMemorialData({ ...defaultMemorialData, id: memorialId });
        }
      }
    } catch (error) {
      console.error('Error loading memorial:', error);
      // Use ref instead of state to check for existing data
      if (!memorialDataRef.current) {
        setMemorialData({ ...defaultMemorialData, id: memorialId });
      }
    } finally {
      setLoading(false);
      isLoadingRef.current = false;
    }
  }, [memorialId, cacheUserMemorial]); // REMOVED: memorialData dependency

  // FIXED: Only run when memorialId changes, not when loadMemorialData changes
  useEffect(() => {
    if (memorialId) {
      loadMemorialData();
    } else {
      setLoading(false);
    }
  }, [memorialId]); // REMOVED: loadMemorialData dependency

  // FIXED: Simplified refresh function
  const refreshMemorial = useCallback(async () => {
    if (memorialId) {
      await loadMemorialData();
    }
  }, [memorialId, loadMemorialData]);

  // Enhanced save to backend with retry logic
  const saveToBackend = useCallback(async (): Promise<boolean> => {
    if (!memorialData?.id || saving) {
      console.log('⏭️ Skipping save:', { hasId: !!memorialData?.id, saving });
      return false;
    }

    const changesToSave = { ...pendingChangesRef.current };
    
    // If nothing to save, skip
    if (Object.keys(changesToSave).length === 0) {
      console.log('⏭️ No changes to save');
      return true;
    }

    try {
      setSaving(true);
      
      console.log('💾 Saving changes:', Object.keys(changesToSave));
      
      const response = await fetch(`https://wings-of-memories-backend.onrender.com/api/memorials/${memorialData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          ...changesToSave,
          lastModified: new Date().toISOString()
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Save failed:', errorText);
        
        // Retry logic
        if (retryCountRef.current < MAX_RETRIES) {
          retryCountRef.current += 1;
          console.log(`🔄 Retrying save (${retryCountRef.current}/${MAX_RETRIES})`);
          await new Promise(resolve => setTimeout(resolve, 1000 * retryCountRef.current));
          return await saveToBackend();
        }
        
        throw new Error(`Failed to save: ${errorText}`);
      }

      const result = await response.json();
      console.log('✅ Saved successfully');
      
      // Update state with confirmed backend data
      setMemorialData(result.memorial);
      setLastSaved(new Date());
      setHasUnsavedChanges(false);
      pendingChangesRef.current = {};
      retryCountRef.current = 0;
      
      // Update cache
      cacheUserMemorial(result.memorial);
      
      return true;
      
    } catch (error) {
      console.error('❌ Save error:', error);
      
      // Show user-friendly error message
      if (retryCountRef.current >= MAX_RETRIES) {
        alert('Failed to save changes after multiple attempts. Your changes are stored locally and will be saved when you try again.');
      }
      
      return false;
    } finally {
      setSaving(false);
    }
  }, [memorialData, saving, cacheUserMemorial]);

  // Debounced auto-save with better cleanup
  const scheduleSave = useCallback(() => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    
    setHasUnsavedChanges(true);
    
    // Auto-save after 3 seconds of no changes (increased for better performance)
    saveTimeoutRef.current = setTimeout(() => {
      saveToBackend().then(success => {
        if (!success) {
          // If save failed, keep the changes pending
          setHasUnsavedChanges(true);
        }
      });
    }, 3000);
  }, [saveToBackend]);

  // Update memorial data
const updateMemorialData = useCallback((updates: Partial<MemorialData>) => {
  console.log('📝 Updating memorial:', Object.keys(updates));
  
  setMemorialData(prev => {
    if (!prev) return prev;
    
    const newData = { ...prev, ...updates };
    
    // ✅ CORRECT: Merge updates into pending changes
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

  // Save before page unload
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (Object.keys(pendingChangesRef.current).length > 0) {
        event.preventDefault();
        event.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
        return event.returnValue;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  // Enhanced cleanup on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      // Force save any pending changes before unmount
      if (Object.keys(pendingChangesRef.current).length > 0) {
        console.log('🔄 Saving pending changes on unmount');
        // Use synchronous fetch or store in localStorage for recovery
        const changes = JSON.stringify(pendingChangesRef.current);
        localStorage.setItem(`pending_changes_${memorialData?.id}`, changes);
        saveToBackend().catch(console.error);
      }
    };
  }, [saveToBackend, memorialData?.id]);

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
      refreshMemorial,
      lastSaved,
      hasUnsavedChanges
    }}>
      {children}
    </MemorialContext.Provider>
  );
};

export default MemorialProvider;
export { MemorialContext };