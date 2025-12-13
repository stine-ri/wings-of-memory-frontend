// GallerySectionEditor.tsx - EDITOR VERSION
import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Upload, Play, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useMemorial } from '../../hooks/useMemorial'; // IMPORTANT: Add this import

interface GalleryImage {
  id: string;
  url: string;
  category: string;
  caption: string;
  description?: string;
  alt?: string;
  title?: string;
  uploadedAt: string;
}

export const GallerySection: React.FC = () => { // NO PROPS!
  const { memorialData, updateGallery, loading: contextLoading } = useMemorial(); // Use the hook
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [editingImage, setEditingImage] = useState<GalleryImage | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [slideshowOpen, setSlideshowOpen] = useState(false);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  // Initialize images from memorial data
  useEffect(() => {
    if (memorialData?.gallery && Array.isArray(memorialData.gallery)) {
      console.log('🔄 Initializing gallery:', memorialData.gallery.length, 'images');
      setImages(memorialData.gallery as GalleryImage[]);
    }
  }, [memorialData]);

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
    setEditingImage({
      id: 'new-' + Date.now(),
      url: '',
      category: 'Portraits',
      caption: '',
      uploadedAt: new Date().toISOString(),
      description: '',
      alt: '',
      title: ''
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

    setUploading(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Please log in again.');
      }

      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'memorials/gallery');

      const response = await fetch('https://wings-of-memories-backend.onrender.com/api/imagekit/upload', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData,
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Upload failed: ${response.status} ${error}`);
      }

      const data = await response.json();
      setEditingImage(prev => prev ? { ...prev, url: data.url } : null);
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleSaveImage = async () => {
    if (!editingImage || !editingImage.caption.trim()) {
      alert('Please enter a caption for the image.');
      return;
    }

    if (!editingImage.url) {
      alert('Please upload an image.');
      return;
    }

    setSaveStatus('saving');

    try {
      let newImages: GalleryImage[];
      
      if (editingImage.id.startsWith('new-')) {
        newImages = [...images, { 
          id: Date.now().toString(),
          url: editingImage.url,
          category: editingImage.category,
          caption: editingImage.caption,
          description: editingImage.caption,
          uploadedAt: new Date().toISOString(),
          alt: editingImage.caption,
          title: editingImage.caption
        }];
      } else {
        newImages = images.map(img => 
          img.id === editingImage.id ? {
            ...img,
            url: editingImage.url,
            category: editingImage.category,
            caption: editingImage.caption,
            description: editingImage.caption,
            alt: editingImage.caption,
            title: editingImage.caption
          } : img
        );
      }
      
      setImages(newImages);
      
      await updateGallery(newImages.map(img => ({
        id: img.id,
        url: img.url,
        category: img.category,
        caption: img.caption,
        description: img.caption,
        alt: img.caption,
        title: img.caption,
        uploadedAt: img.uploadedAt
      })));
      
      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 2000);
      
      setShowForm(false);
      setEditingImage(null);
      
    } catch (error) {
      console.error('Save failed:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  };

  const handleDeleteImage = async (id: string) => {
    if (!confirm('Are you sure you want to delete this image?')) return;
    
    const newImages = images.filter(img => img.id !== id);
    
    try {
      setImages(newImages);
      await updateGallery(newImages);
    } catch (error) {
      console.error('Delete failed:', error);
      alert('Failed to delete image');
      setImages(images);
    }
  };

  const openSlideshow = (index: number = 0) => {
    setCurrentSlideIndex(index);
    setSlideshowOpen(true);
  };

  const nextSlide = () => {
    setCurrentSlideIndex(prev => 
      prev === images.length - 1 ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    setCurrentSlideIndex(prev => 
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

  if (contextLoading) {
    return (
      <div className="max-w-6xl space-y-6 px-4 sm:px-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="animate-pulse text-center py-8">Loading gallery...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl space-y-6 px-4 sm:px-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">Photo Gallery</h2>
          <p className="text-gray-600 mt-1">Add photos and organize them by category</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleAddImage}
            className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-all"
          >
            <Plus className="w-4 h-4" />
            Add Photo
          </button>
          {images.length > 0 && (
            <button
              onClick={() => openSlideshow()}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all"
            >
              <Play className="w-4 h-4" />
              Slideshow
            </button>
          )}
        </div>
      </div>

      {/* Save Status */}
      {saveStatus === 'saving' && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-blue-800">
          Saving gallery...
        </div>
      )}
      
      {saveStatus === 'success' && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-green-800">
          Gallery saved successfully!
        </div>
      )}
      
      {saveStatus === 'error' && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-800">
          Failed to save gallery. Please try again.
        </div>
      )}

      {/* Images Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {images.map((image, index) => (
          <div key={image.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 text-center">
            <div className="relative inline-block mb-4">
              <div 
                className="w-32 h-32 rounded-xl overflow-hidden border-4 border-white shadow-lg bg-gray-200 mx-auto cursor-pointer"
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
                  className="p-1 bg-amber-500 text-white rounded-full hover:bg-amber-600"
                >
                  <Edit2 className="w-3 h-3" />
                </button>
                <button
                  onClick={() => handleDeleteImage(image.id)}
                  className="p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
            <h3 className="font-semibold text-gray-800 mb-1 line-clamp-2">{image.caption}</h3>
            <p className="text-sm text-amber-600 font-medium">{image.category}</p>
          </div>
        ))}
      </div>

      {/* Image Form */}
      {showForm && editingImage && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              {editingImage.id.startsWith('new-') ? 'Add Photo' : 'Edit Photo'}
            </h3>
            
            <div className="flex flex-col md:flex-row gap-6 mb-6">
              <div className="flex-shrink-0">
                <div className="w-48 h-48 rounded-2xl overflow-hidden border-4 border-white shadow-lg bg-gray-200 mb-4">
                  {editingImage.url ? (
                    <img 
                      src={editingImage.url} 
                      alt="Preview" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <span className="text-4xl">🖼️</span>
                    </div>
                  )}
                </div>
                <label className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 cursor-pointer">
                  <Upload className="w-4 h-4" />
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

              <div className="flex-1 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Caption/Description *
                  </label>
                  <textarea
                    value={editingImage.caption}
                    onChange={(e) => setEditingImage(prev => prev ? { 
                      ...prev, 
                      caption: e.target.value,
                      description: e.target.value,
                      alt: e.target.value,
                      title: e.target.value
                    } : null)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 h-32 resize-none"
                    placeholder="Describe this memory... What is happening in this photo? Who is in it? When was it taken?"
                    rows={4}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    This description will appear in the memorial booklet.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    value={editingImage.category}
                    onChange={(e) => setEditingImage(prev => prev ? { ...prev, category: e.target.value } : null)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleSaveImage}
                disabled={!editingImage.caption.trim() || !editingImage.url || saveStatus === 'saving'}
                className="flex-1 px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50"
              >
                {saveStatus === 'saving' ? 'Saving...' : 'Save Photo'}
              </button>
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingImage(null);
                }}
                className="flex-1 px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Slideshow */}
      {slideshowOpen && images.length > 0 && (
        <div className="fixed inset-0 bg-black flex items-center justify-center z-50 p-4">
          <button
            onClick={() => setSlideshowOpen(false)}
            className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-full hover:bg-black/70"
          >
            <X className="w-6 h-6" />
          </button>

          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 bg-black/50 text-white rounded-full hover:bg-black/70"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 bg-black/50 text-white rounded-full hover:bg-black/70"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          <div className="flex flex-col items-center">
            <img
              src={images[currentSlideIndex].url}
              alt={images[currentSlideIndex].caption}
              className="max-w-full max-h-[70vh] object-contain rounded-lg"
            />
            
            <div className="mt-4 text-white text-center">
              <p className="text-lg font-semibold">{images[currentSlideIndex].caption}</p>
              <p className="text-sm text-gray-300">{currentSlideIndex + 1} of {images.length}</p>
            </div>
          </div>
        </div>
      )}

      {images.length === 0 && !showForm && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-400 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl text-white">🖼️</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-600 mb-2">No photos added yet</h3>
          <p className="text-gray-500 mb-4">Add memorable photos to the gallery</p>
          <button
            onClick={handleAddImage}
            className="px-6 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full hover:from-amber-600 hover:to-orange-600 transition-all"
          >
            Add First Photo
          </button>
        </div>
      )}
    </div>
  );
};