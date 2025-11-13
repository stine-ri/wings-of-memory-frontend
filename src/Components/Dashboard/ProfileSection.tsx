// Components/Dashboard/ProfileSection.tsx - FIXED FOR NEW USERS
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Upload, User, MapPin, Calendar, Save, CheckCircle, AlertCircle, Loader, Sparkles, X } from 'lucide-react';
import { useMemorial } from '../../hooks/useMemorial';

interface ProfileData {
  name: string;
  profileImage: string;
  birthDate: string;
  deathDate: string;
  location: string;
  obituary: string;
}

interface UserData {
  id: string;
  email: string;
  name: string;
}

// Toast notification component
const Toast: React.FC<{
  message: string;
  type: 'success' | 'error' | 'info';
  onClose: () => void;
  duration?: number;
}> = ({ message, type, onClose, duration = 5000 }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const getStyles = () => {
    switch (type) {
      case 'success': return 'bg-green-500 text-white border-green-600';
      case 'error': return 'bg-red-500 text-white border-red-600';
      case 'info': return 'bg-blue-500 text-white border-blue-600';
      default: return 'bg-gray-500 text-white border-gray-600';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success': return <CheckCircle className="w-5 h-5" />;
      case 'error': return <AlertCircle className="w-5 h-5" />;
      case 'info': return <Loader className="w-5 h-5 animate-spin" />;
      default: return null;
    }
  };

  return (
    <div className={`fixed top-20 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border transform transition-all duration-300 animate-in slide-in-from-right-8 ${getStyles()}`}>
      {getIcon()}
      <span className="font-medium text-sm">{message}</span>
      <button onClick={onClose} className="ml-2 hover:bg-white hover:bg-opacity-20 rounded-full p-1 transition-colors">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

// Debounce hook
const useDebounce = <T,>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

export const ProfileSection: React.FC = () => {
  const { memorialData, updateMemorialData, saveToBackend, refreshMemorial } = useMemorial();
  const [hasInitialized, setHasInitialized] = useState(false);
  const [profile, setProfile] = useState<ProfileData>({
    name: '',
    profileImage: '',
    birthDate: '',
    deathDate: '',
    location: '',
    obituary: ''
  });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [autoSaving, setAutoSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [creatingMemorial, setCreatingMemorial] = useState(false);
  const [isNewUser, setIsNewUser] = useState(true); // Default to true for new users
  
  const [toasts, setToasts] = useState<Array<{ id: string; message: string; type: 'success' | 'error' | 'info'; }>>([]);

  const lastSavedDataRef = useRef<string>('');

  const debouncedProfile = useDebounce(profile, 2000);

  // Toast management
  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  // Get user data from localStorage
  const getUserData = useCallback((): UserData | null => {
    try {
      const userStr = localStorage.getItem('user');
      const token = localStorage.getItem('token');
      
      if (!userStr || !token) {
        console.log('🔐 No user data or token found in localStorage');
        return null;
      }

      return JSON.parse(userStr);
    } catch (error) {
      console.error('❌ Error parsing user data:', error);
      return null;
    }
  }, []);

  // CREATE MEMORIAL FOR NEW USER - SIMPLIFIED AND ROBUST
const createMemorialForNewUser = useCallback(async (): Promise<boolean> => {
  const userData = getUserData();
  const token = localStorage.getItem('token');
  
  if (!userData || !token) {
    showToast('Please log in to continue', 'error');
    return false;
  }

  try {
    console.log('👶 Creating first memorial for new user...');
    setCreatingMemorial(true);
    setIsNewUser(true);
    showToast('Creating your first memorial...', 'info');

    // Simple memorial data for new users
    const memorialData = {
      name: 'Loved One\'s Memorial',
      profileImage: '',
      birthDate: '',
      deathDate: '',
      location: '',
      obituary: 'This memorial was created to honor and remember a beloved life. You can edit this text to share their story, achievements, and the impact they had on those around them.',
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
    };

    console.log('📤 Sending memorial creation request...');
    const createResponse = await fetch('https://wings-of-memories-backend.onrender.com/api/memorials', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(memorialData)
    });

    console.log('📥 Memorial creation response status:', createResponse.status);

    if (!createResponse.ok) {
      const errorText = await createResponse.text();
      console.error('❌ Memorial creation failed:', createResponse.status, errorText);
      throw new Error(`Failed to create memorial: ${createResponse.status} - ${errorText}`);
    }

    const newMemorial = await createResponse.json();
    console.log('🎉 Memorial created successfully:', newMemorial);

    if (!newMemorial.memorial || !newMemorial.memorial.id) {
      throw new Error('Invalid memorial response - missing memorial data');
    }

    // CRITICAL FIX: Force refresh the memorial context with the NEW ID
    console.log('🔄 Forcing memorial context refresh with new ID:', newMemorial.memorial.id);
    
    if (refreshMemorial) {
      // Force a complete refresh of the memorial context
      await refreshMemorial();
    }

    // Wait a bit for context to update
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Set up initial profile data
    const initialProfile = {
      name: newMemorial.memorial.name || 'Loved One\'s Memorial',
      profileImage: newMemorial.memorial.profileImage || '',
      birthDate: newMemorial.memorial.birthDate || '',
      deathDate: newMemorial.memorial.deathDate || '',
      location: newMemorial.memorial.location || '',
      obituary: newMemorial.memorial.obituary || ''
    };
    
    setProfile(initialProfile);
    lastSavedDataRef.current = JSON.stringify(initialProfile);
    
    // Update memorial context with the NEW memorial data
    if (updateMemorialData) {
      console.log('📝 Updating memorial context with new memorial data');
      await updateMemorialData({
        ...initialProfile,
        id: newMemorial.memorial.id
      });
    }
    
    showToast('🎊 Your memorial is ready! Start personalizing it.', 'success');
    
    return true;
  } catch (error) {
    console.error('❌ Failed to create memorial:', error);
    showToast(`Setup failed: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error');
    return false;
  } finally {
    setCreatingMemorial(false);
  }
}, [getUserData, showToast, updateMemorialData, refreshMemorial]);

  // CHECK IF USER HAS MEMORIALS - SIMPLIFIED
  const checkUserMemorials = useCallback(async (): Promise<boolean> => {
    const userData = getUserData();
    const token = localStorage.getItem('token');
    
    if (!userData || !token) {
      return false;
    }

    try {
      console.log('🔍 Checking if user has memorials...');
      const response = await fetch('https://wings-of-memories-backend.onrender.com/api/memorials', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        console.log('❌ Failed to check memorials, assuming new user');
        return false;
      }

      const data = await response.json();
      const hasMemorials = data.memorials && data.memorials.length > 0;
      
      console.log('📋 User memorial status:', hasMemorials ? 'Has memorials' : 'New user');
      return hasMemorials;
    } catch (error) {
      console.error('❌ Error checking memorials:', error);
      return false;
    }
  }, [getUserData]);

  // INITIALIZE FOR NEW USER - SIMPLIFIED
  const initializeForNewUser = useCallback(async () => {
    console.log('🚀 Initializing for new user...');
    
    const userData = getUserData();
    if (!userData) {
      showToast('Please log in to continue', 'error');
      return;
    }

    // Check if user already has memorials
    const hasMemorials = await checkUserMemorials();
    
    if (hasMemorials) {
      console.log('✅ User has existing memorials');
      setIsNewUser(false);
      
      // Let the existing logic handle loading memorials
      if (refreshMemorial) {
        await refreshMemorial();
      }
    } else {
      console.log('🆕 New user detected - creating first memorial');
      // Create first memorial for new user
      await createMemorialForNewUser();
    }
    
    setHasInitialized(true);
  }, [getUserData, checkUserMemorials, createMemorialForNewUser, refreshMemorial, showToast]);

  // Check if there are actual changes
  const hasChanges = useCallback((currentProfile: ProfileData) => {
    const currentStr = JSON.stringify(currentProfile);
    return currentStr !== lastSavedDataRef.current;
  }, []);

  // Auto-save function
  const performAutoSave = useCallback(async () => {
    if (!memorialData?.id) {
      console.log('⏸️ Skipping auto-save: No memorial ID');
      return;
    }

    setAutoSaving(true);

    try {
      // Update local context first
      await updateMemorialData(profile);
      
      // Save to backend
      await saveToBackend();
      
      // Update last saved reference
      lastSavedDataRef.current = JSON.stringify(profile);
      
      setLastSaved(new Date());
      
      console.log('✅ Auto-save successful');
      
      // Show success toast for auto-save (shorter duration)
      showToast('Changes saved automatically', 'success');
      
    } catch (error) {
      console.error('❌ Auto-save failed:', error);
      
      // Show error toast
      showToast('Auto-save failed - changes not saved', 'error');
    } finally {
      setAutoSaving(false);
    }
  }, [memorialData?.id, updateMemorialData, profile, saveToBackend, showToast]);

  // Auto-save debounced changes to backend
  useEffect(() => {
    if (!hasInitialized || !debouncedProfile.name.trim() || !memorialData?.id) {
      return;
    }

    if (hasChanges(debouncedProfile)) {
      console.log('💾 Auto-saving profile changes...');
      performAutoSave();
    }
  }, [debouncedProfile, hasInitialized, memorialData?.id, hasChanges, performAutoSave]);

  // INITIALIZE COMPONENT - NEW USER FOCUSED
  useEffect(() => {
    const initialize = async () => {
      if (!hasInitialized && !creatingMemorial) {
        console.log('🔄 Initializing profile section...');
        await initializeForNewUser();
      }
    };

    initialize();
  }, [hasInitialized, creatingMemorial, initializeForNewUser]);

  // Update profile when memorial data loads
useEffect(() => {
  if (memorialData && memorialData.id && !hasInitialized) {
    console.log('📝 Loading profile from memorial data:', memorialData.id);
    
    // Verify this is a DIFFERENT memorial ID than before
    if (profile.name === '' || memorialData.id !== lastSavedDataRef.current) {
      const initialProfile = {
        name: memorialData.name || 'Loved One\'s Memorial',
        profileImage: memorialData.profileImage || '',
        birthDate: memorialData.birthDate || '',
        deathDate: memorialData.deathDate || '',
        location: memorialData.location || '',
        obituary: memorialData.obituary || ''
      };
      setProfile(initialProfile);
      lastSavedDataRef.current = JSON.stringify(initialProfile);
      setHasInitialized(true);
      console.log('✅ Profile initialized with memorial ID:', memorialData.id);
    }
  }
}, [memorialData, hasInitialized]);

// Debug memorial ID synchronization
useEffect(() => {
  console.log('🔍 MEMORIAL ID SYNC DEBUG:', {
    currentMemorialId: memorialData?.id,
    hasInitialized,
    profileName: profile.name,
    creatingMemorial
  });
}, [memorialData?.id, hasInitialized, profile.name, creatingMemorial]);

  // SIMPLIFIED IMAGE UPLOAD FOR NEW USERS
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;
  e.target.value = '';

  // Validation
  if (file.size > 5 * 1024 * 1024) {
    showToast('Image size should be less than 5MB', 'error');
    return;
  }

  if (!file.type.startsWith('image/')) {
    showToast('Please upload an image file (JPEG, PNG, etc.)', 'error');
    return;
  }

  // CRITICAL: Ensure we have the CORRECT memorial ID
  const currentMemorialId = memorialData?.id;
  if (!currentMemorialId) {
    showToast('Please wait, memorial is being created...', 'info');
    return;
  }

  console.log('🖼️ Uploading image for memorial:', currentMemorialId);

  setUploading(true);
  showToast('Uploading image...', 'info');

  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Please log in again to upload images');
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', 'memorials/profiles');

    // Step 1: Upload image to ImageKit
    const uploadResponse = await fetch('https://wings-of-memories-backend.onrender.com/api/imagekit/upload', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData,
    });

    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text();
      throw new Error(`Upload failed: ${errorText}`);
    }

    const imageData = await uploadResponse.json();
    console.log("✅ Image upload successful:", imageData);

    // Step 2: Update profile with new image
    const newProfile = { ...profile, profileImage: imageData.url };
    setProfile(newProfile);
    
    // Update memorial data with current memorial ID
    if (updateMemorialData) {
      await updateMemorialData(newProfile);
    }
    
    // Save to backend
    await saveToBackend();
    
    // Update last saved reference
    lastSavedDataRef.current = JSON.stringify(newProfile);
    
    showToast('🎉 Profile image updated successfully!', 'success');

  } catch (error) {
    console.error('❌ Upload process failed:', error);
    showToast(`Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error');
  } finally {
    setUploading(false);
  }
};

  // Manual save
  const handleSave = async () => {
    if (!profile.name.trim()) {
      showToast('Please enter a name for the memorial', 'error');
      return;
    }

    if (!memorialData?.id) {
      showToast('Memorial not ready yet. Please wait...', 'error');
      return;
    }

    console.log('💾 Manual save triggered');
    setSaving(true);
    
    try {
      // Update local context
      await updateMemorialData(profile);
      
      // Save to backend
      await saveToBackend();
      
      // Update last saved reference
      lastSavedDataRef.current = JSON.stringify(profile);
      
      setLastSaved(new Date());
      
      showToast('Profile saved successfully!', 'success');
      
    } catch (error) {
      console.error('❌ Manual save failed:', error);
      showToast(`Failed to save: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleFieldChange = (field: keyof ProfileData, value: string) => {
    const newProfile = { ...profile, [field]: value };
    setProfile(newProfile);
  };

  // Format last saved time
  const getLastSavedText = () => {
    if (!lastSaved) return '';
    
    const now = new Date();
    const diffMs = now.getTime() - lastSaved.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Saved just now';
    if (diffMins === 1) return 'Saved 1 minute ago';
    if (diffMins < 60) return `Saved ${diffMins} minutes ago`;
    
    return `Saved at ${lastSaved.toLocaleTimeString()}`;
  };

  // NEW USER WELCOME COMPONENT
  const NewUserWelcome = () => (
    <div className="bg-gradient-to-r from-amber-400 to-orange-400 rounded-2xl shadow-lg p-6 text-white mb-6">
      <div className="flex items-center gap-4">
        <div className="bg-white bg-opacity-20 rounded-full p-3">
          <Sparkles className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold mb-1">Welcome to Wings of Memories! 🎉</h3>
          <p className="text-amber-100 text-sm">
            We've created your first memorial. Start by adding a profile image and filling in the basic information to personalize this tribute.
          </p>
        </div>
      </div>
    </div>
  );

  // Show loading state for new users
  if (creatingMemorial) {
    return (
      <div className="max-w-4xl space-y-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <div className="text-center py-12">
            <div className="animate-bounce mb-4">
              <Sparkles className="w-12 h-12 text-amber-500 mx-auto" />
            </div>
            <Loader className="w-8 h-8 text-amber-500 mx-auto mb-4 animate-spin" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Creating Your Memorial</h3>
            <p className="text-gray-600">Setting everything up for you...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show loading while initializing
  if (!hasInitialized) {
    return (
      <div className="max-w-4xl space-y-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <div className="text-center py-12">
            <Loader className="w-8 h-8 text-amber-500 mx-auto mb-4 animate-spin" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Setting Up Your Memorial</h3>
            <p className="text-gray-600">Getting everything ready...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-8">
      {/* Toast Notifications */}
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => removeToast(toast.id)}
        />
      ))}

      {/* New User Welcome Banner */}
      {isNewUser && <NewUserWelcome />}

      {/* Memorial Status */}
      {memorialData && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <div>
              <h3 className="text-green-800 font-medium">Memorial Ready</h3>
              <p className="text-green-600 text-sm">
                Editing: <strong>{memorialData.name || 'Your Memorial'}</strong>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Profile Image Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Profile Image</h2>
            {isNewUser && (
              <p className="text-sm text-amber-600 mt-1">
                💡 Start by adding a profile photo
              </p>
            )}
          </div>
          {lastSaved && (
            <span className="text-sm text-gray-500">{getLastSavedText()}</span>
          )}
        </div>
        
        <div className="flex flex-col md:flex-row gap-8 items-center">
          <div className="relative">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg bg-gray-100">
              {profile.profileImage ? (
                <img 
                  src={profile.profileImage} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300">
                  <User className="w-16 h-16 text-gray-400" />
                </div>
              )}
            </div>
            {isNewUser && !profile.profileImage && (
              <div className="absolute -top-2 -right-2 bg-amber-500 text-white rounded-full px-2 py-1 text-xs font-medium animate-pulse">
                Start here
              </div>
            )}
            {uploading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
                <Loader className="w-8 h-8 text-white animate-spin" />
              </div>
            )}
          </div>
          
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-4">
              {isNewUser ? "Add a profile photo to personalize the memorial" : "Upload a clear, recent photo"}
            </label>
            
            <label className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full hover:from-amber-600 hover:to-orange-600 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
              <Upload className="w-4 h-4" />
              <span>{uploading ? 'Uploading...' : 'Choose Image'}</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                disabled={uploading || !memorialData?.id}
              />
            </label>
            
            <p className="text-sm text-gray-500 mt-2">
              Recommended: Square image, at least 400x400 pixels. Max size: 5MB
            </p>
          </div>
        </div>
      </div>

      {/* Basic Information */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Basic Information</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
            <input
              type="text"
              value={profile.name}
              onChange={(e) => handleFieldChange('name', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400"
              placeholder="Enter full name"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={profile.location}
                onChange={(e) => handleFieldChange('location', e.target.value)}
                className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400"
                placeholder="City, State"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Birth Date</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="date"
                value={profile.birthDate}
                onChange={(e) => handleFieldChange('birthDate', e.target.value)}
                className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Death Date</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="date"
                value={profile.deathDate}
                onChange={(e) => handleFieldChange('deathDate', e.target.value)}
                className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Obituary */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Obituary</h2>
        <textarea
          value={profile.obituary}
          onChange={(e) => handleFieldChange('obituary', e.target.value)}
          rows={12}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none"
          placeholder="Write a beautiful tribute..."
        />
        <p className="text-sm text-gray-500 mt-2">
          Tip: Use double line breaks to create paragraphs. The first letter will be styled as a drop cap.
        </p>
      </div>

      {/* Save Button */}
      <div className="sticky bottom-4 flex justify-between items-center bg-white rounded-2xl shadow-lg border border-gray-200 p-4">
        <div className="text-sm text-gray-600">
          {autoSaving ? (
            <span className="flex items-center gap-2">
              <Loader className="w-4 h-4 animate-spin" />
              Auto-saving...
            </span>
          ) : hasChanges(profile) ? (
            <span className="text-amber-600">Unsaved changes</span>
          ) : lastSaved ? (
            <span className="text-green-600">{getLastSavedText()}</span>
          ) : null}
        </div>
        
        <button 
          onClick={handleSave}
          disabled={saving || !profile.name.trim() || autoSaving || !memorialData?.id}
          className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full hover:from-amber-600 hover:to-orange-600 transition-all font-medium shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? (
            <>
              <Loader className="w-4 h-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Save Changes
            </>
          )}
        </button>
      </div>
    </div>
  );
};