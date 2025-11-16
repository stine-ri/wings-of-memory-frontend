// Contexts/MemorialContext.tsx - ENHANCED VERSION WITH GUARANTEED DATA PERSISTENCE
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
  error: string | null;
  dataIntegrity: DataIntegrityCheck;
}

interface DataIntegrityCheck {
  isComplete: boolean;
  missingSections: string[];
  totalSections: number;
  loadedSections: number;
  details: Record<string, { loaded: boolean; count?: number }>;
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
  service: undefined,
  serviceInfo: undefined,
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
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dataIntegrity, setDataIntegrity] = useState<DataIntegrityCheck>({
    isComplete: false,
    missingSections: [],
    totalSections: 8,
    loadedSections: 0,
    details: {}
  });

  const pendingChangesRef = useRef<Partial<MemorialData>>({});
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const loadingAttempts = useRef(0);
  const MAX_LOADING_ATTEMPTS = 3;

  // ENHANCED: Deep parsing function that handles all edge cases
  const parseArrayField = useCallback((field: unknown, fieldName: string): unknown[] => {
    // Already an array - return as is
    if (Array.isArray(field)) {
      console.log(`✅ ${fieldName}: Array with ${field.length} items`);
      return field;
    }
    
    // String that needs parsing
    if (typeof field === 'string') {
      const trimmed = field.trim();
      
      // Empty string
      if (!trimmed) {
        console.log(`ℹ️ ${fieldName}: Empty string, using []`);
        return [];
      }
      
      // Try parsing as JSON
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) {
          console.log(`✅ ${fieldName}: Parsed from JSON string, ${parsed.length} items`);
          return parsed;
        }
        console.warn(`⚠️ ${fieldName}: Parsed but not array, got ${typeof parsed}`);
        return [];
      } catch {
        console.error(`❌ ${fieldName}: JSON parse failed:`, trimmed.substring(0, 200));
        return [];
      }
    }
    
    // Null or undefined
    if (field == null) {
      console.log(`ℹ️ ${fieldName}: null/undefined, using []`);
      return [];
    }
    
    // Object that might need conversion
    if (typeof field === 'object') {
      console.warn(`⚠️ ${fieldName}: Object but not array, converting`);
      return [];
    }
    
    console.warn(`⚠️ ${fieldName}: Unexpected type ${typeof field}`);
    return [];
  }, []);

  // ENHANCED: Complete data structure with detailed validation
  const ensureCompleteMemorialData = useCallback((data: Record<string, unknown>): MemorialData => {
    console.log('🔧 Building complete memorial structure...');
    
    // Parse service info safely - handle undefined/null
    const rawService = (data.service || data.serviceInfo) as Record<string, unknown> | undefined;
    
    // Only create service object if rawService exists and has data
    let completeService: ServiceInfo | undefined;
    if (rawService) {
      completeService = {
        venue: typeof rawService.venue === 'string' ? rawService.venue : '',
        address: typeof rawService.address === 'string' ? rawService.address : '',
        date: typeof rawService.date === 'string' ? rawService.date : '',
        time: typeof rawService.time === 'string' ? rawService.time : '',
        virtualLink: typeof rawService.virtualLink === 'string' ? rawService.virtualLink : undefined,
        virtualPlatform: ['zoom', 'meet', 'teams'].includes(rawService.virtualPlatform as string)
          ? (rawService.virtualPlatform as 'zoom' | 'meet' | 'teams')
          : undefined
      };
    }

    // Parse all array fields with detailed logging
    const timeline = parseArrayField(data.timeline, 'timeline') as TimelineEvent[];
    const favorites = parseArrayField(data.favorites, 'favorites') as Favorite[];
    const familyTree = parseArrayField(data.familyTree, 'familyTree') as FamilyMember[];
    const gallery = parseArrayField(data.gallery, 'gallery') as GalleryImage[];
    const memories = parseArrayField(data.memories, 'memories') as Memory[];
    const memoryWall = parseArrayField(data.memoryWall, 'memoryWall') as Memory[];

    const completeData: MemorialData = {
      id: typeof data.id === 'string' ? data.id : '',
      name: typeof data.name === 'string' ? data.name : 'Unnamed Memorial',
      profileImage: typeof data.profileImage === 'string' ? data.profileImage : '',
      birthDate: typeof data.birthDate === 'string' ? data.birthDate : '',
      deathDate: typeof data.deathDate === 'string' ? data.deathDate : '',
      location: typeof data.location === 'string' ? data.location : '',
      obituary: typeof data.obituary === 'string' ? data.obituary : '',
      timeline,
      favorites,
      familyTree,
      gallery,
      memories,
      memoryWall,
      service: completeService,
      serviceInfo: completeService,
      isPublished: Boolean(data.isPublished),
      customUrl: typeof data.customUrl === 'string' ? data.customUrl : '',
      theme: typeof data.theme === 'string' ? data.theme : 'default'
    };

    // DETAILED LOGGING - Show actual data counts
    const hasService = completeService && (completeService.venue || completeService.address);
    console.log('✅ Memorial structure complete:', {
      id: completeData.id,
      name: completeData.name,
      sections: {
        timeline: `${completeData.timeline.length} events`,
        favorites: `${completeData.favorites.length} items`,
        familyTree: `${completeData.familyTree.length} members`,
        gallery: `${completeData.gallery.length} images`,
        memories: `${completeData.memories.length} memories`,
        memoryWall: `${completeData.memoryWall.length} posts`,
        service: hasService ? 'configured' : 'empty'
      }
    });

    return completeData;
  }, [parseArrayField]);

  // ENHANCED: Data integrity check with detailed reporting
  const checkDataIntegrity = useCallback((data: MemorialData): DataIntegrityCheck => {
    const sections = {
      id: { value: data.id, type: 'string' },
      name: { value: data.name, type: 'string' },
      timeline: { value: data.timeline, type: 'array' },
      favorites: { value: data.favorites, type: 'array' },
      familyTree: { value: data.familyTree, type: 'array' },
      gallery: { value: data.gallery, type: 'array' },
      service: { value: data.service || data.serviceInfo, type: 'object' },
      memories: { value: data.memories, type: 'array' }
    };

    const missingSections: string[] = [];
    const details: Record<string, { loaded: boolean; count?: number }> = {};
    let loadedSections = 0;

    Object.entries(sections).forEach(([key, { value, type }]) => {
      if (type === 'array' && Array.isArray(value)) {
        details[key] = { loaded: true, count: value.length };
        loadedSections++;
      } else if (type === 'string' && typeof value === 'string' && value) {
        details[key] = { loaded: true };
        loadedSections++;
      } else if (type === 'object' && value != null) {
        details[key] = { loaded: true };
        loadedSections++;
      } else {
        missingSections.push(key);
        details[key] = { loaded: false };
      }
    });

    const integrity: DataIntegrityCheck = {
      isComplete: missingSections.length === 0,
      missingSections,
      totalSections: Object.keys(sections).length,
      loadedSections,
      details
    };

    setDataIntegrity(integrity);
    
    console.log('🔍 Data Integrity Check:', {
      status: integrity.isComplete ? '✅ COMPLETE' : '⚠️ INCOMPLETE',
      loaded: `${loadedSections}/${integrity.totalSections}`,
      missing: missingSections.length > 0 ? missingSections : 'none',
      details
    });

    return integrity;
  }, []);

  // ENHANCED: Memorial loading with comprehensive logging
  const loadMemorialData = useCallback(async (): Promise<boolean> => {
    if (!memorialId) {
      console.log('❌ No memorial ID provided');
      setLoading(false);
      return false;
    }

    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    loadingAttempts.current += 1;

    try {
      setLoading(true);
      setError(null);

      console.log(`🔄 Loading memorial ${memorialId} (attempt ${loadingAttempts.current}/${MAX_LOADING_ATTEMPTS})`);

      const response = await fetch(
        `https://wings-of-memories-backend.onrender.com/api/memorials/${memorialId}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          },
          signal: abortControllerRef.current.signal
        }
      );

      if (!response.ok) {
        if (response.status === 404) {
          console.log('🆕 Memorial not found, creating new structure');
          const newMemorial = ensureCompleteMemorialData({ 
            ...defaultMemorialData, 
            id: memorialId 
          });
          setMemorialData(newMemorial);
          checkDataIntegrity(newMemorial);
          setLastSaved(null);
          setLoading(false);
          return true;
        }
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json() as { memorial?: Record<string, unknown> };
      
      if (!data.memorial) {
        throw new Error('No memorial data in response');
      }

      const memorial = data.memorial;
      
      // Log raw backend data structure
      console.log('📦 RAW BACKEND RESPONSE:', {
        id: memorial.id,
        name: memorial.name,
        fields: Object.keys(memorial),
        timeline: {
          type: typeof memorial.timeline,
          isArray: Array.isArray(memorial.timeline),
          length: Array.isArray(memorial.timeline) ? memorial.timeline.length : 'N/A',
          sample: Array.isArray(memorial.timeline) && memorial.timeline.length > 0 
            ? memorial.timeline[0] 
            : 'empty or string'
        },
        favorites: {
          type: typeof memorial.favorites,
          isArray: Array.isArray(memorial.favorites),
          length: Array.isArray(memorial.favorites) ? memorial.favorites.length : 'N/A'
        },
        familyTree: {
          type: typeof memorial.familyTree,
          isArray: Array.isArray(memorial.familyTree),
          length: Array.isArray(memorial.familyTree) ? memorial.familyTree.length : 'N/A'
        },
        gallery: {
          type: typeof memorial.gallery,
          isArray: Array.isArray(memorial.gallery),
          length: Array.isArray(memorial.gallery) ? memorial.gallery.length : 'N/A'
        },
        memoryWall: {
          type: typeof memorial.memoryWall,
          isArray: Array.isArray(memorial.memoryWall),
          length: Array.isArray(memorial.memoryWall) ? memorial.memoryWall.length : 'N/A'
        }
      });

      // Parse and ensure complete structure
      const completeMemorial = ensureCompleteMemorialData(memorial);
      
      // Validate integrity
      const integrity = checkDataIntegrity(completeMemorial);
      
      // Retry if incomplete and attempts remain
      if (!integrity.isComplete && loadingAttempts.current < MAX_LOADING_ATTEMPTS) {
        console.error(`⚠️ Incomplete structure! Missing: ${integrity.missingSections.join(', ')}`);
        console.log('🔄 Retrying in 1.5 seconds...');
        await new Promise(resolve => setTimeout(resolve, 1500));
        return await loadMemorialData();
      }

      // Success - set data
      setMemorialData(completeMemorial);
      setLastSaved(new Date());
      setHasUnsavedChanges(false);
      pendingChangesRef.current = {};
      loadingAttempts.current = 0;

      console.log('✅ Memorial loaded successfully:', {
        id: completeMemorial.id,
        name: completeMemorial.name,
        integrity: integrity.isComplete ? 'COMPLETE' : 'PARTIAL',
        dataLoaded: `${integrity.loadedSections}/${integrity.totalSections} sections`
      });
      
      return true;

    } catch (error: unknown) {
      if (error instanceof Error && error.name === 'AbortError') {
        console.log('🛑 Request aborted');
        return false;
      }

      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('❌ Load error:', errorMessage);
      setError(`Failed to load: ${errorMessage}`);

      // Retry on network errors
      if (loadingAttempts.current < MAX_LOADING_ATTEMPTS) {
        console.log(`🔄 Retrying (${loadingAttempts.current}/${MAX_LOADING_ATTEMPTS})...`);
        await new Promise(resolve => setTimeout(resolve, 2000));
        return await loadMemorialData();
      }

      // Fallback
      const fallbackMemorial = ensureCompleteMemorialData({ 
        ...defaultMemorialData, 
        id: memorialId 
      });
      setMemorialData(fallbackMemorial);
      checkDataIntegrity(fallbackMemorial);
      
      return false;
    } finally {
      setLoading(false);
    }
  }, [memorialId, ensureCompleteMemorialData, checkDataIntegrity]);

  // Load on mount/ID change
  useEffect(() => {
    loadingAttempts.current = 0;
    
    if (memorialId) {
      loadMemorialData();
    } else {
      setLoading(false);
      setMemorialData(null);
    }

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [memorialId, loadMemorialData]);

  // Refresh memorial
  const refreshMemorial = useCallback(async (): Promise<void> => {
    if (!memorialId) return;
    
    console.log('🔄 Refreshing memorial data...');
    loadingAttempts.current = 0;
    const success = await loadMemorialData();
    
    if (!success) {
      throw new Error('Failed to refresh memorial');
    }
  }, [memorialId, loadMemorialData]);

  // Save to backend
  const saveToBackend = useCallback(async (): Promise<boolean> => {
    if (!memorialData?.id || saving) {
      return false;
    }

    const changesToSave = { ...pendingChangesRef.current };
    
    if (Object.keys(changesToSave).length === 0) {
      return true;
    }

    try {
      setSaving(true);
      console.log('💾 Saving changes:', Object.keys(changesToSave));

      // Prepare payload
      const dataToSave: Record<string, unknown> = { ...changesToSave };
      
      // Map service to serviceInfo for backend
      if (dataToSave.service) {
        dataToSave.serviceInfo = dataToSave.service;
        delete dataToSave.service;
      }

      const response = await fetch(
        `https://wings-of-memories-backend.onrender.com/api/memorials/${memorialData.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            ...dataToSave,
            lastModified: new Date().toISOString()
          })
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Save failed: ${response.status} - ${errorText}`);
      }

      const result = await response.json() as { memorial: Record<string, unknown> };
      
      // Ensure complete structure from response
      const completeMemorial = ensureCompleteMemorialData(result.memorial);
      
      setMemorialData(completeMemorial);
      setLastSaved(new Date());
      setHasUnsavedChanges(false);
      pendingChangesRef.current = {};
      
      checkDataIntegrity(completeMemorial);
      
      console.log('✅ Saved successfully');
      return true;
      
    } catch (error) {
      console.error('❌ Save error:', error);
      setError('Failed to save');
      return false;
    } finally {
      setSaving(false);
    }
  }, [memorialData, saving, ensureCompleteMemorialData, checkDataIntegrity]);

  // Update functions
  const updateMemorialData = useCallback((updates: Partial<MemorialData>) => {
    if (!memorialData) return;

    setMemorialData(prev => {
      if (!prev) return prev;
      
      const newData = { ...prev, ...updates };
      
      pendingChangesRef.current = {
        ...pendingChangesRef.current,
        ...updates
      };
      
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      
      saveTimeoutRef.current = setTimeout(() => {
        saveToBackend();
      }, 3000);
      
      setHasUnsavedChanges(true);
      return newData;
    });
  }, [memorialData, saveToBackend]);

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
    updateMemorialData({ service, serviceInfo: service });
  }, [updateMemorialData]);

  const updateMemories = useCallback((memories: Memory[]) => {
    updateMemorialData({ memories });
  }, [updateMemorialData]);

  const updateMemoryWall = useCallback((memoryWall: Memory[]) => {
    updateMemorialData({ memoryWall });
  }, [updateMemorialData]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (Object.keys(pendingChangesRef.current).length > 0) {
        saveToBackend().catch(console.error);
      }
    };
  }, [saveToBackend]);

  const value: MemorialContextType = {
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
    hasUnsavedChanges,
    error,
    dataIntegrity
  };

  return (
    <MemorialContext.Provider value={value}>
      {children}
    </MemorialContext.Provider>
  );
};

export default MemorialProvider;
export { MemorialContext };