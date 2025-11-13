// Components/Dashboard/ProfileSection.tsx - FIXED (removed unused variable)
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Upload, User, MapPin, Calendar, Save, CheckCircle, AlertCircle, Loader, Sparkles, X } from 'lucide-react';

interface ProfileData {
  name: string;
  profileImage: string;
  birthDate: string;
  deathDate: string;
  location: string;
  obituary: string;
}

interface MemorialData {
  id: string;
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

export const ProfileSection: React.FC = () => {
  const [profile, setProfile] = useState<ProfileData>({
    name: '',
    profileImage: '',
    birthDate: '',
    deathDate: '',
    location: '',
    obituary: ''
  });
  const [currentMemorial, setCurrentMemorial] = useState<MemorialData | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isNewUser, setIsNewUser] = useState(false);
  
  const [toasts, setToasts] = useState<Array<{ id: string; message: string; type: 'success' | 'error' | 'info'; }>>([]);

  const lastSavedDataRef = useRef<string>('');

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

  // GET OR CREATE MEMORIAL - COMPLETELY INDEPENDENT
  const getOrCreateMemorial = useCallback(async (): Promise<MemorialData | null> => {
    const userData = getUserData();
    const token = localStorage.getItem('token');
    
    if (!userData || !token) {
      showToast('Please log in to continue', 'error');
      return null;
    }

    try {
      console.log('🔍 Checking for user memorials...');
      
      // Get user's memorials
      const response = await fetch('https://wings-of-memories-backend.onrender.com/api/memorials', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch memorials: ${response.status}`);
      }

      const data = await response.json();
      console.log('📋 User memorials found:', data.memorials?.length || 0);

      if (data.memorials && data.memorials.length > 0) {
        // Use the first memorial
        const firstMemorial = data.memorials[0];
        console.log('✅ Using existing memorial:', firstMemorial.id);
        
        // Fetch the full memorial data to ensure it exists
        const memorialResponse = await fetch(`https://wings-of-memories-backend.onrender.com/api/memorials/${firstMemorial.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!memorialResponse.ok) {
          console.error('❌ Memorial validation failed');
          // Memorial doesn't exist - create a new one
          return await createNewMemorial(token);
        }

        const memorialData = await memorialResponse.json();
        console.log('🎯 Memorial loaded successfully:', memorialData.memorial.id);
        
        setIsNewUser(false);
        return memorialData.memorial;
      } else {
        // NEW USER - Create first memorial
        console.log('🆕 No memorials found - creating first memorial for new user');
        setIsNewUser(true);
        return await createNewMemorial(token);
      }
    } catch (error) {
      console.error('❌ Error checking memorials:', error);
      showToast(`Failed to load memorials: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error');
      return null;
    }
  }, [getUserData, showToast]);

  // CREATE NEW MEMORIAL
  const createNewMemorial = async (token: string): Promise<MemorialData | null> => {
    try {
      console.log('👶 Creating new memorial...');
      showToast('Creating your memorial...', 'info');

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

      const createResponse = await fetch('https://wings-of-memories-backend.onrender.com/api/memorials', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(memorialData)
      });

      if (!createResponse.ok) {
        const errorText = await createResponse.text();
        throw new Error(`Failed to create memorial: ${createResponse.status} - ${errorText}`);
      }

      const newMemorial = await createResponse.json();
      console.log('🎉 Memorial created successfully:', newMemorial.memorial.id);

      showToast('🎊 Your memorial is ready!', 'success');
      return newMemorial.memorial;
    } catch (error) {
      console.error('❌ Failed to create memorial:', error);
      showToast(`Setup failed: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error');
      return null;
    }
  };

  // SAVE MEMORIAL DATA
  const saveMemorialData = async (profileData: ProfileData): Promise<boolean> => {
    if (!currentMemorial?.id) {
      showToast('No memorial available to save', 'error');
      return false;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      showToast('Please log in again', 'error');
      return false;
    }

    try {
      console.log('💾 Saving memorial data:', currentMemorial.id);
      
      const updateResponse = await fetch(`https://wings-of-memories-backend.onrender.com/api/memorials/${currentMemorial.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(profileData)
      });

      if (!updateResponse.ok) {
        const errorText = await updateResponse.text();
        throw new Error(`Failed to save: ${errorText}`);
      }

      // FIX: Remove the unused variable assignment
      await updateResponse.json(); // Just parse the response without assigning to a variable
      
      console.log('✅ Memorial saved successfully');
      
      setLastSaved(new Date());
      return true;
    } catch (error) {
      console.error('❌ Save failed:', error);
      throw error;
    }
  };

  // INITIALIZE COMPONENT
  useEffect(() => {
    const initialize = async () => {
      setLoading(true);
      console.log('🚀 Initializing profile section...');

      const memorial = await getOrCreateMemorial();
      
      if (memorial) {
        console.log('📝 Setting up profile with memorial:', memorial.id);
        setCurrentMemorial(memorial);
        
        const initialProfile = {
          name: memorial.name || 'Loved One\'s Memorial',
          profileImage: memorial.profileImage || '',
          birthDate: memorial.birthDate || '',
          deathDate: memorial.deathDate || '',
          location: memorial.location || '',
          obituary: memorial.obituary || ''
        };
        
        setProfile(initialProfile);
        lastSavedDataRef.current = JSON.stringify(initialProfile);
      }
      
      setLoading(false);
    };

    initialize();
  }, [getOrCreateMemorial]);

  // IMAGE UPLOAD
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

    if (!currentMemorial?.id) {
      showToast('No memorial available', 'error');
      return;
    }

    setUploading(true);
    showToast('Uploading image...', 'info');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Please log in again to upload images');
      }

      console.log("🖼️ Uploading image for memorial:", currentMemorial.id);

      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'memorials/profiles');

      // Upload image to ImageKit
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

      // Update profile with new image
      const newProfile = { ...profile, profileImage: imageData.url };
      setProfile(newProfile);
      
      // Save to backend
      await saveMemorialData(newProfile);
      
      lastSavedDataRef.current = JSON.stringify(newProfile);
      
      showToast('🎉 Profile image updated successfully!', 'success');

    } catch (error) {
      console.error('❌ Upload process failed:', error);
      showToast(`Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error');
    } finally {
      setUploading(false);
    }
  };

  // MANUAL SAVE
  const handleSave = async () => {
    if (!profile.name.trim()) {
      showToast('Please enter a name for the memorial', 'error');
      return;
    }

    if (!currentMemorial?.id) {
      showToast('No memorial available', 'error');
      return;
    }

    console.log('💾 Manual save triggered');
    setSaving(true);
    
    try {
      await saveMemorialData(profile);
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

  // Show loading state
  if (loading) {
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

  // Show error state if no memorial
  if (!currentMemorial) {
    return (
      <div className="max-w-4xl space-y-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <div className="text-center py-12">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Unable to Load Memorial</h3>
            <p className="text-gray-600 mb-4">There was a problem setting up your memorial.</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
            >
              Try Again
            </button>
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
      <div className="bg-green-50 border border-green-200 rounded-xl p-4">
        <div className="flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-green-500" />
          <div>
            <h3 className="text-green-800 font-medium">Memorial Ready</h3>
            <p className="text-green-600 text-sm">
              Editing: <strong>{currentMemorial.name || 'Your Memorial'}</strong>
              {currentMemorial.id && (
                <span className="ml-2 text-green-500">ID: {currentMemorial.id.substring(0, 8)}...</span>
              )}
            </p>
          </div>
        </div>
      </div>

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

      {/* Save Button */}
      <div className="sticky bottom-4 flex justify-between items-center bg-white rounded-2xl shadow-lg border border-gray-200 p-4">
        <div className="text-sm text-gray-600">
          {lastSaved ? (
            <span className="text-green-600">{getLastSavedText()}</span>
          ) : (
            <span className="text-amber-600">Unsaved changes</span>
          )}
        </div>
        
        <button 
          onClick={handleSave}
          disabled={saving || !profile.name.trim()}
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