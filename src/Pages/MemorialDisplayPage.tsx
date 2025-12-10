import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Calendar, MapPin, Heart, Users, Image as ImageIcon, 
  MessageCircle, Clock, Share2, X, ChevronLeft, 
  ChevronRight, BookOpen, 
  Facebook, Twitter, Mail, Link, MessageSquare,
  Check, User, Star,
  ChevronDown,
  Smartphone, ChevronUp, 
    Trash2, 
  Video, Plus,
  Play, Pause, 
  Sparkles, Flower2, Pencil
} from 'lucide-react';


// Interfaces
interface Tribute {
  id: string;
  name: string;
  location: string;
  message: string;
  image?: string;
  date: string;
  userId?: string;
    sessionId?: string;
   isAnonymous?: boolean;
}

interface TimelineEvent {
  id: string;
  year: number;
  date: string;
  title: string;
  description: string;
  location?: string;
  icon: string;
}

interface Favorite {
  id: string;
  category: string;
  icon: string;
  question: string;
  answer: string;
}

interface FamilyMember {
  id: string;
  name: string;
  image?: string;
  relation: string;
  isDeceased?: boolean;
  children?: FamilyMember[];
  spouse?: string;
  parentId?: string;
}

interface GalleryImage {
  id: string;
  url: string;
  category: string;
  caption?: string;
  uploadedAt: string;
}

interface ServiceInfo {
  venue: string;
  address: string;
  date: string;
  time: string;
  virtualLink?: string;
  virtualPlatform?: 'zoom' | 'meet' | 'teams';
}

interface Memory {
  id?: string;
  text: string;
  author?: string;
  date?: string;
  images?: string[];
  userId?: string;
  timestamp?: number;
}

interface MemorialData {
  id: string;
  name: string;
  profileImage: string;
  birthDate: string;
  deathDate: string;
  location: string;
  obituary: string;
  timeline: TimelineEvent[];
  favorites: Favorite[];
  familyTree: FamilyMember[];
  gallery: GalleryImage[];
  serviceInfo?: ServiceInfo;
  service?: ServiceInfo;
  memories: Memory[];
  memoryWall: Memory[];
  isPublished: boolean;
  customUrl: string;
  theme: string;
  tributes: Tribute[];
}

// Add this helper function at the top of the component file
const getOrCreateSessionId = (identifier: string): string => {
  const STORAGE_KEY = 'memorial-session-id';
  const MEMORIAL_KEY = (id: string) => `${STORAGE_KEY}-${id}`;
  
  // Create a session ID specific to this memorial
  let sessionId = localStorage.getItem(MEMORIAL_KEY(identifier));
  
  if (!sessionId) {
    sessionId = 'session-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem(MEMORIAL_KEY(identifier || ''), sessionId);
    console.log('Created new session ID:', sessionId);
  } else {
    console.log('Using existing session ID:', sessionId);
  }
  
  return sessionId;
};

// Enhanced Share Modal
const ShareModal: React.FC<{ 
  isOpen: boolean; 
  onClose: () => void; 
  memorialUrl: string;
  memorialName: string;
}> = ({ isOpen, onClose, memorialUrl, memorialName }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(memorialUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textArea = document.createElement('textarea');
      textArea.value = memorialUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const shareOptions = [
    {
      icon: MessageSquare,
      label: 'WhatsApp',
      color: 'bg-green-500 hover:bg-green-600',
      onClick: () => window.open(`https://wa.me/?text=Remember ${memorialName}: ${memorialUrl}`, '_blank')
    },
    {
      icon: Facebook,
      label: 'Facebook',
      color: 'bg-blue-600 hover:bg-blue-700',
      onClick: () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(memorialUrl)}`, '_blank')
    },
    {
      icon: Twitter,
      label: 'Twitter',
      color: 'bg-sky-500 hover:bg-sky-600',
      onClick: () => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(memorialUrl)}&text=Remembering ${memorialName}`, '_blank')
    },
    {
      icon: Mail,
      label: 'Email',
      color: 'bg-gray-600 hover:bg-gray-700',
      onClick: () => window.location.href = `mailto:?subject=Memorial for ${memorialName}&body=View the memorial: ${memorialUrl}`
    }
  ];

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl animate-fadeIn" onClick={(e) => e.stopPropagation()}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-serif font-bold text-gray-900">Share this Memorial</h3>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          
          <div className="space-y-6">
            <div>
              <p className="text-gray-600 mb-4">Share {memorialName}'s memorial with loved ones</p>
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
                <Link className="w-5 h-5 text-gray-400 shrink-0" />
                <div className="flex-1 truncate text-sm text-gray-700 font-mono">
                  {memorialUrl}
                </div>
                <button
                  onClick={handleCopy}
                  className="px-4 py-2 bg-amber-400 hover:bg-amber-500 text-gray-900 rounded-lg transition-all text-sm font-medium flex items-center gap-2"
                >
                  {copied ? <><Check className="w-4 h-4" /> Copied</> : 'Copy Link'}
                </button>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-700 mb-4">Share via</p>
              <div className="grid grid-cols-4 gap-3">
                {shareOptions.map((option) => {
                  const Icon = option.icon;
                  return (
                    <button
                      key={option.label}
                      onClick={option.onClick}
                      className="flex flex-col items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-all group"
                    >
                      <div className={`w-12 h-12 rounded-full ${option.color} flex items-center justify-center transition-transform group-hover:scale-110 group-hover:shadow-lg`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <span className="text-xs text-gray-600 font-medium">{option.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Enhanced Tribute Form
const TributeForm: React.FC<{
  memorialName: string;
  onSuccess: () => void;
  onCancel: () => void;
  editingTribute?: Tribute | null;
  isEdit?: boolean;
  identifier: string;
}> = ({ memorialName, onSuccess, onCancel, editingTribute = null, isEdit = false, identifier}) => {
  const [formData, setFormData] = useState({
    name: editingTribute?.name || '',
    location: editingTribute?.location || '',
    message: editingTribute?.message || '',
    images: editingTribute?.image ? [editingTribute.image] : [] as string[],
    isAnonymous: editingTribute?.isAnonymous || false
  });
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingImages(true);
    const newImages: string[] = [];

    for (let i = 0; i < Math.min(files.length, 3 - formData.images.length); i++) {
      const file = files[i];
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        continue;
      }

      try {
        const reader = new FileReader();
        const base64 = await new Promise<string>((resolve) => {
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });
        newImages.push(base64);
      } catch (error) {
        console.error('Failed to upload image:', error);
      }
    }

    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...newImages]
    }));
    setUploadingImages(false);
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  // In TributeForm component, update handleSubmit:
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  if (!formData.message.trim()) {
    alert('Please write a message');
    return;
  }

  if (!formData.isAnonymous && !formData.name.trim()) {
    alert('Please fill in your name or choose to post anonymously');
    return;
  }

  setSubmitting(true);
  try {
   
    
    const tributeData = {
      authorName: formData.isAnonymous ? 'Anonymous' : formData.name,
      authorLocation: formData.location,
      message: formData.message,
      authorImage: formData.images[0] || '',
     sessionId: getOrCreateSessionId(identifier) 
    };

     console.log('Submitting tribute with sessionId:', tributeData.sessionId);

    const url = isEdit && editingTribute
      ? `https://wings-of-memories-backend.onrender.com/api/memorials/public/${identifier}/tributes/${editingTribute.id}`
      : `https://wings-of-memories-backend.onrender.com/api/memorials/public/${identifier}/tributes`;

    const method = isEdit ? 'PUT' : 'POST';
    
    // For edit/delete, include sessionId in the body
     const requestBody = isEdit 
      ? { ...tributeData, sessionId: tributeData.sessionId }
      : tributeData;


    const response = await fetch(url, {
      method,
      headers: { 
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Failed to ${isEdit ? 'update' : 'submit'} tribute: ${response.status} - ${errorData.error || 'Unknown error'}`);
    }

    const result = await response.json();
    console.log('Tribute operation successful:', result);

    setFormData({ name: '', location: '', message: '', images: [], isAnonymous: false });
    onSuccess();
    
  } catch (error) {
    console.error('Error with tribute:', error);
    alert(error instanceof Error ? error.message : `Failed to ${isEdit ? 'update' : 'submit'} tribute. Please try again.`);
  } finally {
    setSubmitting(false);
  }
};

  return (
    <div className="bg-gray-50 rounded-xl border border-gray-200 p-4 sm:p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg sm:text-xl font-semibold text-gray-800">
          {isEdit ? 'Edit Memory' : 'Share a Memory'}
        </h3>
        <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
          <X className="w-5 h-5" />
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Anonymous Toggle */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.isAnonymous}
              onChange={(e) => setFormData({ ...formData, isAnonymous: e.target.checked })}
              className="w-4 h-4 text-orange-500 rounded focus:ring-orange-400"
            />
            <span className="text-sm text-gray-700 font-medium">
              Post anonymously (your name will not be shown)
            </span>
          </label>
        </div>

        {!formData.isAnonymous && (
          <div>
            <label className="block text-gray-700 mb-2 text-sm font-medium">Your Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-400 text-sm sm:text-base"
              placeholder="Enter your name"
              required={!formData.isAnonymous}
            />
          </div>
        )}

        <div>
          <label className="block text-gray-700 mb-2 text-sm font-medium">Location (Optional)</label>
          <input
            type="text"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-400 text-sm sm:text-base"
            placeholder="City, Country"
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-2 text-sm font-medium">Your Memory *</label>
          <textarea
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            rows={4}
            className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-400 resize-none text-sm sm:text-base"
            placeholder={`Share your thoughts about ${memorialName}...`}
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-2 text-sm font-medium">
            Add Photos (Optional - max 3)
          </label>
          
          {formData.images.length > 0 && (
            <div className="flex gap-2 sm:gap-3 mb-3 flex-wrap">
              {formData.images.map((img, index) => (
                <div key={index} className="relative">
                  <img src={img} alt="" className="w-16 h-16 object-cover rounded" />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {formData.images.length < 3 && (
            <label className="border-2 border-dashed border-gray-300 rounded-lg p-4 sm:p-6 text-center hover:border-orange-400 transition-colors cursor-pointer block">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="hidden"
                disabled={uploadingImages}
              />
              <Plus size={20} className="mx-auto text-gray-400 mb-2" />
              <p className="text-gray-500 text-sm">
                {uploadingImages ? 'Uploading...' : 'Click to upload photos'}
              </p>
            </label>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            type="submit"
            disabled={submitting || uploadingImages}
            className="flex-1 bg-orange-400 text-white px-4 py-2.5 rounded-lg hover:bg-orange-500 transition-colors text-sm sm:text-base font-medium disabled:opacity-50"
          >
            {submitting ? 'Submitting...' : (isEdit ? 'Update Memory' : 'Submit Memory')}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-gray-200 text-gray-700 px-4 py-2.5 rounded-lg hover:bg-gray-300 transition-colors text-sm sm:text-base font-medium"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

// Enhanced Gallery with Slideshow

const GallerySection: React.FC<{ gallery: GalleryImage[] }> = ({ gallery }) => {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isSlideshowActive, setIsSlideshowActive] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const slideRef = useRef<HTMLDivElement>(null);
  const slideshowInterval = useRef<NodeJS.Timeout | null>(null);

  const categories = ['all', ...new Set(gallery.map(img => img.category).filter(Boolean))];
  const filteredImages = activeFilter === 'all' 
    ? gallery 
    : gallery.filter(img => img.category === activeFilter);

  useEffect(() => {
    if (slideRef.current) {
      slideRef.current.scrollLeft = currentSlide * slideRef.current.offsetWidth;
    }
  }, [currentSlide]);

  useEffect(() => {
    if (isSlideshowActive && isPlaying) {
      slideshowInterval.current = setInterval(() => {
        setCurrentSlide(prev => (prev + 1) % filteredImages.length);
      }, 3000);
    } else {
      if (slideshowInterval.current) {
        clearInterval(slideshowInterval.current);
      }
    }

    return () => {
      if (slideshowInterval.current) {
        clearInterval(slideshowInterval.current);
      }
    };
  }, [isSlideshowActive, isPlaying, filteredImages.length]);

  const openSlideshow = useCallback((index: number) => {
    setCurrentSlide(index);
    setIsSlideshowActive(true);
    setIsPlaying(false);
    document.body.style.overflow = 'hidden';
  }, []);

  const closeSlideshow = useCallback(() => {
    setIsSlideshowActive(false);
    setIsPlaying(false);
    setSelectedImage(null);
    document.body.style.overflow = 'unset';
  }, []);

  const startSlideshow = () => {
    setCurrentSlide(0);
    setIsSlideshowActive(true);
    setIsPlaying(true);
    document.body.style.overflow = 'hidden';
  };

  const nextSlide = useCallback(() => {
    setCurrentSlide(prev => (prev + 1) % filteredImages.length);
  }, [filteredImages.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide(prev => (prev - 1 + filteredImages.length) % filteredImages.length);
  }, [filteredImages.length]);

  if (gallery.length === 0) return null;

  return (
    <section id="gallery" className="py-16 sm:py-20 px-3 sm:px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header Section with Title and Horizontal Navigation */}
        <div className="mb-8 sm:mb-12">
          {/* Gallery Title with Half Underline */}
          <div className="mb-6 sm:mb-8">
            <h2 className="text-4xl sm:text-5xl font-serif text-gray-800 inline-block relative">
              Gallery
              <div className="absolute -bottom-2 left-0 w-1/2 h-1 bg-amber-500 rounded-full"></div>
            </h2>
            <p className="text-sm text-gray-600 mt-2">{gallery.length} precious moments</p>
          </div>
          
          {/* Horizontal Navigation */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
            {/* Categories */}
            <div className="flex flex-wrap gap-2 sm:gap-4">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => {
                    setActiveFilter(category);
                    setCurrentSlide(0);
                  }}
                  className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg transition-colors duration-200 font-medium text-sm sm:text-base ${
                    activeFilter === category
                      ? 'bg-amber-500 text-white' 
                      : 'text-gray-700 bg-white hover:bg-orange-100 border border-gray-200'
                  }`}
                >
                  {category === 'all' ? 'All' : category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ')}
                </button>
              ))}
            </div>
            
            {/* Divider Line */}
            <div className="hidden sm:block h-8 w-px bg-gray-300"></div>
            
            {/* Slideshow Button */}
            <button
              onClick={isSlideshowActive ? closeSlideshow : startSlideshow}
              className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg transition-colors duration-200 font-medium flex items-center gap-2 text-sm sm:text-base w-fit ${
                isSlideshowActive
                  ? 'bg-red-500 text-white hover:bg-red-600'
                  : 'bg-purple-500 text-white hover:bg-purple-600'
              }`}
            >
              {isSlideshowActive ? (
                <>
                  <Pause className="w-4 h-4 sm:w-5 sm:h-5" />
                  Stop Slideshow
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 sm:w-5 sm:h-5" />
                  Start Slideshow
                </>
              )}
            </button>
          </div>
        </div>

        {/* Image Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {filteredImages.map((photo) => (
            <div 
              key={photo.id}
              className="relative aspect-square overflow-hidden rounded-lg bg-gray-100 cursor-pointer group"
              onClick={() => {
                const photoIndex = gallery.findIndex(img => img.id === photo.id);
                openSlideshow(photoIndex);
              }}
            >
              <img
                src={photo.url}
                alt={photo.caption || `Photo`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              
              {/* Overlay with caption */}
              <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {photo.category && (
                  <div className="absolute bottom-3 left-3 right-3">
                    <span className="text-xs font-medium text-white bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-lg">
                      {photo.category}
                    </span>
                    {photo.caption && (
                      <p className="text-white text-sm mt-2 line-clamp-2">{photo.caption}</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Slideshow Modal */}
        {isSlideshowActive && (
          <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
            {/* Close Button */}
            <button
              onClick={closeSlideshow}
              className="absolute top-4 sm:top-6 right-4 sm:right-6 text-white hover:text-gray-300 transition-colors z-10"
            >
              <X size={24} className="sm:size-[36px]" />
            </button>

            {/* Navigation Buttons */}
            <button
              onClick={prevSlide}
              className="absolute left-2 sm:left-6 text-white hover:text-gray-300 transition-colors z-10"
            >
              <ChevronLeft size={32} className="sm:size-[48px]" />
            </button>

            <button
              onClick={nextSlide}
              className="absolute right-2 sm:right-6 text-white hover:text-gray-300 transition-colors z-10"
            >
              <ChevronRight size={32} className="sm:size-[48px]" />
            </button>

            {/* Main Image */}
            <div className="max-w-4xl max-h-[80vh] w-full px-4 sm:px-20">
              <img
                src={filteredImages[currentSlide]?.url}
                alt={filteredImages[currentSlide]?.caption || `Slide ${currentSlide + 1}`}
                className="w-full h-full object-contain rounded-lg"
              />
              
              {/* Image Info */}
              <div className="mt-4 text-center">
                {(filteredImages[currentSlide]?.category || filteredImages[currentSlide]?.caption) && (
                  <div className="bg-black/40 backdrop-blur-sm rounded-lg p-4 inline-block">
                    {filteredImages[currentSlide]?.category && (
                      <h3 className="text-xl font-bold text-white mb-1">
                        {filteredImages[currentSlide].category}
                      </h3>
                    )}
                    {filteredImages[currentSlide]?.caption && (
                      <p className="text-gray-300 max-w-2xl mx-auto text-sm sm:text-base">
                        {filteredImages[currentSlide].caption}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Controls Bar */}
            <div className="absolute bottom-4 sm:bottom-6 left-1/2 transform -translate-x-1/2 flex items-center gap-3 sm:gap-4">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full transition-all flex items-center gap-2 text-sm sm:text-base"
              >
                {isPlaying ? <Pause size={16} className="sm:size-[20px]" /> : <Play size={16} className="sm:size-[20px]" />}
                {isPlaying ? 'Pause' : 'Play'}
              </button>
              <div className="text-white text-base sm:text-lg">
                {currentSlide + 1} / {filteredImages.length}
              </div>
            </div>

            {/* Progress Indicator Dots - Mobile only */}
            <div className="sm:hidden absolute bottom-20 left-1/2 -translate-x-1/2 flex gap-2">
              {filteredImages.slice(0, 5).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    idx === currentSlide ? 'bg-white w-4' : 'bg-white/50'
                  }`}
                />
              ))}
              {filteredImages.length > 5 && (
                <span className="text-white/70 text-xs ml-1">+{filteredImages.length - 5}</span>
              )}
            </div>
          </div>
        )}

        {/* Lightbox for individual image view (preserves existing functionality) */}
        {selectedImage !== null && !isSlideshowActive && (
          <div className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            
            <button
              onClick={() => {
                const prevIndex = selectedImage > 0 ? selectedImage - 1 : gallery.length - 1;
                setSelectedImage(prevIndex);
              }}
              className="absolute left-4 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            
            <div className="max-w-6xl w-full">
              <img
                src={gallery[selectedImage].url}
                alt={gallery[selectedImage].caption || `Photo ${selectedImage + 1}`}
                className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
              />
              <div className="mt-4 text-center">
                <h3 className="text-xl font-bold text-white mb-2">
                  {gallery[selectedImage].category}
                </h3>
                {gallery[selectedImage].caption && (
                  <p className="text-gray-300 max-w-2xl mx-auto">{gallery[selectedImage].caption}</p>
                )}
              </div>
            </div>
            
            <button
              onClick={() => {
                const nextIndex = selectedImage < gallery.length - 1 ? selectedImage + 1 : 0;
                setSelectedImage(nextIndex);
              }}
              className="absolute right-4 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
            
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/60 text-sm">
              {selectedImage + 1} / {gallery.length}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

// Enhanced Family Tree with Relationship Lines
import { motion, AnimatePresence } from 'framer-motion';

// Enhanced Family Tree with Relationship Lines using Framer Motion



const FamilyTreeSection: React.FC<{ familyTree: FamilyMember[] }> = ({ familyTree }) => {
  const [expandedMembers, setExpandedMembers] = useState<Set<string>>(new Set());
  const [hoveredMember, setHoveredMember] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Check for mobile screen
  useEffect(() => {
    const checkMobile = () => {
      const isMobileDevice = window.innerWidth < 768;
      setIsMobile(isMobileDevice);
    };
    
    // Check immediately
    checkMobile();
    
    // Listen for resize
    window.addEventListener('resize', checkMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (familyTree.length === 0) return null;

  const toggleMember = (memberId: string) => {
    const newExpanded = new Set(expandedMembers);
    if (newExpanded.has(memberId)) {
      newExpanded.delete(memberId);
    } else {
      newExpanded.add(memberId);
    }
    setExpandedMembers(newExpanded);
  };

  const getChildren = (memberId: string): FamilyMember[] => {
    return familyTree.filter(m => m.parentId === memberId);
  };

  const getSpouse = (memberId: string): FamilyMember | undefined => {
    const member = familyTree.find(m => m.id === memberId);
    return member?.spouse ? familyTree.find(m => m.id === member.spouse) : undefined;
  };

  // Get the main person (the one being memorialized)
  const mainPerson = familyTree.find(m => m.isDeceased) || 
                     familyTree.find(m => !m.parentId && !m.spouse) || 
                     familyTree[0];

  // Organize family structure
  const parents = familyTree.filter(m => m.parentId === null && m.id !== mainPerson?.id);
  const mainPersonSpouse = mainPerson?.spouse ? familyTree.find(m => m.id === mainPerson.spouse) : null;
  const mainPersonChildren = mainPerson ? getChildren(mainPerson.id) : [];
  const spouseChildren = mainPersonSpouse ? getChildren(mainPersonSpouse.id) : [];
  const allChildren = [...new Set([...mainPersonChildren, ...spouseChildren])];
  const siblings = mainPerson?.parentId 
    ? familyTree.filter(m => m.parentId === mainPerson.parentId && m.id !== mainPerson.id)
    : [];

  // Get all displayed member IDs to find other relatives
  const displayedMemberIds = new Set([
    ...parents.map(p => p.id),
    mainPerson?.id,
    mainPersonSpouse?.id,
    ...siblings.map(s => s.id),
    ...allChildren.map(c => c.id)
  ].filter(Boolean) as string[]);

  // Get other relatives not in the main structure
  const otherRelatives = familyTree.filter(member => 
    !displayedMemberIds.has(member.id)
  );

  // Member Card Component - Timeline Style
  const MemberCard: React.FC<{ 
    member: FamilyMember; 
    index: number;
    showSpouse?: boolean;
  }> = ({ member, index, showSpouse = true }) => {
    const children = getChildren(member.id);
    const spouse = getSpouse(member.id);
    const hasChildren = children.length > 0;
    const isExpanded = expandedMembers.has(member.id);
    const isHovered = hoveredMember === member.id;
    const isMainPerson = member.id === mainPerson?.id;

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay: index * 0.1 }}
        onMouseEnter={() => setHoveredMember(member.id)}
        onMouseLeave={() => setHoveredMember(null)}
        className="relative"
      >
        {/* Glow effect on hover */}
        {isHovered && (
          <motion.div 
            className={`absolute inset-0 rounded-lg blur-xl opacity-30 ${
              member.isDeceased ? 'bg-gray-400' : 
              isMainPerson ? 'bg-purple-400' : 'bg-amber-400'
            }`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            transition={{ duration: 0.3 }}
          />
        )}

        <div className={`border-2 rounded-xl p-4 sm:p-5 shadow-sm hover:shadow-lg transition-all relative ${
          member.isDeceased 
            ? 'border-gray-300' 
            : isMainPerson 
              ? 'border-purple-400' 
              : 'border-amber-300'
        }`}>
          {/* Member Info Row */}
          <div className="flex items-center gap-3 mb-3">
            {/* Profile Image */}
            <div className={`relative ${
              isMainPerson ? 'w-16 h-16' : 'w-12 h-12'
            } rounded-full overflow-hidden flex-shrink-0 ${
              member.isDeceased ? 'border-2 border-gray-300' : 
              isMainPerson ? 'border-3 border-purple-400' : 'border-2 border-amber-400'
            }`}>
              {member.image ? (
                <img 
                  src={member.image} 
                  alt={member.name} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <User className={`${isMainPerson ? 'w-8 h-8' : 'w-6 h-6'} ${
                    member.isDeceased ? 'text-gray-400' : 
                    isMainPerson ? 'text-purple-500' : 'text-amber-500'
                  }`} />
                </div>
              )}

              {/* Status Badge Overlays */}
              {member.isDeceased && (
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-gray-700 text-white text-xs px-2 py-0.5 rounded-full whitespace-nowrap">
                  ✝
                </div>
              )}
              {isMainPerson && !member.isDeceased && (
                <motion.div 
                  className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full border-2 border-white flex items-center justify-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: "spring" }}
                >
                  <Star className="w-2.5 h-2.5 text-white" />
                </motion.div>
              )}
            </div>

            {/* Name and Relation */}
            <div className="flex-1 min-w-0">
              <h3 className={`font-bold truncate ${
                isMainPerson ? 'text-lg' : 'text-base'
              } ${
                member.isDeceased ? 'text-gray-600' : 
                isMainPerson ? 'text-purple-800' : 'text-gray-900'
              }`}>
                {member.name}
              </h3>
              <p className={`text-xs px-2 py-1 rounded-full inline-block ${
                member.isDeceased 
                  ? 'text-gray-600' 
                  : isMainPerson 
                    ? 'text-purple-700' 
                    : 'text-amber-700'
              }`}>
                {member.relation}
              </p>
            </div>

            {/* Spouse Badge */}
            {spouse && showSpouse && (
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full flex items-center justify-center">
                  <Heart className="w-4 h-4 text-white" />
                </div>
              </div>
            )}
          </div>

          {/* Spouse Info Section */}
          {spouse && showSpouse && (
            <div className="mt-3 pt-3 border-t-2 border-pink-100 -mx-4 -mb-4 px-4 pb-4 rounded-b-xl">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-pink-300">
                  {spouse.image ? (
                    <img src={spouse.image} alt={spouse.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <User className="w-5 h-5 text-pink-600" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm text-gray-800">{spouse.name}</p>
                  <p className="text-xs text-gray-600">{spouse.relation}</p>
                </div>
                <Heart className="w-4 h-4 text-pink-500" />
              </div>
            </div>
          )}

          {/* Children Toggle */}
          {hasChildren && (
            <button
              onClick={(e) => {
                e.stopPropagation(); // Prevent event bubbling
                e.preventDefault(); // Prevent default behavior
                toggleMember(member.id);
              }}
              className="mt-3 w-full flex items-center justify-center gap-2 text-xs text-gray-600 hover:text-amber-600 py-2 border-t border-gray-200 transition-colors"
            >
              <Users className="w-3 h-3" />
              {isExpanded ? 'Hide' : 'Show'} {children.length} child{children.length > 1 ? 'ren' : ''}
              <motion.div
                animate={{ rotate: isExpanded ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <ChevronDown className="w-3 h-3" />
              </motion.div>
            </button>
          )}
        </div>

        {/* Expanded Children Panel */}
        <AnimatePresence>
          {isExpanded && hasChildren && (
            <motion.div
              className="mt-4 ml-8 pl-6 border-l-2 border-amber-300 space-y-3"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              {children.map((child, idx) => (
                <motion.div
                  key={child.id}
                  className="relative"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  {/* Horizontal connection line */}
                  <div className="absolute -left-6 top-1/2 w-6 h-0.5 bg-amber-300"></div>
                  
                  <div className="border border-gray-200 rounded-lg p-3 hover:border-amber-300 transition-colors">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-200">
                        {child.image ? (
                          <img src={child.image} alt={child.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <User className="w-4 h-4 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-semibold truncate ${child.isDeceased ? 'text-gray-500' : 'text-gray-800'}`}>
                          {child.name}
                        </p>
                        <p className="text-xs text-gray-500 truncate">{child.relation}</p>
                      </div>
                      {child.isDeceased && (
                        <span className="text-xs text-gray-500">✝</span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  };

  return (
    <section id="family" className="py-16 sm:py-20 px-3 sm:px-4">
      <div className="max-w-6xl mx-auto">
        {/* Left-aligned Title with Half Underline - matching Timeline */}
        <div className="mb-12 sm:mb-16">
          <h2 className="text-4xl sm:text-5xl font-serif text-gray-800 inline-block relative">
            Family Tree
            <div className="absolute -bottom-2 left-0 w-1/2 h-1 bg-amber-500 rounded-full"></div>
          </h2>
          <p className="text-sm text-gray-600 mt-3">
            {familyTree.length} family member{familyTree.length > 1 ? 's' : ''}
          </p>
        </div>

        <div className="relative">
          {/* Vertical Timeline Line */}
          <div className="absolute left-4 sm:left-1/2 top-0 bottom-0 w-0.5 bg-gray-300 transform sm:-translate-x-1/2"></div>

          <div className="space-y-12 sm:space-y-16">
            {/* Parents Section */}
            {parents.length > 0 && (
              <div className="relative">
                {parents.map((parent, index) => (
                  <div 
                    key={parent.id}
                    className={`relative flex items-center mb-8 ${
                      index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
                    }`}
                  >
                    {/* Side Content */}
                    <div className={`flex-1 ${
                      index % 2 === 0 ? 'pr-8 sm:pr-12' : 'pl-8 sm:pl-12'
                    }`}>
                      <div className={index % 2 === 0 ? 'sm:ml-auto sm:max-w-md' : 'sm:max-w-md'}>
                        <MemberCard member={parent} index={index} />
                      </div>
                    </div>

                    {/* Center Icon */}
                    <div className="flex-shrink-0 relative z-10">
                      <div className="w-10 h-10 sm:w-14 sm:h-14 border-4 border-blue-400 rounded-full flex items-center justify-center shadow-lg">
                        <User className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                      </div>
                    </div>

                    {/* Empty space for alignment */}
                    <div className="flex-1"></div>
                  </div>
                ))}
              </div>
            )}

            {/* Main Person Section - Centered */}
            {mainPerson && (
              <div className="relative">
                <div className="flex items-center">
                  {/* Left side - empty on mobile, content on desktop */}
                  <div className="hidden sm:block flex-1 pr-12">
                    {mainPersonSpouse && (
                      <div className="ml-auto max-w-md">
                        <MemberCard member={mainPersonSpouse} index={0} showSpouse={false} />
                      </div>
                    )}
                  </div>

                  {/* Center - Main Person Icon */}
                  <div className="flex-shrink-0 relative z-10">
                    <motion.div 
                      className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-purple-500 rounded-full flex items-center justify-center shadow-xl"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", delay: 0.2 }}
                    >
                      <Star className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600" />
                    </motion.div>
                  </div>

                  {/* Right side - Main Person Card */}
                  <div className="flex-1 pl-8 sm:pl-12">
                    <div className="max-w-md">
                      <MemberCard member={mainPerson} index={0} />
                    </div>
                  </div>
                </div>

                {/* Mobile Spouse - Below main person */}
                {mainPersonSpouse && isMobile && (
                  <div className="mt-6 pl-16">
                    <MemberCard member={mainPersonSpouse} index={1} showSpouse={false} />
                  </div>
                )}
              </div>
            )}

            {/* Siblings Section */}
            {siblings.length > 0 && (
              <div className="relative">
                {siblings.map((sibling, index) => (
                  <div 
                    key={sibling.id}
                    className={`relative flex items-center mb-8 ${
                      index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
                    }`}
                  >
                    <div className={`flex-1 ${
                      index % 2 === 0 ? 'pr-8 sm:pr-12' : 'pl-8 sm:pl-12'
                    }`}>
                      <div className={index % 2 === 0 ? 'sm:ml-auto sm:max-w-md' : 'sm:max-w-md'}>
                        <MemberCard member={sibling} index={index} />
                      </div>
                    </div>

                    <div className="flex-shrink-0 relative z-10">
                      <div className="w-10 h-10 sm:w-14 sm:h-14 border-4 border-amber-400 rounded-full flex items-center justify-center shadow-lg">
                        <Users className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600" />
                      </div>
                    </div>

                    <div className="flex-1"></div>
                  </div>
                ))}
              </div>
            )}

            {/* Children Section */}
            {allChildren.length > 0 && (
              <div className="relative">
                {allChildren.map((child, index) => (
                  <div 
                    key={child.id}
                    className={`relative flex items-center mb-8 last:mb-0 ${
                      index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
                    }`}
                  >
                    <div className={`flex-1 ${
                      index % 2 === 0 ? 'pr-8 sm:pr-12' : 'pl-8 sm:pl-12'
                    }`}>
                      <div className={index % 2 === 0 ? 'sm:ml-auto sm:max-w-md' : 'sm:max-w-md'}>
                        <MemberCard member={child} index={index} />
                      </div>
                    </div>

                    <div className="flex-shrink-0 relative z-10">
                      <div className="w-10 h-10 sm:w-14 sm:h-14 border-4 border-green-400 rounded-full flex items-center justify-center shadow-lg">
                        <User className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                      </div>
                    </div>

                    <div className="flex-1"></div>
                  </div>
                ))}
              </div>
            )}

            {/* Other Relatives Section - Shows everyone else */}
            {otherRelatives.length > 0 && (
              <div className="relative pt-12">
                <div className="text-center mb-8">
                  <h3 className="text-xl font-serif text-gray-700 inline-block relative">
                    Extended Family
                    <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-gray-300 rounded-full"></div>
                  </h3>
                  <p className="text-sm text-gray-500 mt-2">
                    {otherRelatives.length} additional relative{otherRelatives.length > 1 ? 's' : ''}
                  </p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {otherRelatives.map((relative, index) => (
                    <MemberCard 
                      key={relative.id} 
                      member={relative} 
                      index={index}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Show message if there are no relatives at all */}
            {familyTree.length === 1 && (
              <div className="text-center py-12">
                <p className="text-gray-500">No other family members to display</p>
              </div>
            )}
          </div>
        </div>

        {/* Legend - Simplified */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-gray-600">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full border-2 border-purple-500"></div>
              <span>Memorialized</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full border-2 border-blue-400"></div>
              <span>Parent</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full border-2 border-green-400"></div>
              <span>Child</span>
            </div>
            <div className="flex items-center gap-2">
              <Heart className="w-3 h-3 text-pink-500" />
              <span>Spouse</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-600">✝</span>
              <span>Deceased</span>
            </div>
          </div>
          <p className="text-center text-xs text-gray-500 mt-4 italic">
            {isMobile ? 'Tap to expand children' : 'Click members to see their children'}
          </p>
        </div>
      </div>
    </section>
  );
};
// Enhanced Timeline with Alternating Events
const TimelineSection: React.FC<{ timeline: TimelineEvent[] }> = ({ timeline }) => {
  if (timeline.length === 0) return null;

  const getIcon = (iconType?: string) => {
    switch (iconType) {
      case 'baby': return '👶';
      case 'graduation': return '🎓';
      case 'heart': return '❤️';
      default: return '📍';
    }
  };

  return (
    <section id="timeline" className="py-16 sm:py-20 px-3 sm:px-4">
      <div className="max-w-4xl mx-auto">
        {/* Left-aligned Title with Half Underline - Moved right by 25% */}
        <div className="mb-12 sm:mb-16 -ml-4 sm:-ml-20"> {/* Changed from -ml-40 to -ml-32 (80% of original) */}
          <h2 className="text-4xl sm:text-5xl font-serif text-gray-800 inline-block relative">
            Timeline
            <div className="absolute -bottom-2 left-0 w-1/2 h-1 bg-amber-500"></div>
          </h2>
        </div>
        
        <div className="relative">
          {/* Vertical line passing through icons */}
          <div className="absolute left-4 sm:left-1/2 top-0 bottom-0 w-0.5 bg-gray-300 transform sm:-translate-x-1/2"></div>
          
          {timeline.map((event, index) => {
            const isLeft = index % 2 === 0;
            const isLast = index === timeline.length - 1;
            
            return (
              <div 
                key={event.id} 
                className={`relative flex items-start ${
                  isLast ? 'mb-0' : 'mb-14 sm:mb-20' // Increased spacing: mb-12 to mb-14, mb-16 to mb-20
                } ${isLeft ? 'flex-row' : 'flex-row sm:flex-row-reverse'}`}
              >
                {/* Year and Date Side - Hidden on mobile, alternating on desktop */}
                <div className={`hidden sm:flex flex-1 ${
                  isLeft ? 'pr-10 sm:pr-16' : 'pl-10 sm:pl-16' // Increased padding: pr-8 to pr-10, pr-12 to pr-16
                } ${isLeft ? 'text-right' : 'text-left'}`}>
                  <div>
                    <div className="text-2xl sm:text-3xl font-light text-gray-400 mb-1">
                      {event.year}
                    </div>
                    {event.date && (
                      <div className="text-sm sm:text-base text-gray-500 font-medium">
                        {event.date}
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Center Icon with line passing through */}
                <div className="flex-shrink-0 relative z-10">
                  <div className="w-10 h-10 sm:w-14 sm:h-14 bg-white border-4 border-amber-500 rounded-full flex items-center justify-center text-lg sm:text-xl shadow-lg hover:scale-105 transition-transform duration-200">
                    {event.icon ? getIcon(event.icon) : <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600" />}
                  </div>
                </div>
                
                {/* Content Side - Always on right on mobile, alternating on desktop */}
                <div className={`flex-1 pl-6 sm:pl-0 ${
                  isLeft ? 'sm:pl-10 sm:pl-16' : 'sm:pr-10 sm:pr-16' // Increased padding
                } pb-6 sm:pb-8`}> {/* Increased bottom padding */}
                  <div className="bg-white p-4 sm:p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"> {/* Added card-like container */}
                    {/* Mobile Year - Only visible on mobile */}
                    <div className="sm:hidden mb-4">
                      <div className="text-2xl font-light text-gray-400 mb-1">
                        {event.year}
                      </div>
                      {event.date && (
                        <div className="text-sm text-gray-500 font-medium">
                          {event.date}
                        </div>
                      )}
                    </div>
                    
                    <h3 className="text-lg sm:text-xl font-normal text-amber-500 mb-2 sm:mb-3">
                      {event.title}
                    </h3>
                    
                    {event.description && (
                      <p className="text-gray-700 text-sm sm:text-base leading-relaxed mb-3 sm:mb-4">
                        {event.description}
                      </p>
                    )}
                    
                    {event.location && (
                      <div className="flex items-center gap-2 text-gray-500 text-xs sm:text-sm mt-3">
                        <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span>{event.location}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

// Favorites section - Fixed icon display
const FavoritesSection: React.FC<{ favorites: Favorite[] }> = ({ favorites }) => {
  const [showAll, setShowAll] = useState(false);

  // Simple icon display - handles different icon formats
  const renderIcon = (favorite: Favorite) => {
    // If icon is an emoji string (like '🍕', '🎵', etc.)
    if (favorite.icon && /[\u{1F300}-\u{1F6FF}]/u.test(favorite.icon)) {
      return <span className="text-xl">{favorite.icon}</span>;
    }
    
    // If icon is a string name (like 'music', 'book', etc.)
    const iconName = favorite.icon?.toLowerCase() || '';
    
    // Simple mapping of icon names to emojis
    const iconToEmoji: Record<string, string> = {
      'music': '🎵',
      'film': '🎬',
      'movie': '🎬',
      'book': '📚',
      'food': '🍕',
      'drink': '☕',
      'coffee': '☕',
      'travel': '✈️',
      'globe': '🌍',
      'camera': '📷',
      'tv': '📺',
      'utensils': '🍴',
      'mountain': '⛰️',
      'palette': '🎨',
      'heart': '❤️',
      'star': '⭐',
      'sparkles': '✨',
      'flower': '🌸',
      'sun': '☀️',
      'moon': '🌙',
      'cloud': '☁️',
      'game': '🎮',
      'sport': '⚽',
      'hobby': '🎨',
      'color': '🌈',
      'animal': '🐾',
      'place': '📍',
      'holiday': '🎄',
      'season': '🍂',
      'song': '🎶',
      'memory': '💭',
      'default': '⭐'
    };

    // Try icon name first, then category, then default
    const emoji = iconToEmoji[iconName] || 
                  iconToEmoji[favorite.category?.toLowerCase()] || 
                  '❤️';
    
    return <span className="text-xl">{emoji}</span>;
  };

  if (favorites.length === 0) return null;

  const displayFavorites = showAll ? favorites : favorites.slice(0, 6);

  return (
    <section id="favorites" className="py-16 sm:py-20 px-3 sm:px-4">
      <div className="max-w-6xl mx-auto">
        {/* Updated Header */}
       <div className="mb-8 sm:mb-12">
          {/* Favorites Title with Half Underline */}
          <div className="mb-6 sm:mb-8">
            <h2 className="text-4xl sm:text-5xl font-serif text-gray-800 inline-block relative">
              Favorites
              <div className="absolute -bottom-2 left-0 w-1/2 h-1 bg-amber-500 rounded-full"></div>
            </h2>
            <p className="text-sm text-gray-600 mt-2">{favorites.length} cherished memories</p>
          </div>
        </div>
        
        {/* Grid layout matching your design - 3 columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 sm:gap-x-12 gap-y-8 sm:gap-y-12">
          {displayFavorites.map((fav, index) => (
            <div key={index} className="space-y-3">
              {/* Question line - no icon circle, just text with icon */}
              <div className="flex items-start gap-3">
                <span className="text-lg">
                  {renderIcon(fav)}
                </span>
                <h3 className="text-sm text-amber-600 font-medium leading-snug">
                  {fav.question || `Favorite ${fav.category}`}
                </h3>
              </div>
              
              {/* Answer - with padding to align under question */}
              <p className="text-gray-800 text-base leading-relaxed whitespace-pre-line pl-8">
                {fav.answer}
              </p>
            </div>
          ))}
        </div>

        {/* Show More/Less button */}
        {favorites.length > 6 && (
          <div className="mt-12 text-center">
            <button
              onClick={() => setShowAll(!showAll)}
              className="inline-flex items-center gap-2 text-amber-600 hover:text-amber-700 font-medium"
            >
              {showAll ? (
                <>
                  <ChevronUp className="w-4 h-4" />
                  Show Less
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4" />
                  Show More ({favorites.length - 6} more)
                </>
              )}
            </button>
          </div>
        )}

        {/* Empty state */}
        {favorites.length === 0 && (
          <div className="text-center py-16">
            <Heart className="w-12 h-12 text-amber-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No favorites shared yet
            </h3>
            <p className="text-gray-600">
              Favorite memories and preferences will appear here when added.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};
// Tribute Card Component
const TributeCard: React.FC<{ 
  tribute: Tribute;
  onEdit: (tribute: Tribute) => void;
  onDelete: (tributeId: string) => void;
    currentSessionId: string;
  onLike: (tributeId: string) => void;
  isLiked: boolean;
}> = ({ tribute, onEdit, onDelete, currentSessionId, onLike, isLiked }) => {
  const canModify = tribute.sessionId === currentSessionId;

  return (
    <div className="bg-white p-4 sm:p-6 rounded-xl border border-gray-200 hover:shadow-md transition-all">
        {/* You indicator - positioned at top right */}
      {canModify && (
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
          You
        </div>
      )}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-3">
        <p className="text-gray-500 text-xs sm:text-sm">
          {tribute.date ? new Date(tribute.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }) : 'No date'}
        </p>
        
        <div className="flex items-center gap-3 justify-end">
          <button
            onClick={() => onLike(tribute.id || '')}
            className="flex items-center gap-2 text-gray-500 hover:text-orange-500 transition-colors text-xs sm:text-sm"
          >
            <Heart 
              size={16} 
              className={isLiked ? 'fill-orange-500 text-orange-500' : ''} 
            />
            Like
          </button>

           {canModify && (
  
        <div className="flex items-center gap-2 justify-end">
          <button
            onClick={() => onEdit(tribute)}
            className="p-1.5 text-gray-500 hover:text-orange-500 hover:bg-orange-50 rounded transition-all"
            title="Edit memory"
          >
            <Pencil size={14} />
          </button>
          <button
            onClick={() => onDelete(tribute.id || '')}
            className="p-1.5 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded transition-all"
            title="Delete memory"
          >
            <Trash2 size={14} />
          </button>
        </div>
      )}
        </div>
      </div>

      <p className="text-gray-700 leading-relaxed mb-4 sm:mb-5 text-sm sm:text-base whitespace-pre-line">
        {tribute.message}
      </p>

      {tribute.image && (
        <div className="mb-4">
          <img 
            src={tribute.image} 
            alt="" 
            className="w-24 h-24 object-cover rounded-lg"
          />
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {tribute.isAnonymous ? (
            <div className="flex items-center gap-2 text-gray-500">
              <User className="w-4 h-4" />
              <span className="font-serif italic text-sm sm:text-base">Anonymous</span>
            </div>
          ) : (
            <p className="text-gray-700 font-serif text-sm sm:text-base font-medium">
              {tribute.name || 'Anonymous'}
            </p>
          )}
        </div>
        {tribute.location && (
          <p className="text-gray-400 text-xs sm:text-sm flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            {tribute.location}
          </p>
        )}
      </div>
    </div>
  );
};
// Enhanced service section with virtual link
const ServiceSection: React.FC<{ serviceInfo: ServiceInfo }> = ({ serviceInfo }) => {
  if (!serviceInfo) return null;
  
  const formatFullDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <section id="service" className="py-16 sm:py-20 px-3 sm:px-4 scroll-mt-24">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 sm:mb-12">
          <h2 className="text-4xl sm:text-5xl font-serif text-gray-800 inline-block relative">
            Memorial Service
            <div className="absolute -bottom-2 left-0 w-1/2 h-1 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"></div>
          </h2>
          <p className="text-sm text-gray-600 mt-2">Celebration of life details</p>
        </div>

        {/* Information Grid */}
        <div className="grid md:grid-cols-2 gap-8 sm:gap-12">
          {/* Venue & Location */}
          {serviceInfo.venue && (
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center flex-shrink-0 mt-1">
                  <MapPin className="w-5 h-5 text-orange-500" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Location</h3>
                  <div className="space-y-1">
                    <p className="text-lg text-gray-900 font-medium">
                      {serviceInfo.venue}
                    </p>
                    {serviceInfo.address && (
                      <p className="text-gray-600 leading-relaxed">
                        {serviceInfo.address}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Date & Time */}
          {(serviceInfo.date || serviceInfo.time) && (
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center flex-shrink-0 mt-1">
                  <Calendar className="w-5 h-5 text-orange-500" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">When</h3>
                  <div className="space-y-1">
                    {serviceInfo.date && (
                      <p className="text-lg text-gray-900 font-medium">
                        {formatFullDate(serviceInfo.date)}
                      </p>
                    )}
                    {serviceInfo.time && (
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <p className="text-gray-900 font-medium">
                          {serviceInfo.time}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Virtual Service */}
        {serviceInfo.virtualLink && (
          <div className="mt-12 sm:mt-16 pt-8 sm:pt-12 border-t border-gray-100">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center flex-shrink-0 mt-1">
                    <Video className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">
                      Virtual Service
                    </h3>
                    <p className="text-gray-600 leading-relaxed mb-4 max-w-2xl">
                      Join the memorial service online from anywhere in the world.
                      {serviceInfo.virtualPlatform && (
                        <span className="font-medium text-orange-600 ml-1">
                          (via {serviceInfo.virtualPlatform.charAt(0).toUpperCase() + serviceInfo.virtualPlatform.slice(1)})
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="lg:text-right">
                <a
                  href={serviceInfo.virtualLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 px-6 py-3.5 text-base font-medium text-gray-900 bg-gradient-to-r from-amber-400 to-orange-400 rounded-lg hover:from-amber-500 hover:to-orange-500 transition-all duration-300 shadow-sm hover:shadow-md"
                >
                  <Smartphone className="w-5 h-5" />
                  Join Online Service
                </a>
                <p className="text-xs text-gray-400 mt-3">
                  Opens in new window
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Service Timeline */}
        <div className="mt-12 flex items-center justify-center gap-4">
          {['Arrival', 'Ceremony', 'Reception'].map((step, index) => (
            <div key={step} className="flex flex-col items-center">
              <div className={`w-3 h-3 rounded-full ${
                index === 0 ? 'bg-orange-500' : 'bg-gray-300'
              }`}></div>
              {index < 2 && (
                <div className="w-12 h-0.5 bg-gray-200 mt-1.5"></div>
              )}
              <span className="text-xs text-gray-500 mt-2">{step}</span>
            </div>
          ))}
        </div>

        {/* Additional Info */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            For additional information, please contact the family.
          </p>
        </div>
      </div>
    </section>
  );
};

// Animated Footer with Floating Icons
const MemorialFooter: React.FC<{ memorialName: string }> = ({ memorialName }) => {
  const [iconIndex, setIconIndex] = useState(0);
  const icons = [Heart, Flower2, Sparkles, Star];

  useEffect(() => {
    const interval = setInterval(() => {
      setIconIndex((prev) => (prev + 1) % icons.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [icons.length]);

  const Icon = icons[iconIndex];

  return (
    <footer className="mt-16 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-linear-to-b from-transparent via-amber-50/20 to-amber-100/10"></div>
      
      {/* Floating Icons */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(12)].map((_, i) => {
          const RandIcon = icons[Math.floor(Math.random() * icons.length)];
          return (
            <div
              key={i}
              className="absolute"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 2}s`,
              }}
            >
              <RandIcon className="w-4 h-4 text-amber-300/30" />
            </div>
          );
        })}
      </div>
      
      <div className="relative max-w-4xl mx-auto px-4 py-12 text-center">
        <div className="flex justify-center items-center gap-3 mb-4">
          <div className="animate-pulse">
            <Icon className="w-6 h-6 text-amber-400 fill-amber-400" />
          </div>
          <h3 className="text-2xl font-serif font-bold text-gray-900">
            Forever in our hearts
          </h3>
          <div className="animate-pulse">
            <Icon className="w-6 h-6 text-amber-400 fill-amber-400" />
          </div>
        </div>
        
        <p className="text-gray-600 mb-2">
          {memorialName}'s memory lives on in the hearts of those who loved them
        </p>
        <p className="text-sm text-gray-500">
          {new Date().getFullYear()} • Created with love
        </p>
      </div>
    </footer>
  );
};

// Main Component
export const MemorialDisplayPage: React.FC = () => {
  const { identifier } = useParams<{ identifier: string }>();
  const navigate = useNavigate();
  
  const [memorial, setMemorial] = useState<MemorialData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState('obituary');
  const [showShareModal, setShowShareModal] = useState(false);
  const [showTributeForm, setShowTributeForm] = useState(false);
   const [isScrolled, setIsScrolled] = useState(false); 
  const [isScrollDisabled, setIsScrollDisabled] = useState(false);
   const [currentSessionId, setCurrentSessionId] = useState('');
const [likedMemories, setLikedMemories] = useState<Set<string>>(new Set());
const [editingTribute, setEditingTribute] = useState<Tribute | null>(null);

const fetchMemorial = useCallback(async () => {
  try {
    setLoading(true);
    const response = await fetch(
      `https://wings-of-memories-backend.onrender.com/api/memorials/public/${identifier}`
    );

    if (!response.ok) throw new Error(`Memorial not found`);

    const data = await response.json();
    const memorialData = data.memorial || data;
    
    // Get current session ID for comparison - THIS IS IMPORTANT
    const sessionId = getOrCreateSessionId(identifier || '');
    
    const safeMemorial: MemorialData = {
      id: memorialData.id || '',
      name: memorialData.name || 'Unknown',
      profileImage: memorialData.profileImage || '',
      birthDate: memorialData.birthDate || '',
      deathDate: memorialData.deathDate || '',
      location: memorialData.location || '',
      obituary: memorialData.obituary || '',
      timeline: Array.isArray(memorialData.timeline) ? memorialData.timeline : [],
      favorites: Array.isArray(memorialData.favorites) ? memorialData.favorites : [],
      familyTree: Array.isArray(memorialData.familyTree) ? memorialData.familyTree : [],
      gallery: Array.isArray(memorialData.gallery) ? memorialData.gallery : [],
      serviceInfo: memorialData.serviceInfo || memorialData.service || {},
      service: memorialData.service || memorialData.serviceInfo || {},
      memoryWall: Array.isArray(memorialData.memoryWall) ? memorialData.memoryWall : [],
      memories: Array.isArray(memorialData.memories) ? memorialData.memories : [],
      tributes: Array.isArray(memorialData.tributes || memorialData.memoryWall) 
        ? (memorialData.tributes || memorialData.memoryWall).map((tribute: {
            id: string;
            authorName?: string;
            authorLocation?: string;
            message: string;
            authorImage?: string;
            createdAt?: string;
            sessionId?: string;
            isAnonymous?: boolean;
            name?: string;
            location?: string;
            date?: string;
            image?: string;
          }) => ({
            id: tribute.id,
            name: tribute.authorName || tribute.name || 'Anonymous',
            location: tribute.authorLocation || tribute.location || '',
            message: tribute.message || '',
            image: tribute.authorImage || tribute.image || '',
            date: tribute.createdAt || tribute.date || new Date().toISOString(),
            sessionId: tribute.sessionId,
            isAnonymous: tribute.authorName === 'Anonymous' || tribute.isAnonymous
          }))
        : [],
      isPublished: Boolean(memorialData.isPublished),
      customUrl: memorialData.customUrl || '',
      theme: memorialData.theme || 'default'
    };
    
    setMemorial(safeMemorial);
    // Also set the current session ID for the UI
    setCurrentSessionId(sessionId);
  } catch (err) {
    console.error('Error fetching memorial:', err);
    setError(err instanceof Error ? err.message : 'Failed to load memorial');
  } finally {
    setLoading(false);
  }
}, [identifier]);

  useEffect(() => {
    fetchMemorial();
  }, [fetchMemorial]);

useEffect(() => {
  const handleScroll = () => {
    // Skip scroll detection if we're in the middle of a navigation click
    if (isScrollDisabled) return;
    
    const currentScroll = window.scrollY;
    setIsScrolled(currentScroll > 100);
    
    // Your existing section detection logic...
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  return () => window.removeEventListener('scroll', handleScroll);
}, [isScrollDisabled]); // Add isScrollDisabled to dependencies

// In the useEffect for initializing session ID:
useEffect(() => {
  // Initialize session ID
  if (identifier) {
    const sessionId = getOrCreateSessionId(identifier); // ADD identifier parameter here
    setCurrentSessionId(sessionId);
    console.log('Current Session ID:', sessionId);
  }
}, [identifier]);


const toggleLike = (tributeId: string) => {
  const newLiked = new Set(likedMemories);
  if (newLiked.has(tributeId)) {
    newLiked.delete(tributeId);
  } else {
    newLiked.add(tributeId);
  }
  setLikedMemories(newLiked);
};
const handleEditTribute = (tribute: Tribute) => {
  setEditingTribute(tribute);
  setShowTributeForm(true);
};

const handleDeleteTribute = async (tributeId: string) => {
  if (!window.confirm('Are you sure you want to delete this memory?')) return;

  try {
    const sessionId = getOrCreateSessionId(identifier || ''); // FIX: Pass identifier parameter
    
    const response = await fetch(
      `https://wings-of-memories-backend.onrender.com/api/memorials/public/${identifier}/tributes/${tributeId}`,
      {
        method: 'DELETE',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ sessionId })
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      if (response.status === 403) {
        alert('You can only delete your own memories.');
        return;
      }
      throw new Error(`Failed to delete tribute: ${errorData.error || 'Unknown error'}`);
    }
    
    // Refresh tributes
    fetchMemorial();
    alert('Memory deleted successfully');
    
  } catch (error) {
    console.error('Error deleting tribute:', error);
    alert(error instanceof Error ? error.message : 'Failed to delete tribute. Please try again.');
  }
};

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Unknown';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        month: 'long', day: 'numeric', year: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const calculateAge = (birthDate?: string, deathDate?: string) => {
    if (!birthDate || !deathDate) return null;
    try {
      const birth = new Date(birthDate);
      const death = new Date(deathDate);
      let age = death.getFullYear() - birth.getFullYear();
      const monthDiff = death.getMonth() - birth.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && death.getDate() < birth.getDate())) {
        age--;
      }
      return age;
    } catch {
      return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-amber-200 border-t-amber-400 rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Heart className="w-6 h-6 text-amber-400 animate-pulse" />
            </div>
          </div>
          <p className="mt-4 text-gray-600 text-sm">Loading precious memories...</p>
        </div>
      </div>
    );
  }

  if (error || !memorial) {
    return (
      <div className="min-h-screen bg-linear-to-b from-white to-amber-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 bg-linear-to-r from-amber-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart className="w-10 h-10 text-amber-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Memorial Not Found</h2>
          <p className="text-gray-600 mb-8">
            We couldn't find the memorial you're looking for. It may have been moved or is no longer available.
          </p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-amber-400 hover:bg-amber-500 text-gray-900 rounded-lg transition-all font-medium"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  const memorialUrl = `${window.location.origin}/memorial/${memorial.customUrl || memorial.id}`;
  const age = calculateAge(memorial.birthDate, memorial.deathDate);
  const serviceInfo = memorial.service || memorial.serviceInfo;

  const navigationItems = [
    { id: 'obituary', label: 'Life Story', icon: BookOpen },
    { id: 'timeline', label: 'Timeline', icon: Clock },
    { id: 'favorites', label: 'Favorites', icon: Heart },
    { id: 'gallery', label: 'Gallery', icon: ImageIcon },
    { id: 'tributes', label: 'Tributes', icon: MessageCircle },
    { id: 'family', label: 'Family', icon: Users },
    { id: 'service', label: 'Service', icon: Calendar }
  ];



  return (
    <div className="min-h-screen bg-white">
{/* REDESIGNED HEADER - Modern & Warm */}
<div className="min-h-screen bg-gray-50">

  {/* HEADER WITH WARM BACKGROUND IMAGE */}
  <header className={`sticky top-0 z-40 transition-all duration-500 ${
    isScrolled 
      ? 'bg-white shadow-md' 
      : 'relative bg-gray-900'
  }`}>
    
    {/* Background Image Layer - FIXED: Now uses opacity transition to prevent flicker */}
    <div className={`absolute inset-0 z-0 overflow-hidden transition-opacity duration-700 ${
      isScrolled ? 'opacity-0 pointer-events-none' : 'opacity-100'
    }`}>
      {/* Warm memorial background image with better gradient */}
      <div 
        className="absolute inset-0 w-full h-full"
        style={{
          backgroundImage: `url("https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=2000")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* Improved overlay with your color scheme */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-orange-950/60"></div>
      </div>
    </div>
    
    {/* Container with dynamic padding */}
    <div className={`relative z-10 max-w-7xl mx-auto px-4 sm:px-6 transition-all duration-500 ${
      isScrolled ? 'py-4' : 'py-16 md:py-24'
    }`}>
      
      {/* Main flex container */}
      <div className={`flex items-center transition-all duration-500 ${
        isScrolled 
          ? 'gap-4 justify-start'
          : 'gap-8 md:gap-12 justify-center'
      }`}>
        
        {/* Profile Image with smooth transitions */}
        <div className="relative flex-shrink-0">
          {memorial.profileImage ? (
            <img
              src={memorial.profileImage}
              alt={memorial.name}
              className={`object-cover shadow-2xl transition-all duration-500 ease-in-out ${
                isScrolled 
                  ? 'w-12 h-12 rounded-full border-2 border-orange-500'
                  : 'w-40 h-52 md:w-48 md:h-64 rounded-2xl border-4 border-orange-500 shadow-orange-500/20'
              }`}
              style={{ willChange: 'transform, width, height' }}
            />
          ) : (
            <div className={`bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center shadow-2xl transition-all duration-500 ease-in-out ${
                isScrolled 
                  ? 'w-12 h-12 rounded-full border-2 border-orange-500'
                  : 'w-40 h-52 md:w-48 md:h-64 rounded-2xl border-4 border-orange-500 shadow-orange-500/20'
            }`}>
              <User className={`text-orange-400 transition-all duration-500 ${
                isScrolled ? 'w-6 h-6' : 'w-16 h-16 md:w-20 md:h-20'
              }`} />
            </div>
          )}
        </div>

        {/* Text content with smooth transitions */}
        <div className={`transition-all duration-500 ${
          isScrolled ? 'flex-1' : ''
        }`}>
          
          {/* Name - Smooth animation */}
          <h1 className={`font-serif transition-all duration-500 ease-in-out ${
            isScrolled 
              ? 'text-lg text-gray-900 font-semibold'
              : 'text-4xl md:text-5xl lg:text-6xl text-white font-bold drop-shadow-2xl mb-8'
          }`}
          style={{ willChange: 'font-size, color' }}>
            {memorial.name}
          </h1>
          
          {/* Dates & Location - TIMELINE STYLE WITHOUT CARD */}
          <div className={`transition-all duration-700 ease-in-out ${
            isScrolled 
              ? 'opacity-0 max-h-0 overflow-hidden' 
              : 'opacity-100 max-h-96'
          }`}>
            <div className="space-y-6 relative pl-8 border-l-4 border-orange-500">
              
              {/* Birth Date - TIMELINE ITEM with staggered animation - NOW USES REAL DATA */}
              <div className="relative animate-fade-in" style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
                {/* Timeline dot */}
                <div className="absolute -left-10 top-1 w-4 h-4 rounded-full bg-orange-500 ring-4 ring-orange-500/30"></div>
                
                <div className="flex items-center gap-3 mb-1">
                  <Calendar className="w-5 h-5 text-orange-400" />
                  <span className="text-orange-400 text-sm font-bold uppercase tracking-widest">Born</span>
                </div>
                <p className="text-3xl md:text-4xl text-white font-bold tracking-tight">
                  {formatDate(memorial.birthDate)}
                </p>
              </div>
              
              {/* Connecting line animation */}
              <div className="absolute left-0 w-0.5 h-6 bg-gradient-to-b from-orange-500/50 to-transparent -ml-0.5 animate-fade-in" style={{ animationDelay: '0.3s', animationFillMode: 'both' }}></div>
              
              {/* Sunset Date - TIMELINE ITEM with staggered animation - NOW USES REAL DATA */}
              <div className="relative animate-fade-in" style={{ animationDelay: '0.5s', animationFillMode: 'both' }}>
                {/* Timeline dot */}
                <div className="absolute -left-10 top-1 w-4 h-4 rounded-full bg-white ring-4 ring-white/30"></div>
                
                <div className="flex items-center gap-3 mb-1">
                  <Calendar className="w-5 h-5 text-white" />
                  <span className="text-white/80 text-sm font-bold uppercase tracking-widest">Sunset</span>
                </div>
                <p className="text-3xl md:text-4xl text-white font-bold tracking-tight">
                  {formatDate(memorial.deathDate)}
                </p>
              </div>
              
              {/* Age Display - REDESIGNED with PROPER NULL CHECK */}
              {age !== null && age > 0 && (
                <div className="relative animate-fade-in pt-2" style={{ animationDelay: '0.7s', animationFillMode: 'both' }}>
                  <div className="flex items-center gap-2 px-4 py-3 bg-orange-500/20 rounded-lg border-l-4 border-orange-500 backdrop-blur-sm">
                    <Sparkles className="w-5 h-5 text-orange-400" />
                    <p className="text-white text-lg md:text-xl font-medium">
                      <span className="font-bold text-orange-400 text-2xl">{age}</span> years of beautiful memories
                    </p>
                  </div>
                </div>
              )}
              
              {/* Location - TIMELINE ITEM with staggered animation */}
              {memorial.location && (
                <div className="relative animate-fade-in pt-4" style={{ animationDelay: '0.9s', animationFillMode: 'both' }}>
                  {/* Timeline dot */}
                  <div className="absolute -left-10 top-5 w-4 h-4 rounded-full bg-gray-300 ring-4 ring-gray-300/30"></div>
                  
                  <div className="flex items-center gap-3 mb-1">
                    <MapPin className="w-5 h-5 text-gray-300" />
                    <span className="text-gray-300 text-sm font-bold uppercase tracking-widest">Resting Place</span>
                  </div>
                  <p className="text-2xl md:text-3xl text-white font-bold tracking-tight">
                    {memorial.location}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>

  {/* CLEAN NAVIGATION */}
<nav className={`sticky z-30 bg-white border-b border-gray-200 transition-all duration-300 ${
  isScrolled ? 'top-[88px]' : 'top-0'
}`}>
  <div className="max-w-7xl mx-auto px-4">
    <div className="flex justify-center">
      <div className="flex gap-1 py-3 overflow-x-auto scrollbar-hide scroll-smooth" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => {
                // Disable scroll detection temporarily
                setIsScrollDisabled(true);
                setActiveSection(item.id);
                
                const element = document.getElementById(item.id);
                if (element) {
                  const offset = isScrolled ? 180 : 90;
                  const elementPosition = element.getBoundingClientRect().top;
                  const offsetPosition = elementPosition + window.pageYOffset - offset;
                  
                  window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                  });
                }
                
                // Re-enable scroll detection after animation completes
                setTimeout(() => setIsScrollDisabled(false), 1000);
              }}
              className={`relative flex items-center gap-2 px-4 md:px-6 py-3 text-sm md:text-base font-medium whitespace-nowrap transition-all duration-300 ${
                isActive
                  ? 'text-orange-600'
                  : 'text-gray-600 hover:text-orange-600'
              }`}
            >
              <Icon className={`w-4 h-4 md:w-5 md:h-5 transition-all duration-300 ${
                isActive ? 'scale-110' : ''
              }`} />
              <span>{item.label}</span>
              
              <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-orange-600 transition-all duration-300 ${
                isActive ? 'opacity-100' : 'opacity-0'
              }`}></div>
            </button>
          );
        })}
      </div>
    </div>
  </div>
</nav>
{/* Main Content */}
<main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
  <div className="space-y-8">
    {/* Obituary Section */}
        {/* Obituary Section */}
    <section id="obituary" className="animate-fadeIn scroll-mt-2">
  <div className="py-16 sm:py-20 px-3 sm:px-4">
    <div className="max-w-6xl mx-auto">
      {/* Header matching Favorites style */}
      <div className="mb-8 sm:mb-12">
        {/* Life Story Title with Half Underline */}
        <div className="mb-6 sm:mb-8">
          <h2 className="text-4xl sm:text-5xl font-serif text-gray-800 inline-block relative">
            Life Story
            <div className="absolute -bottom-2 left-0 w-1/2 h-1 bg-amber-500 rounded-full"></div>
          </h2>
          <p className="text-sm text-gray-600 mt-2">A celebration of life</p>
        </div>
      </div>
      
      <div className="prose prose-lg max-w-none">
        {memorial.obituary ? (
          <div className="text-gray-700 leading-relaxed space-y-6">
            {memorial.obituary.split('\n\n').map((paragraph, idx) => (
              <p 
                key={idx} 
                className={`text-lg leading-8 ${
                  idx === 0 
                    ? 'first-letter:text-7xl first-letter:font-serif first-letter:font-bold first-letter:text-amber-600 first-letter:float-left first-letter:leading-none first-letter:mr-3 first-letter:mt-1' 
                    : ''
                }`}
              >
                {paragraph}
              </p>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 italic text-center py-8">No life story available</p>
        )}
      </div>
    </div>
  </div>
</section>
          {/* Timeline Section */}
          {memorial.timeline.length > 0 && (
            <TimelineSection timeline={memorial.timeline} />
          )}

          {/* Favorites Section */}
          {memorial.favorites.length > 0 && (
            <FavoritesSection favorites={memorial.favorites} />
          )}

          {/* Gallery Section */}
          {memorial.gallery.length > 0 && (
            <GallerySection gallery={memorial.gallery} />
          )}

          {/* Tributes Section */}
        {/* Tributes Section */}
<section id="tributes" className="animate-fadeIn scroll-mt-24 py-16 sm:py-20 px-3 sm:px-4">
  <div className="max-w-6xl mx-auto">
    {/* Header matching other sections */}
    <div className="mb-8 sm:mb-12">
      <div className="mb-6 sm:mb-8">
        <h2 className="text-4xl sm:text-5xl font-serif text-gray-800 inline-block relative">
          Memory Wall
          <div className="absolute -bottom-2 left-0 w-1/2 h-1 bg-amber-500 rounded-full"></div>
        </h2>
        <p className="text-sm text-gray-600 mt-2">
          {memorial.tributes.length} memory{memorial.tributes.length !== 1 ? 'ies' : ''} shared
        </p>
      </div>
    </div>

    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
      <div>
        <button
          onClick={() => {
            setEditingTribute(null);
            setShowTributeForm(true);
          }}
          className="bg-orange-400 text-white px-4 py-2.5 rounded-lg hover:bg-orange-500 transition-colors flex items-center gap-2 text-sm font-medium"
        >
          Contribute →
        </button>
      </div>
    </div>

    {showTributeForm && (
      <TributeForm
        memorialName={memorial.name}
        onSuccess={() => {
          fetchMemorial();
          setShowTributeForm(false);
          setEditingTribute(null);
        }}
        onCancel={() => {
          setShowTributeForm(false);
          setEditingTribute(null);
        }}
        editingTribute={editingTribute}
        isEdit={!!editingTribute}
        identifier={identifier || ''}
      />
    )}

    {memorial.tributes.length > 0 ? (
      <div className="space-y-6 sm:space-y-8">
        {memorial.tributes.map((tribute) => (
          <div key={tribute.id} className="pb-6 sm:pb-8 border-b border-gray-100 last:border-b-0 last:pb-0">
            <TributeCard
              tribute={tribute}
              onEdit={handleEditTribute}
              onDelete={handleDeleteTribute}
              currentSessionId={currentSessionId}
              onLike={toggleLike}
              isLiked={likedMemories.has(tribute.id || '')}
            />
          </div>
        ))}
      </div>
    ) : (
      <div className="text-center py-16 bg-gray-50/50 rounded-xl">
        <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No memories yet</h3>
        <p className="text-gray-600 mb-6">Be the first to share a memory of {memorial.name}</p>
        <button
          onClick={() => setShowTributeForm(true)}
          className="px-6 py-2.5 bg-orange-400 hover:bg-orange-500 text-white rounded-lg transition-all font-medium"
        >
          Share Your Memory
        </button>
      </div>
    )}
  </div>
</section>

          {/* Family Tree Section */}
          <FamilyTreeSection familyTree={memorial.familyTree} />

          {/* Service Section */}
          {serviceInfo && (serviceInfo.venue || serviceInfo.date) && (
  <ServiceSection serviceInfo={serviceInfo} />
)}
        </div>
      </main>

      {/* Footer */}
      <MemorialFooter memorialName={memorial.name} />

      {/* Floating Action Buttons */}
      <div className="fixed right-4 bottom-4 z-40 flex flex-col gap-3">
    
        <button
          onClick={() => setShowShareModal(true)}
          className="group w-14 h-14 bg-white border border-gray-300 text-gray-700 rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center"
          title="Share"
        >
          <Share2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
        </button>
      </div>

      {/* Share Modal */}
      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        memorialUrl={memorialUrl}
        memorialName={memorial.name}
      />
    </div>
    </div>
  );
};