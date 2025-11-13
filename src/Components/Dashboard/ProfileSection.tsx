// Components/Dashboard/ProfileSection.tsx - IMPROVED with better save handling for Vercel
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Upload, User, MapPin, Calendar, Save, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { useMemorial } from '../../hooks/useMemorial';

interface ProfileData {
  name: string;
  profileImage: string;
  birthDate: string;
  deathDate: string;
  location: string;
  obituary: string;
}

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
  const { memorialData, updateMemorialData, saveToBackend } = useMemorial();
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
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSavedDataRef = useRef<string>('');

  const debouncedProfile = useDebounce(profile, 2000); // Increased debounce to 2s

  // Initialize form with memorial data (only once)
  useEffect(() => {
    if (memorialData && !hasInitialized) {
      const initialProfile = {
        name: memorialData.name || '',
        profileImage: memorialData.profileImage || '',
        birthDate: memorialData.birthDate || '',
        deathDate: memorialData.deathDate || '',
        location: memorialData.location || '',
        obituary: memorialData.obituary || ''
      };
      setProfile(initialProfile);
      lastSavedDataRef.current = JSON.stringify(initialProfile);
      setHasInitialized(true);
      console.log('📝 Profile initialized:', initialProfile);
    }
  }, [memorialData, hasInitialized]);

  // Check if there are actual changes
  const hasChanges = useCallback((currentProfile: ProfileData) => {
    const currentStr = JSON.stringify(currentProfile);
    return currentStr !== lastSavedDataRef.current;
  }, []);

  // Auto-save debounced changes to backend
  useEffect(() => {
    if (!hasInitialized || !debouncedProfile.name.trim()) {
      return;
    }

    if (hasChanges(debouncedProfile)) {
      console.log('💾 Auto-saving profile changes...');
      performAutoSave();
    }
  }, [debouncedProfile, hasInitialized]);

  const performAutoSave = async () => {
    setAutoSaving(true);
    setSaveStatus('saving');

    try {
      // Update local context first
      await updateMemorialData(profile);
      
      // Save to backend (Vercel)
      await saveToBackend();
      
      // Update last saved reference
      lastSavedDataRef.current = JSON.stringify(profile);
      
      setSaveStatus('success');
      setLastSaved(new Date());
      
      console.log('✅ Auto-save successful');
      
      // Clear success status after 3 seconds
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      saveTimeoutRef.current = setTimeout(() => {
        setSaveStatus('idle');
      }, 3000);
      
    } catch (error) {
      console.error('❌ Auto-save failed:', error);
      setSaveStatus('error');
      
      // Clear error status after 5 seconds
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      saveTimeoutRef.current = setTimeout(() => {
        setSaveStatus('idle');
      }, 5000);
    } finally {
      setAutoSaving(false);
    }
  };

  // Manual save with explicit backend call
  const handleSave = async () => {
    if (!profile.name.trim()) {
      alert('Please enter a name for the memorial.');
      return;
    }

    console.log('💾 Manual save triggered with profile:', profile);
    setSaving(true);
    setSaveStatus('saving');
    
    try {
      // Update local context
      await updateMemorialData(profile);
      
      // Explicit backend save
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch(`https://wings-of-memories-backend.onrender.com/api/memorials/${memorialData?.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(profile)
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Save failed: ${response.status} - ${errorData}`);
      }

      const result = await response.json();
      console.log('✅ Manual save successful:', result);
      
      // Update last saved reference
      lastSavedDataRef.current = JSON.stringify(profile);
      
      setSaveStatus('success');
      setLastSaved(new Date());
      alert('✅ Profile saved successfully!');
      
      // Clear success status after 3 seconds
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      saveTimeoutRef.current = setTimeout(() => {
        setSaveStatus('idle');
      }, 3000);
      
    } catch (error) {
      console.error('❌ Manual save failed:', error);
      setSaveStatus('error');
      alert(`Failed to save changes: ${error instanceof Error ? error.message : 'Unknown error'}`);
      
      // Clear error status after 5 seconds
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      saveTimeoutRef.current = setTimeout(() => {
        setSaveStatus('idle');
      }, 5000);
    } finally {
      setSaving(false);
    }
  };

  // Warn about unsaved changes before leaving
  useEffect(() => {
    const hasUnsavedChanges = hasChanges(profile);
    
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges && saveStatus !== 'saving') {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [profile, saveStatus, hasChanges]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    console.log("🖼️ Selected file:", {
      name: file.name,
      size: file.size,
      type: file.type,
    });

    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB');
      return;
    }

    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    setUploading(true);

    try {
      console.log("⬆️ Uploading image to backend...");

      const token = localStorage.getItem('token');
      console.log("🔑 Token present:", !!token);

      if (!token) {
        throw new Error('Authentication token not found. Please log in again.');
      }

      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'memorials/profiles');

      const uploadResponse = await fetch('https://wings-of-memories-backend.onrender.com/api/imagekit/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData,
      });

      console.log("📡 Upload response status:", uploadResponse.status);

      if (!uploadResponse.ok) {
        const errorText = await uploadResponse.text();
        console.error("❌ Upload error response:", errorText);
        
        if (uploadResponse.status === 401 || uploadResponse.status === 403) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          throw new Error('Session expired. Please log in again.');
        }
        
        throw new Error(`Upload failed (${uploadResponse.status}): ${errorText}`);
      }

      const data = await uploadResponse.json();
      console.log("✅ Upload success:", data);

      const newProfile = { ...profile, profileImage: data.url };
      console.log("🧠 Updated profile with new image:", newProfile);

      setProfile(newProfile);
      
      // Immediately save after image upload
      await updateMemorialData(newProfile);
      await saveToBackend();
      
      // Update last saved reference
      lastSavedDataRef.current = JSON.stringify(newProfile);
      
      alert('✅ Image uploaded and saved successfully!');
    } catch (error) {
      console.error('❌ Upload failed:', error);
      alert(`Failed to upload image: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setUploading(false);
      console.log("🏁 Upload process completed.");
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

  // Show loading state while initializing
  if (!hasInitialized && !memorialData) {
    return (
      <div className="max-w-4xl space-y-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <div className="animate-pulse text-center py-8">
            <Loader className="w-8 h-8 text-amber-500 mx-auto mb-4 animate-spin" />
            <p>Loading profile data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-8">
      {/* Save Status Indicator */}
      {saveStatus !== 'idle' && (
        <div className={`fixed top-20 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg transition-all duration-300 ${
          saveStatus === 'saving' ? 'bg-blue-500 text-white' :
          saveStatus === 'success' ? 'bg-green-500 text-white' :
          'bg-red-500 text-white'
        }`}>
          {saveStatus === 'saving' && <Loader className="w-4 h-4 animate-spin" />}
          {saveStatus === 'success' && <CheckCircle className="w-4 h-4" />}
          {saveStatus === 'error' && <AlertCircle className="w-4 h-4" />}
          <span className="font-medium">
            {saveStatus === 'saving' ? 'Saving changes...' :
             saveStatus === 'success' ? 'Changes saved!' :
             'Save failed - try manual save'}
          </span>
        </div>
      )}

      {/* Profile Image */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Profile Image</h2>
          {lastSaved && (
            <span className="text-sm text-gray-500">{getLastSavedText()}</span>
          )}
        </div>
        <div className="flex flex-col md:flex-row gap-8 items-center">
          <div className="relative">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg bg-gray-200">
              {profile.profileImage ? (
                <img 
                  src={profile.profileImage} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <User className="w-16 h-16 text-gray-400" />
                </div>
              )}
            </div>
            {uploading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
                <Loader className="w-8 h-8 text-white animate-spin" />
              </div>
            )}
          </div>
          
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Upload a clear, recent photo
            </label>
            <label className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full hover:from-amber-600 hover:to-orange-600 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
              <Upload className="w-4 h-4" />
              <span>{uploading ? 'Uploading...' : 'Choose Image'}</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                disabled={uploading}
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

      {/* Save Button - Sticky on mobile */}
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
          disabled={saving || !profile.name.trim() || autoSaving}
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