import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Trash2, Edit2, Upload, Save, Play, ChevronLeft, ChevronRight, X, AlertCircle } from 'lucide-react';
import { useMemorial } from '../../hooks/useMemorial';

interface GalleryImage {
  id: string;
  url: string;
  category: string;
  caption: string;
  uploadedAt: string;
}

// Debounce hook for auto-saving
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

export const GallerySection: React.FC = () => {
  const { memorialData, updateGallery, saveToBackend } = useMemorial();
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [editingImage, setEditingImage] = useState<GalleryImage | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [slideshowOpen, setSlideshowOpen] = useState(false);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [hasInitialized, setHasInitialized] = useState(false);
  const [lastSavedImages, setLastSavedImages] = useState<GalleryImage[] | null>(null);
  const [lastSavedCount, setLastSavedCount] = useState(0);
  const [lastForceSaveTime, setLastForceSaveTime] = useState<number>(0);

  const debouncedImages = useDebounce(images, 2000);

  // ENHANCED: Initialize with memorial data from backend (only once)
  useEffect(() => {
    if (memorialData?.gallery && !hasInitialized) {
      console.log('🔄 INITIALIZING gallery from backend:', {
        type: typeof memorialData.gallery,
        isArray: Array.isArray(memorialData.gallery),
        length: Array.isArray(memorialData.gallery) ? memorialData.gallery.length : 'N/A'
      });

      const initialImages = memorialData.gallery as GalleryImage[];
      console.log('✅ Setting initial images:', initialImages.length);
      setImages(initialImages);
      setLastSavedImages(initialImages);
      setLastSavedCount(initialImages.length);
      setHasInitialized(true);
    }
    
    // CRITICAL: Sync with backend after successful saves
    if (hasInitialized && memorialData?.gallery) {
      const backendImages = memorialData.gallery as GalleryImage[];
      const backendCount = backendImages.length;
      
      // Only update if backend has MORE images than we last saved (meaning save was successful)
      if (backendCount > lastSavedCount || (backendCount > 0 && lastSavedCount === 0)) {
        console.log('🔄 Syncing with backend:', backendCount, 'images');
        setImages(backendImages);
        setLastSavedImages(backendImages);
        setLastSavedCount(backendCount);
      }
    }
  }, [memorialData, hasInitialized, lastSavedCount]);

  // Stable comparison function - only triggers on meaningful changes
  const hasMeaningfulChanges = useCallback((currentImages: GalleryImage[], savedImages: GalleryImage[] | null) => {
    if (!savedImages) return currentImages.length > 0;
    const hasChanges = JSON.stringify(currentImages) !== JSON.stringify(savedImages);
    if (hasChanges) {
      console.log('🔔 Change detected:', currentImages.length, 'vs', savedImages.length);
    }
    return hasChanges;
  }, []);

  // ENHANCED: Auto-save debounced changes with logging
  useEffect(() => {
    if (!hasInitialized) {
      console.log('⏸️ Skipping auto-save: not initialized');
      return;
    }

    // CRITICAL: Block all auto-saves for 5 seconds after a force-save
    const timeSinceLastForceSave = Date.now() - lastForceSaveTime;
    if (lastForceSaveTime > 0 && timeSinceLastForceSave < 5000) {
      console.log('⏸️ Skipping auto-save: force-save completed', Math.round(timeSinceLastForceSave / 1000), 'seconds ago');
      return;
    }

    if (!hasMeaningfulChanges(debouncedImages, lastSavedImages)) {
      console.log('⏸️ Skipping auto-save: no changes');
      return;
    }

    console.log('🚀 AUTO-SAVE TRIGGERED:', debouncedImages.length, 'images');
    updateGallery(debouncedImages);
  }, [debouncedImages, hasInitialized, lastSavedImages, lastForceSaveTime, hasMeaningfulChanges, updateGallery]);

  const categories = [
    'Portraits',
    'Family Activities', 
    'Loving Couple',
    'Childhood',
    'Vacations',
    'Celebrations',
    'Other'
  ];

  const handleAddImage = () => {
    console.log('➕ Opening add image form');
    setEditingImage({
      id: 'new-' + Date.now(),
      url: '',
      category: 'Portraits',
      caption: '',
      uploadedAt: new Date().toISOString().split('T')[0]
    });
    setShowForm(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingImage) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB');
      return;
    }

    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    console.log('📤 Uploading image:', file.name);
    setUploading(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token not found. Please log in again.');
      }

      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'memorials/gallery');

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

      const data = await uploadResponse.json();
      console.log('✅ Image uploaded successfully');
      setEditingImage(prev => prev ? { ...prev, url: data.url } : null);
    } catch (error) {
      console.error('❌ Upload failed:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  // CRITICAL FIX: Force immediate save after adding/editing
  const handleSaveImage = async () => {
    if (!editingImage || !editingImage.caption.trim()) {
      alert('Please enter a caption for the image.');
      return;
    }

    if (!editingImage.url) {
      alert('Please upload an image.');
      return;
    }

    console.log('💾 SAVING IMAGE:', editingImage.caption);

    let newImages: GalleryImage[];
    if (editingImage.id.startsWith('new-')) {
      newImages = [...images, { 
        ...editingImage, 
        id: Date.now().toString(),
        category: editingImage.category,
        caption: editingImage.caption.trim()
      }];
      console.log('➕ Adding new image, total:', newImages.length);
    } else {
      newImages = images.map(img => 
        img.id === editingImage.id 
          ? { 
              ...editingImage, 
              category: editingImage.category,
              caption: editingImage.caption.trim()
            } 
          : img
      );
      console.log('✏️ Updating existing image');
    }
    
    setImages(newImages);
    setShowForm(false);
    setEditingImage(null);

    // CRITICAL: Force immediate save to backend
    setSaving(true);
    setSaveSuccess(false);
    setSaveError(null);

    try {
      console.log('🚀 FORCE SAVING to backend...', newImages.length, 'images');
      await updateGallery(newImages);
      console.log('✅ Context updated');
      
      const success = await saveToBackend();
      console.log('💾 Backend save result:', success);
      
      if (success) {
        console.log('✅ BACKEND SAVE SUCCESSFUL');
        setLastSavedImages(newImages);
        setLastSavedCount(newImages.length);
        setSaveSuccess(true);
        setLastForceSaveTime(Date.now()); // CRITICAL: Block auto-saves for 5 seconds
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        throw new Error('Save returned false');
      }
    } catch (error) {
      console.error('❌ SAVE FAILED:', error);
      setSaveError(error instanceof Error ? error.message : 'Save failed');
      alert('Failed to save image. Please try the manual save button.');
    } finally {
      setSaving(false);
    }
  };

  // CRITICAL FIX: Force immediate save after deleting
  const handleDeleteImage = async (id: string) => {
    console.log('🗑️ DELETING IMAGE:', id);
    
    const newImages = images.filter(img => img.id !== id);
    console.log('📊 After deletion:', newImages.length, 'images remain');
    
    setImages(newImages);

    // Force immediate save
    setSaving(true);
    setSaveSuccess(false);
    setSaveError(null);

    try {
      console.log('🚀 FORCE SAVING deletion to backend...');
      await updateGallery(newImages);
      const success = await saveToBackend();
      
      if (success) {
        console.log('✅ DELETION SAVED SUCCESSFULLY');
        setLastSavedImages(newImages);
        setLastSavedCount(newImages.length);
        setSaveSuccess(true);
        setLastForceSaveTime(Date.now()); // CRITICAL: Block auto-saves for 5 seconds
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        throw new Error('Save returned false');
      }
    } catch (error) {
      console.error('❌ DELETE SAVE FAILED:', error);
      setSaveError(error instanceof Error ? error.message : 'Delete save failed');
      alert('Failed to save deletion. Please try the manual save button.');
    } finally {
      setSaving(false);
    }
  };

  // ENHANCED: Manual save with detailed logging
  const handleManualSave = async () => {
    console.log('🔘 MANUAL SAVE TRIGGERED');
    console.log('📊 Current state:', images.length, 'images');

    setSaving(true);
    setSaveSuccess(false);
    setSaveError(null);

    try {
      console.log('📤 Sending to backend:', images.length, 'images');
      await updateGallery(images);
      console.log('✅ Context updated');
      
      const success = await saveToBackend();
      console.log('💾 Backend save result:', success);
      
      if (success) {
        setLastSavedImages(images);
        setLastSavedCount(images.length);
        setSaveSuccess(true);
        setLastForceSaveTime(Date.now()); // CRITICAL: Block auto-saves for 5 seconds
        alert('Gallery saved successfully!');
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        throw new Error('Backend save failed');
      }
    } catch (error) {
      console.error('❌ Manual save error:', error);
      setSaveError(error instanceof Error ? error.message : 'Save failed');
      alert('Failed to save gallery. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const openSlideshow = (index: number = 0) => {
    setCurrentSlideIndex(index);
    setSlideshowOpen(true);
  };

  const nextSlide = () => {
    setCurrentSlideIndex((prev) => 
      prev === images.length - 1 ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    setCurrentSlideIndex((prev) => 
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  // Close slideshow on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && slideshowOpen) {
        setSlideshowOpen(false);
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [slideshowOpen]);

  // Group images by category for PDF organization
  const imagesByCategory = images.reduce((acc, image) => {
    if (!acc[image.category]) {
      acc[image.category] = [];
    }
    acc[image.category].push(image);
    return acc;
  }, {} as Record<string, GalleryImage[]>);

  // Calculate if save button should be enabled
  const shouldEnableSave = hasInitialized && 
                          hasMeaningfulChanges(images, lastSavedImages) && 
                          !saving;

  // Show loading state while initializing
  if (!hasInitialized && !memorialData) {
    return (
      <div className="max-w-6xl space-y-6 px-4 sm:px-6">
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="animate-pulse text-center py-8">Loading gallery data...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl space-y-6 px-4 sm:px-6">
      {/* Header - Improved mobile responsiveness */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div className="text-center sm:text-left">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">Photo Gallery</h2>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">Add photos and organize them by category for PDF export</p>
        </div>
        <div className="flex flex-wrap justify-center sm:justify-end gap-2">
          <button
            onClick={handleAddImage}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full hover:from-amber-600 hover:to-orange-600 transition-all text-sm"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Photo</span>
            <span className="sm:hidden">Add</span>
          </button>
          {images.length > 0 && (
            <button
              onClick={() => openSlideshow()}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-all text-sm"
            >
              <Play className="w-4 h-4" />
              <span className="hidden sm:inline">Slideshow</span>
            </button>
          )}
          <button
            onClick={handleManualSave}
            disabled={!shouldEnableSave}
            className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full transition-all text-sm ${
              shouldEnableSave
                ? 'bg-green-500 text-white hover:bg-green-600'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <Save className="w-4 h-4" />
            <span className="hidden sm:inline">{saving ? 'Saving...' : 'Save'}</span>
            <span className="sm:hidden">{saving ? '...' : 'Save'}</span>
          </button>
        </div>
      </div>

      {/* ADDED: Save Status Messages */}
      {saveSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center gap-2">
          <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
            <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <span className="text-green-800 text-sm font-medium">Gallery saved successfully!</span>
        </div>
      )}

      {saveError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <span className="text-red-800 text-sm font-medium">Save failed: {saveError}</span>
            <p className="text-red-600 text-xs mt-1">Please use the manual save button to try again</p>
          </div>
        </div>
      )}

      {/* ADDED: Debug Info Panel */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs">
        <div className="font-semibold text-blue-800 mb-2">🔍 Gallery Status</div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-blue-700">
          <div>Current: <strong>{images.length}</strong></div>
          <div>Saved: <strong>{lastSavedCount}</strong></div>
          <div>Backend: <strong>{(memorialData?.gallery as GalleryImage[] | undefined)?.length ?? 0}</strong></div>
          <div>Initialized: {hasInitialized ? '✅' : '❌'}</div>
          <div>Unsaved: {shouldEnableSave ? '⚠️' : '✅'}</div>
          <div>Saving: {saving ? '🔄' : '❌'}</div>
        </div>
      </div>

      {/* Stats - Improved mobile grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 text-center">
          <div className="text-xl sm:text-2xl font-bold text-gray-800">{images.length}</div>
          <div className="text-xs sm:text-sm text-gray-600">Total Photos</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 text-center">
          <div className="text-xl sm:text-2xl font-bold text-gray-800">
            {new Set(images.map(img => img.category)).size}
          </div>
          <div className="text-xs sm:text-sm text-gray-600">Categories</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 text-center">
          <div className="text-xl sm:text-2xl font-bold text-gray-800">
            {images.filter(img => img.caption).length}
          </div>
          <div className="text-xs sm:text-sm text-gray-600">With Captions</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 text-center">
          <div className="text-xl sm:text-2xl font-bold text-green-600">{lastSavedCount}</div>
          <div className="text-xs sm:text-sm text-gray-600">Last Saved</div>
        </div>
      </div>

      {/* Category Organization Preview - Improved mobile layout */}
      {Object.keys(imagesByCategory).length > 0 && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-blue-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2">
            <span className="text-blue-600">📊</span>
            PDF Organization Preview
          </h3>
          <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">
            Your images are organized by category for the PDF export. Each category will have its own section in the memorial PDF.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3">
            {Object.entries(imagesByCategory).map(([category, categoryImages]) => (
              <div key={category} className="bg-white rounded-lg p-2 sm:p-3 text-center border border-blue-100">
                <div className="text-xs sm:text-sm font-semibold text-blue-700 truncate">{category}</div>
                <div className="text-xs text-gray-600">{categoryImages.length} photos</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Image Form - Improved mobile layout */}
      {showForm && editingImage && (
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            {editingImage.id.startsWith('new-') ? 'Add Photo' : 'Edit Photo'}
          </h3>
          
          <div className="flex flex-col md:flex-row gap-4 sm:gap-6 mb-4 sm:mb-6">
            {/* Image Upload - Improved mobile sizing */}
            <div className="flex-shrink-0 flex flex-col items-center">
              <div className="w-32 h-32 sm:w-48 sm:h-48 rounded-xl sm:rounded-2xl overflow-hidden border-4 border-white shadow-lg bg-gray-200 mb-3 sm:mb-4">
                {editingImage.url ? (
                  <img 
                    src={editingImage.url} 
                    alt="Preview" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <span className="text-2xl sm:text-4xl">🖼️</span>
                  </div>
                )}
              </div>
              <label className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer text-xs sm:text-sm">
                <Upload className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>{uploading ? 'Uploading...' : 'Upload Photo'}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={uploading}
                />
              </label>
            </div>

            {/* Form Fields */}
            <div className="flex-1 space-y-3 sm:space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Caption *
                  <span className="text-xs text-gray-500 ml-2">(Will appear in PDF)</span>
                </label>
                <input
                  type="text"
                  value={editingImage.caption}
                  onChange={(e) => setEditingImage(prev => prev ? { ...prev, caption: e.target.value } : null)}
                  className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 text-sm sm:text-base"
                  placeholder="Enter photo caption for PDF"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                  <span className="text-xs text-gray-500 ml-2">(Groups photos in PDF)</span>
                </label>
                <select
                  value={editingImage.category}
                  onChange={(e) => setEditingImage(prev => prev ? { ...prev, category: e.target.value } : null)}
                  className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 text-sm sm:text-base"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div className="bg-amber-50 rounded-lg p-3 sm:p-4 border border-amber-200">
                <h4 className="text-sm font-semibold text-amber-800 mb-2">PDF Export Information</h4>
                <ul className="text-xs text-amber-700 space-y-1">
                  <li>• Photos are grouped by category in the PDF</li>
                  <li>• Captions appear below each photo</li>
                  <li>• Categories create separate sections</li>
                  <li>• High-quality images for printing</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <button
              onClick={handleSaveImage}
              disabled={!editingImage.caption.trim() || !editingImage.url || saving}
              className="flex-1 px-4 sm:px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
            >
              {saving ? 'Saving...' : 'Save Photo'}
            </button>
            <button
              onClick={() => {
                setShowForm(false);
                setEditingImage(null);
              }}
              className="flex-1 px-4 sm:px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm sm:text-base"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Images Grid - Improved mobile layout */}
      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {images.map((image, index) => (
          <div key={image.id} className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6 text-center hover:shadow-md transition-shadow">
            <div className="relative inline-block mb-3 sm:mb-4">
              <div 
                className="w-24 h-24 sm:w-32 sm:h-32 rounded-lg sm:rounded-xl overflow-hidden border-4 border-white shadow-lg bg-gray-200 mx-auto cursor-pointer"
                onClick={() => openSlideshow(index)}
              >
                <img 
                  src={image.url} 
                  alt={image.caption} 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="absolute -top-2 -right-2 flex gap-1">
                <button
                  onClick={() => {
                    setEditingImage(image);
                    setShowForm(true);
                  }}
                  className="p-1 bg-amber-500 text-white rounded-full hover:bg-amber-600 transition-colors"
                >
                  <Edit2 className="w-3 h-3" />
                </button>
                <button
                  onClick={() => handleDeleteImage(image.id)}
                  className="p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
            <h3 className="font-semibold text-gray-800 mb-1 text-xs sm:text-sm line-clamp-2">{image.caption}</h3>
            <p className="text-xs sm:text-sm text-amber-600 font-medium">{image.category}</p>
            <p className="text-xs text-gray-500 mt-1">{image.uploadedAt}</p>
          </div>
        ))}
      </div>

      {/* Slideshow Modal - Improved mobile experience */}
      {slideshowOpen && images.length > 0 && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="relative max-w-4xl w-full max-h-full">
            {/* Close button */}
            <button
              onClick={() => setSlideshowOpen(false)}
              className="absolute top-2 right-2 sm:top-4 sm:right-4 z-10 p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition-all"
            >
              <X className="w-4 h-4 sm:w-6 sm:h-6" />
            </button>

            {/* Navigation buttons - Mobile optimized */}
            <button
              onClick={prevSlide}
              className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 z-10 p-2 sm:p-3 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition-all"
            >
              <ChevronLeft className="w-4 h-4 sm:w-6 sm:h-6" />
            </button>

            <button
              onClick={nextSlide}
              className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 z-10 p-2 sm:p-3 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition-all"
            >
              <ChevronRight className="w-4 h-4 sm:w-6 sm:h-6" />
            </button>

            {/* Current image */}
            <div className="flex flex-col items-center">
              <img
                src={images[currentSlideIndex].url}
                alt={images[currentSlideIndex].caption}
                className="max-w-full max-h-[60vh] sm:max-h-[70vh] object-contain rounded-lg"
              />
              
              {/* Image info */}
              <div className="mt-3 sm:mt-4 text-white text-center px-2">
                <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 mb-2">
                  <span className="bg-amber-500 text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
                    {images[currentSlideIndex].category}
                  </span>
                  <span className="text-gray-300 text-xs sm:text-sm">
                    {currentSlideIndex + 1} of {images.length}
                  </span>
                </div>
                <p className="text-sm sm:text-lg font-semibold break-words">
                  {images[currentSlideIndex].caption}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {images.length === 0 && (
        <div className="text-center py-8 sm:py-12">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-amber-400 to-orange-400 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
            <span className="text-xl sm:text-2xl text-white">🖼️</span>
          </div>
          <h3 className="text-base sm:text-lg font-semibold text-gray-600 mb-2">No photos added yet</h3>
          <p className="text-gray-500 mb-4 text-sm sm:text-base px-4">Build the photo gallery by adding memorable photos. Categories will be preserved for PDF export.</p>
          <button
            onClick={handleAddImage}
            className="px-4 sm:px-6 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full hover:from-amber-600 hover:to-orange-600 transition-all text-sm sm:text-base"
          >
            Add First Photo
          </button>
        </div>
      )}
    </div>
  );
};