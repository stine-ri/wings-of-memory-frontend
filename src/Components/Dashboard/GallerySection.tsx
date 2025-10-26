import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Upload, Save, Play, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useMemorial } from '../../hooks/useMemorial';

interface GalleryImage {
  id: string;
  url: string;
  category: string;
  caption: string;
  uploadedAt: string;
}

export const GallerySection: React.FC = () => {
  const { memorialData, updateGallery, saveToBackend } = useMemorial();
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [editingImage, setEditingImage] = useState<GalleryImage | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [slideshowOpen, setSlideshowOpen] = useState(false);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  // Initialize with memorial data from backend
  useEffect(() => {
    if (memorialData?.gallery) {
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

    setUploading(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token not found. Please log in again.');
      }

      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'memorials/gallery');

      const uploadResponse = await fetch('http://localhost:3000/api/imagekit/upload', {
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
      setEditingImage(prev => prev ? { ...prev, url: data.url } : null);
    } catch (error) {
  console.error(error);
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

    let newImages: GalleryImage[];
    if (editingImage.id.startsWith('new-')) {
      newImages = [...images, { ...editingImage, id: Date.now().toString() }];
    } else {
      newImages = images.map(img => img.id === editingImage.id ? editingImage : img);
    }
    
    setImages(newImages);
    setShowForm(false);
    setEditingImage(null);
    
    // Save to backend
    setSaving(true);
    try {
      await updateGallery(newImages);
      await saveToBackend();
    } catch (error) {
      console.error('Error saving gallery:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteImage = async (id: string) => {
    const newImages = images.filter(img => img.id !== id);
    setImages(newImages);
    
    // Save to backend
    setSaving(true);
    try {
      await updateGallery(newImages);
      await saveToBackend();
    } catch (error) {
      console.error('Error deleting image:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleManualSave = async () => {
    setSaving(true);
    try {
      await updateGallery(images);
      await saveToBackend();
      alert('Gallery saved successfully!');
    } catch (error) {
      console.error('Error saving gallery:', error);
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

  return (
    <div className="max-w-6xl space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">Photo Gallery</h2>
          <p className="text-gray-600 mt-1">Add photos and organize them by category</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleAddImage}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full hover:from-amber-600 hover:to-orange-600 transition-all"
          >
            <Plus className="w-4 h-4" />
            Add Photo
          </button>
          {images.length > 0 && (
            <button
              onClick={() => openSlideshow()}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-all"
            >
              <Play className="w-4 h-4" />
              View Slideshow
            </button>
          )}
          <button
            onClick={handleManualSave}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-all disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save All'}
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 text-center">
          <div className="text-2xl font-bold text-gray-800">{images.length}</div>
          <div className="text-sm text-gray-600">Total Photos</div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 text-center">
          <div className="text-2xl font-bold text-gray-800">
            {new Set(images.map(img => img.category)).size}
          </div>
          <div className="text-sm text-gray-600">Categories</div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 text-center">
          <div className="text-2xl font-bold text-gray-800">
            {images.filter(img => img.caption).length}
          </div>
          <div className="text-sm text-gray-600">With Captions</div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 text-center">
          <div className="text-2xl font-bold text-gray-800">
            {images.filter(img => !img.caption).length}
          </div>
          <div className="text-sm text-gray-600">Need Captions</div>
        </div>
      </div>

      {/* Image Form */}
      {showForm && editingImage && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            {editingImage.id.startsWith('new-') ? 'Add Photo' : 'Edit Photo'}
          </h3>
          
          <div className="flex flex-col md:flex-row gap-6 mb-6">
            {/* Image Upload */}
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
              <label className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer text-sm">
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

            {/* Form Fields */}
            <div className="flex-1 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Caption *</label>
                <input
                  type="text"
                  value={editingImage.caption}
                  onChange={(e) => setEditingImage(prev => prev ? { ...prev, caption: e.target.value } : null)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400"
                  placeholder="Enter photo caption"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
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
              disabled={!editingImage.caption.trim() || !editingImage.url}
              className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Save Photo
            </button>
            <button
              onClick={() => {
                setShowForm(false);
                setEditingImage(null);
              }}
              className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Images Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {images.map((image, index) => (
          <div key={image.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 text-center hover:shadow-md transition-shadow">
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
            <h3 className="font-semibold text-gray-800 mb-1 text-sm line-clamp-2">{image.caption}</h3>
            <p className="text-sm text-amber-600 font-medium">{image.category}</p>
            <p className="text-xs text-gray-500 mt-1">{image.uploadedAt}</p>
          </div>
        ))}
      </div>

      {/* Slideshow Modal */}
      {slideshowOpen && images.length > 0 && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-4xl w-full max-h-full">
            {/* Close button */}
            <button
              onClick={() => setSlideshowOpen(false)}
              className="absolute top-4 right-4 z-10 p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition-all"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Navigation buttons */}
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 p-3 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition-all"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 p-3 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition-all"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Current image */}
            <div className="flex flex-col items-center">
              <img
                src={images[currentSlideIndex].url}
                alt={images[currentSlideIndex].caption}
                className="max-w-full max-h-[70vh] object-contain rounded-lg"
              />
              
              {/* Image info */}
              <div className="mt-4 text-white text-center">
                <div className="flex items-center justify-center gap-4 mb-2">
                  <span className="bg-amber-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {images[currentSlideIndex].category}
                  </span>
                  <span className="text-gray-300 text-sm">
                    {currentSlideIndex + 1} of {images.length}
                  </span>
                </div>
                <p className="text-lg font-semibold">
                  {images[currentSlideIndex].caption}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {images.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-400 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl text-white">🖼️</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-600 mb-2">No photos added yet</h3>
          <p className="text-gray-500 mb-4">Build the photo gallery by adding memorable photos.</p>
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