// Components/Dashboard/ProfileSection.tsx 
import React, { useState, useEffect, useCallback } from 'react';
import { Upload, User, MapPin, Calendar, Save } from 'lucide-react';
import { useMemorial } from '../../hooks/useMemorial';

interface ProfileData {
  name: string;
  profileImage: string;
  birthDate: string;
  deathDate: string;
  location: string;
  obituary: string;
}

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
  const [lastSavedProfile, setLastSavedProfile] = useState<ProfileData | null>(null);

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
      setLastSavedProfile(initialProfile);
      setHasInitialized(true);
    }
  }, [memorialData, hasInitialized]);

  // Only update memorial data when there are actual changes
  const hasChanges = useCallback((currentProfile: ProfileData, savedProfile: ProfileData | null) => {
    if (!savedProfile) return true;
    return JSON.stringify(currentProfile) !== JSON.stringify(savedProfile);
  }, []);

  // Manual save with proper change detection
  const handleSave = async () => {
    if (!profile.name.trim()) {
      alert('Please enter a name for the memorial.');
      return;
    }

    if (!hasChanges(profile, lastSavedProfile)) {
      console.log('🔄 No changes to save');
      return;
    }

    setSaving(true);
    try {
      console.log('💾 Manually saving profile changes...');
      await updateMemorialData(profile);
      await saveToBackend();
      setLastSavedProfile(profile);
      console.log('✅ Profile saved successfully!');
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Failed to save changes. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // Optimized field change handler - batches changes
  const handleFieldChange = (field: keyof ProfileData, value: string) => {
    const newProfile = { ...profile, [field]: value };
    setProfile(newProfile);
    
    // Only trigger update if we have actual changes from last saved state
    if (hasInitialized && lastSavedProfile && hasChanges(newProfile, lastSavedProfile)) {
      console.log(`📝 Field changed: ${field}`, { 
        from: lastSavedProfile[field], 
        to: value 
      });
      
      // Use setTimeout to batch rapid changes
      setTimeout(() => {
        updateMemorialData(newProfile);
      }, 100);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

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
      const token = localStorage.getItem('token');
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

      if (!uploadResponse.ok) {
        const errorText = await uploadResponse.text();
        if (uploadResponse.status === 401 || uploadResponse.status === 403) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          throw new Error('Session expired. Please log in again.');
        }
        throw new Error(`Upload failed (${uploadResponse.status}): ${errorText}`);
      }

      const data = await uploadResponse.json();
      const newProfile = { ...profile, profileImage: data.url };
      setProfile(newProfile);
      
      // Immediately update memorial data for image changes
      await updateMemorialData(newProfile);
      
      alert('✅ Image uploaded successfully!');
    } catch (error) {
      console.error('❌ Upload failed:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  // Show loading state while initializing
  if (!hasInitialized && !memorialData) {
    return (
      <div className="max-w-4xl space-y-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <div className="animate-pulse text-center py-8">Loading profile data...</div>
        </div>
      </div>
    );
  }

  const hasUnsavedChanges = hasChanges(profile, lastSavedProfile);

  return (
    <div className="max-w-4xl space-y-8">
      {/* Profile Image */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Profile Image</h2>
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
          </div>
          
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Upload a clear, recent photo
            </label>
            <label className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full hover:from-amber-600 hover:to-orange-600 transition-all cursor-pointer">
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
      <div className="flex justify-between items-center">
        {hasUnsavedChanges && (
          <div className="text-amber-600 text-sm">
            ⚠️ You have unsaved changes
          </div>
        )}
        <button 
          onClick={handleSave}
          disabled={saving || !profile.name.trim() || !hasUnsavedChanges}
          className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full hover:from-amber-600 hover:to-orange-600 transition-all font-medium shadow-lg disabled:opacity-50 disabled:cursor-not-allowed ml-auto"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
};