// Components/Dashboard/ProfileSection.tsx - CONTEXT-ONLY VERSION
import React, { useState, useEffect, useCallback } from 'react';
import { Upload, User, MapPin, Calendar, Save, CheckCircle, AlertCircle, Loader, X } from 'lucide-react';
import { useMemorial } from '../../hooks/useMemorial';

interface ProfileData {
  name: string;
  profileImage: string;
  birthDate: string;
  deathDate: string;
  location: string;
  obituary: string;
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
  const { 
    memorialData, 
    updateMemorialData, 
    saveToBackend, 
    saving,
    lastSaved 
  } = useMemorial();
  
  const [profile, setProfile] = useState<ProfileData>({
    name: '',
    profileImage: '',
    birthDate: '',
    deathDate: '',
    location: '',
    obituary: ''
  });
  const [uploading, setUploading] = useState(false);
  const [localSaving, setLocalSaving] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);
  
  const [toasts, setToasts] = useState<Array<{ id: string; message: string; type: 'success' | 'error' | 'info'; }>>([]);

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  // Initialize from context
  useEffect(() => {
    if (memorialData && !hasInitialized) {
      console.log('🚀 Initializing profile from memorial data:', memorialData.id);
      
      const initialProfile = {
        name: memorialData.name || 'Loved One\'s Memorial',
        profileImage: memorialData.profileImage || '',
        birthDate: memorialData.birthDate || '',
        deathDate: memorialData.deathDate || '',
        location: memorialData.location || '',
        obituary: memorialData.obituary || 'This memorial was created to honor and remember a beloved life.'
      };
      
      setProfile(initialProfile);
      setHasInitialized(true);
    }
  }, [memorialData, hasInitialized]);

  // Update profile fields in context
  const updateProfileField = useCallback((field: keyof ProfileData, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }));
    
    // Update context immediately for auto-save
    if (memorialData) {
      updateMemorialData({ [field]: value });
    }
  }, [memorialData, updateMemorialData]);

  // Image upload using context
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = '';

    if (file.size > 5 * 1024 * 1024) {
      showToast('Image size should be less than 5MB', 'error');
      return;
    }

    if (!file.type.startsWith('image/')) {
      showToast('Please upload an image file', 'error');
      return;
    }

    if (!memorialData?.id) {
      showToast('No memorial available', 'error');
      return;
    }

    setUploading(true);
    showToast('Uploading image...', 'info');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Please log in again');
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

      if (!uploadResponse.ok) {
        throw new Error('Upload failed');
      }

      const imageData = await uploadResponse.json();
      
      // Update context with new image URL
      updateMemorialData({ profileImage: imageData.url });
      
      // Update local state
      setProfile(prev => ({ ...prev, profileImage: imageData.url }));
      
      // Context will auto-save, but we can trigger immediate save for better UX
      const success = await saveToBackend();
      
      if (success) {
        showToast('Profile image updated!', 'success');
      } else {
        showToast('Image uploaded but save failed', 'error');
      }
    } catch (error) {
      console.error('❌ Upload failed:', error);
      showToast('Upload failed. Please try again.', 'error');
    } finally {
      setUploading(false);
    }
  };

  // Manual save - triggers context save
  const handleSave = async () => {
    if (!profile.name.trim()) {
      showToast('Please enter a name', 'error');
      return;
    }

    if (!memorialData?.id) {
      showToast('No memorial available', 'error');
      return;
    }

    setLocalSaving(true);
    showToast('Saving profile...', 'info');
    
    try {
      // Update context with current profile data
      updateMemorialData({
        name: profile.name,
        profileImage: profile.profileImage,
        birthDate: profile.birthDate,
        deathDate: profile.deathDate,
        location: profile.location,
        obituary: profile.obituary
      });
      
      // Trigger save via context
      const success = await saveToBackend();
      
      if (success) {
        showToast('Profile saved successfully!', 'success');
      } else {
        throw new Error('Save failed');
      }
    } catch (error) {
      console.error('❌ Save failed:', error);
      showToast('Failed to save. Please try again.', 'error');
    } finally {
      setLocalSaving(false);
    }
  };

  const handleFieldChange = (field: keyof ProfileData, value: string) => {
    updateProfileField(field, value);
  };

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

  // Loading state
  if (!hasInitialized || !memorialData) {
    return (
      <div className="max-w-4xl space-y-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <div className="text-center py-12">
            <Loader className="w-8 h-8 text-amber-500 mx-auto mb-4 animate-spin" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Loading Profile</h3>
            <p className="text-gray-600">Getting your memorial data...</p>
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

      {/* Profile Image Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Profile Image</h2>
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
            {uploading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
                <Loader className="w-8 h-8 text-white animate-spin" />
              </div>
            )}
          </div>
          
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Upload a profile photo
            </label>
            
            <label className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full hover:from-amber-600 hover:to-orange-600 transition-all cursor-pointer disabled:opacity-50 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
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
              Max size: 5MB. Recommended: Square image, at least 400x400 pixels
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
      </div>

      {/* Save Button */}
      <div className="sticky bottom-4 flex justify-between items-center bg-white rounded-2xl shadow-lg border border-gray-200 p-4">
        <div className="text-sm text-gray-600">
          {lastSaved ? (
            <span className="text-green-600">{getLastSavedText()}</span>
          ) : (
            <span className="text-amber-600">Ready to save</span>
          )}
        </div>
        
        <button 
          onClick={handleSave}
          disabled={localSaving || saving || !profile.name.trim()}
          className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full hover:from-amber-600 hover:to-orange-600 transition-all font-medium shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {(localSaving || saving) ? (
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