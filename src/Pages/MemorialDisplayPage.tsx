import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Calendar, MapPin, Heart, Users, Image as ImageIcon, 
  MessageCircle, Clock, Share2, X, ChevronLeft, 
  ChevronRight, BookOpen, 
  Facebook, Twitter, Mail, Link, MessageSquare,
  Check, User, Star,
  ChevronDown,
   ChevronUp, 
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
  spouse?: string | null; 
   parentId?: string | null;
  birthYear?: string | number;
  deathYear?: string | number;
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
    <label className="block text-gray-700 mb-2 text-sm font-medium">Your First Name *</label>
    <input
      type="text"
      value={formData.name}
      onChange={(e) => {
        // Only allow letters, spaces, hyphens, and apostrophes
        const value = e.target.value;
        // Extract only the first word (first name)
        const firstName = value.trim().split(/\s+/)[0];
        setFormData({ ...formData, name: firstName });
      }}
      className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-400 text-sm sm:text-base"
      placeholder="Enter your first name only"
      maxLength={20}
      required={!formData.isAnonymous}
    />
    <p className="text-xs text-gray-500 mt-1">Only your first name will be displayed</p>
  </div>
)}

        <div>
          <label className="block text-gray-700 mb-2 text-sm font-medium">Location </label>
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
  <div className="fixed inset-0 bg-black z-50 flex items-center justify-center p-4">
    {/* Close Button */}
    <button
      onClick={closeSlideshow}
      className="absolute top-4 sm:top-6 right-4 sm:right-6 text-white hover:text-gray-300 transition-colors z-20 bg-black/50 rounded-full p-2 hover:bg-black/70"
    >
      <X size={28} />
    </button>

    {/* Navigation Buttons - Always visible */}
    <button
      onClick={(e) => {
        e.stopPropagation();
        prevSlide();
      }}
      className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 z-20 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white p-3 sm:p-4 rounded-full transition-all hover:scale-110"
      aria-label="Previous image"
    >
      <ChevronLeft size={32} className="sm:w-12 sm:h-12" />
    </button>

    <button
      onClick={(e) => {
        e.stopPropagation();
        nextSlide();
      }}
      className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 z-20 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white p-3 sm:p-4 rounded-full transition-all hover:scale-110"
      aria-label="Next image"
    >
      <ChevronRight size={32} className="sm:w-12 sm:h-12" />
    </button>

    {/* Main Image Container - Fixed for better display */}
    <div className="relative w-full h-full flex flex-col items-center justify-center px-4 sm:px-24 py-20 sm:py-24">
      <div className="relative max-w-6xl max-h-[70vh] w-full flex items-center justify-center">
        <img
          src={gallery[currentSlide]?.url}
          alt={gallery[currentSlide]?.caption || `Slide ${currentSlide + 1}`}
          className="max-w-full max-h-[70vh] w-auto h-auto object-contain rounded-lg shadow-2xl"
          style={{ display: 'block' }}
        />
      </div>
      
      {/* Image Info */}
      {(gallery[currentSlide]?.category || gallery[currentSlide]?.caption) && (
        <div className="mt-6 text-center max-w-3xl">
          <div className="bg-black/60 backdrop-blur-md rounded-xl p-4 sm:p-6 inline-block">
            {gallery[currentSlide]?.category && (
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
                {gallery[currentSlide].category}
              </h3>
            )}
            {gallery[currentSlide]?.caption && (
              <p className="text-gray-200 text-sm sm:text-base leading-relaxed">
                {gallery[currentSlide].caption}
              </p>
            )}
          </div>
        </div>
      )}
    </div>

    {/* Controls Bar */}
    <div className="absolute bottom-6 sm:bottom-8 left-1/2 transform -translate-x-1/2 flex items-center gap-4 z-20">
      <button
        onClick={() => setIsPlaying(!isPlaying)}
        className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-5 sm:px-7 py-2.5 sm:py-3 rounded-full transition-all flex items-center gap-2.5 text-sm sm:text-base font-medium shadow-lg"
      >
        {isPlaying ? (
          <>
            <Pause size={18} />
            <span>Pause</span>
          </>
        ) : (
          <>
            <Play size={18} />
            <span>Play</span>
          </>
        )}
      </button>
      <div className="text-white text-base sm:text-lg font-medium bg-black/40 px-4 py-2 rounded-full backdrop-blur-sm">
        {currentSlide + 1} / {gallery.length}
      </div>
    </div>

    {/* Progress Dots */}
    <div className="absolute bottom-24 sm:bottom-28 left-1/2 -translate-x-1/2 flex gap-2 z-20">
      {gallery.slice(0, Math.min(gallery.length, 10)).map((_, idx) => (
        <button
          key={idx}
          onClick={() => setCurrentSlide(idx)}
          className={`transition-all duration-300 rounded-full ${
            idx === currentSlide
              ? 'w-8 sm:w-10 h-2 bg-white'
              : 'w-2 h-2 bg-white/40 hover:bg-white/60'
          }`}
          aria-label={`Go to image ${idx + 1}`}
        />
      ))}
      {gallery.length > 10 && (
        <span className="text-white/70 text-xs ml-2 self-center">
          +{gallery.length - 10}
        </span>
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
import { motion } from 'framer-motion';

const FamilyTreeSection: React.FC<{ familyTree: FamilyMember[] }> = ({ familyTree }) => {
  const [hoveredMember, setHoveredMember] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Check for mobile screen
  useEffect(() => {
    const checkMobile = () => {
      const isMobileDevice = window.innerWidth < 768;
      setIsMobile(isMobileDevice);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (familyTree.length === 0) {
    return (
      <section id="family" className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8 sm:mb-12">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-gray-800 inline-block relative">
              Family Tree
              <div className="absolute -bottom-2 left-0 w-1/2 h-1 bg-amber-500 rounded-full"></div>
            </h2>
            <p className="text-sm text-gray-600 mt-3">
              Family information coming soon
            </p>
          </div>
          <div className="text-center py-12 bg-gray-50 rounded-xl">
            <p className="text-gray-500">No family members to display yet.</p>
          </div>
        </div>
      </section>
    );
  }

  // Organize family members into generations
  const organizeFamilyTree = () => {
    let mainPerson = familyTree.find(m => 
      m.relation?.toLowerCase() === 'memorialized' || 
      m.relation?.toLowerCase() === 'self'
    );

    if (!mainPerson) {
      mainPerson = familyTree.find(m => m.isDeceased);
    }

    if (!mainPerson) {
      mainPerson = familyTree[0];
    }

    const generations = {
      parents: [] as FamilyMember[],
      main: [] as FamilyMember[],
      spouse: [] as FamilyMember[],
      siblings: [] as FamilyMember[],
      children: [] as FamilyMember[],
      grandchildren: [] as FamilyMember[],
      others: [] as FamilyMember[]
    };

    familyTree.forEach(member => {
      const relation = member.relation?.toLowerCase() || '';
      
      if (member.id === mainPerson?.id) {
        generations.main.push(member);
      } 
      else if (relation.includes('spouse') || relation.includes('partner') || relation.includes('husband') || relation.includes('wife')) {
        generations.spouse.push(member);
      }
      else if (relation.includes('daughter') || relation.includes('son') || relation.includes('child')) {
        generations.children.push(member);
      }
      else if (relation.includes('grand')) {
        generations.grandchildren.push(member);
      }
      else if (relation.includes('sister') || relation.includes('brother') || relation.includes('sibling')) {
        generations.siblings.push(member);
      }
      else if (relation.includes('mother') || relation.includes('father') || relation.includes('parent')) {
        generations.parents.push(member);
      }
      else {
        generations.others.push(member);
      }
    });

    return { mainPerson, generations };
  };

  const { mainPerson, generations } = organizeFamilyTree();

  // Member Card Component
  const MemberCard: React.FC<{ 
    member: FamilyMember;
    isMain?: boolean;
    generation?: string;
  }> = ({ member, isMain = false, generation = '' }) => {
    const isHovered = hoveredMember === member.id;
    const isDeceased = member.isDeceased;

    // Color scheme based on generation - REMOVED BG COLORS
    const colorScheme = {
      parent: { border: 'border-blue-400', text: 'text-blue-700', badge: 'bg-blue-500' },
      main: { border: 'border-purple-500', text: 'text-purple-800', badge: 'bg-purple-600' },
      spouse: { border: 'border-pink-400', text: 'text-pink-700', badge: 'bg-pink-500' },
      child: { border: 'border-green-400', text: 'text-green-700', badge: 'bg-green-500' },
      grandchild: { border: 'border-amber-400', text: 'text-amber-700', badge: 'bg-amber-500' },
      default: { border: 'border-gray-300', text: 'text-gray-700', badge: 'bg-gray-500' }
    };

    const colors = isMain ? colorScheme.main :
                   generation === 'spouse' ? colorScheme.spouse :
                   generation === 'child' ? colorScheme.child :
                   generation === 'parent' ? colorScheme.parent :
                   generation === 'grandchild' ? colorScheme.grandchild :
                   colorScheme.default;

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        whileHover={{ scale: isMobile ? 1 : 1.03 }}
        onMouseEnter={() => !isMobile && setHoveredMember(member.id)}
        onMouseLeave={() => !isMobile && setHoveredMember(null)}
        className="relative"
      >
        <div className={`relative bg-white rounded-xl sm:rounded-2xl p-3 sm:p-5 shadow-sm hover:shadow-md transition-all duration-300 border-2 ${colors.border} ${
          isHovered && !isMobile ? 'ring-2 ring-opacity-30' : ''
        } ${isMain ? 'ring-purple-200' : ''}`}>
          
          {/* Generation Badge - Smaller on mobile */}
          <div className={`absolute -top-2 sm:-top-3 -right-2 sm:-right-3 ${colors.badge} text-white px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold shadow-sm sm:shadow-lg flex items-center gap-1`}>
            {isMain ? '★' : 
             generation === 'spouse' ? '❤️' : 
             generation === 'child' ? '👶' :
             generation === 'parent' ? '👨‍👩' :
             generation === 'grandchild' ? '🌟' :
             '👤'}
            <span className="hidden sm:inline">
              {isMain ? ' Memorial' : 
               generation === 'spouse' ? ' Spouse' : 
               generation === 'child' ? ' Child' :
               generation === 'parent' ? ' Parent' :
               generation === 'grandchild' ? ' Grand' :
               ''}
            </span>
          </div>

          {/* Deceased Ribbon - Smaller on mobile */}
          {isDeceased && (
            <div className="absolute -top-1.5 sm:-top-2 left-1/2 -translate-x-1/2 bg-gray-800 text-white px-2 sm:px-4 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold shadow-sm sm:shadow-lg flex items-center gap-1 sm:gap-1.5 z-10">
              <span className="text-xs sm:text-sm">✝</span>
              <span className="hidden sm:inline">In Memory</span>
            </div>
          )}

          {/* Profile Image or Placeholder */}
          <div className="flex flex-col items-center mt-1 sm:mt-2">
            <div className={`relative mb-2 sm:mb-4 ${isMain ? 'w-16 h-16 sm:w-28 sm:h-28' : 'w-14 h-14 sm:w-24 sm:h-24'}`}>
              <div className={`w-full h-full rounded-full overflow-hidden border-2 sm:border-4 ${colors.border} shadow-sm sm:shadow-lg ${
                isDeceased ? 'opacity-75 grayscale' : ''
              }`}>
                {member.image ? (
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className={`w-full h-full flex flex-col items-center justify-center ${
                    isDeceased ? 'bg-gray-100' : 'bg-gray-50'
                  }`}>
                    {isDeceased ? (
                      <>
                        <div className="text-xl sm:text-3xl mb-0.5 sm:mb-1">🕊️</div>
                        <div className="text-[8px] sm:text-xs text-gray-500 font-medium hidden sm:block">Rest in Peace</div>
                      </>
                    ) : (
                      <User className={`w-6 h-6 sm:w-10 sm:h-10 ${colors.text} opacity-60`} />
                    )}
                  </div>
                )}
              </div>
              
              {/* Relationship Indicator Ring - Hidden on mobile */}
              {isMain && !isMobile && (
                <div className="absolute inset-0 rounded-full border-2 sm:border-4 border-purple-400 animate-pulse"></div>
              )}
            </div>

            {/* Name and Details */}
            <div className="text-center w-full">
              <h3 className={`font-bold mb-1 ${isMain ? 'text-base sm:text-xl' : 'text-sm sm:text-lg'} ${
                isDeceased ? 'text-gray-700' : colors.text
              } line-clamp-2`}>
                {member.name}
              </h3>
              
              {/* Relation Badge - Smaller on mobile */}
              <div className={`inline-flex items-center gap-1 px-2 sm:px-3 py-0.5 sm:py-1.5 rounded-full text-[10px] sm:text-sm font-semibold ${
                isDeceased ? 'bg-gray-100 text-gray-600' : 'bg-white text-gray-700'
              } border ${colors.border}`}>
                {generation === 'spouse' && <Heart className="w-2 h-2 sm:w-3 sm:h-3" />}
                {generation === 'child' && <Users className="w-2 h-2 sm:w-3 sm:h-3" />}
                {member.relation}
              </div>

              {/* Additional Info - Hidden on mobile if no space */}
              {member.birthYear && (
                <p className="text-[10px] sm:text-xs text-gray-500 mt-1 sm:mt-2">
                  {isDeceased && member.deathYear 
                    ? `${member.birthYear} - ${member.deathYear}`
                    : `Born ${member.birthYear}`
                  }
                </p>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <section id="family" className="py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header - Mobile optimized */}
        <div className="mb-6 sm:mb-10 text-center">
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-serif text-gray-800 inline-block relative">
            Family Tree
            <div className="absolute -bottom-1 sm:-bottom-2 left-0 w-1/2 h-0.5 sm:h-1 bg-amber-500 rounded-full"></div>
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 mt-2 sm:mt-4">
            {familyTree.length} family member{familyTree.length > 1 ? 's' : ''} • Showing generational relationships
          </p>
        </div>

        {/* Family Tree Visualization */}
        <div className="relative">
          <div className="space-y-6 sm:space-y-10 lg:space-y-14">
            
            {/* Parents Generation */}
            {generations.parents.length > 0 && (
              <div className="relative">
                <div className="text-center mb-4 sm:mb-6">
                  <div className="inline-flex items-center gap-1 sm:gap-2 px-3 py-1 sm:px-4 sm:py-2 rounded-full">
                    <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-blue-500"></div>
                    <h3 className="text-xs sm:text-base font-bold text-blue-800">Parents</h3>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 max-w-md sm:max-w-xl mx-auto">
                  {generations.parents.map((parent) => (
                    <MemberCard 
                      key={parent.id} 
                      member={parent} 
                      generation="parent"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Main & Spouse Generation */}
            <div className="relative">
              <div className="text-center mb-4 sm:mb-6">
                <div className="inline-flex items-center gap-1 sm:gap-2 px-3 py-1 sm:px-4 sm:py-2 rounded-full">
                  <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-purple-500"></div>
                  <h3 className="text-xs sm:text-base font-bold text-purple-800">Primary Generation</h3>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-4 lg:gap-6">
                {/* Main Person */}
                {mainPerson && (
                  <div className="w-full sm:w-auto max-w-[180px] sm:max-w-xs">
                    <MemberCard 
                      member={mainPerson} 
                      isMain={true}
                    />
                  </div>
                )}

                {/* Marriage Connection - Simplified for mobile */}
                {generations.spouse.length > 0 && (
                  <>
                    {/* Desktop: Horizontal line with heart */}
                    <div className="hidden sm:flex items-center px-3 sm:px-4">
                      <div className="flex items-center gap-1 sm:gap-2">
                        <div className="w-6 sm:w-8 lg:w-16 h-0.5 bg-pink-300"></div>
                        <div className="bg-pink-50 p-1.5 sm:p-2 rounded-full">
                          <Heart className="w-3 h-3 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-pink-500 fill-pink-400" />
                        </div>
                        <div className="w-6 sm:w-8 lg:w-16 h-0.5 bg-pink-300"></div>
                      </div>
                    </div>
                    
                    {/* Mobile: Simple heart icon */}
                    <div className="sm:hidden">
                      <div className="bg-pink-50 p-1.5 rounded-full">
                        <Heart className="w-4 h-4 text-pink-500 fill-pink-400" />
                      </div>
                    </div>
                    
                    {/* Spouse(s) */}
                    <div className="w-full sm:w-auto max-w-[180px] sm:max-w-xs flex flex-col gap-3 sm:gap-4">
                      {generations.spouse.map((spouse) => (
                        <MemberCard 
                          key={spouse.id} 
                          member={spouse} 
                          generation="spouse"
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Siblings - Mobile optimized */}
              {generations.siblings.length > 0 && (
                <div className="mt-6 sm:mt-8">
                  <div className="text-center mb-3 sm:mb-4">
                    <h4 className="text-xs sm:text-sm font-semibold text-gray-600 inline-block px-3 py-1 rounded-full">
                      Siblings
                    </h4>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 max-w-2xl sm:max-w-4xl mx-auto">
                    {generations.siblings.map((sibling) => (
                      <MemberCard 
                        key={sibling.id} 
                        member={sibling}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Children Generation */}
            {generations.children.length > 0 && (
              <div className="relative">
                <div className="text-center mb-4 sm:mb-6">
                  <div className="inline-flex items-center gap-1 sm:gap-2 px-3 py-1 sm:px-4 sm:py-2 rounded-full">
                    <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-green-500"></div>
                    <h3 className="text-xs sm:text-base font-bold text-green-800">Children</h3>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                  {generations.children.map((child) => (
                    <MemberCard 
                      key={child.id} 
                      member={child} 
                      generation="child"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Grandchildren Generation */}
            {generations.grandchildren.length > 0 && (
              <div className="relative">
                <div className="text-center mb-4 sm:mb-6">
                  <div className="inline-flex items-center gap-1 sm:gap-2 px-3 py-1 sm:px-4 sm:py-2 rounded-full">
                    <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-amber-500"></div>
                    <h3 className="text-xs sm:text-base font-bold text-amber-800">Grandchildren</h3>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                  {generations.grandchildren.map((grandchild) => (
                    <MemberCard 
                      key={grandchild.id} 
                      member={grandchild}
                      generation="grandchild"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Extended Family */}
            {generations.others.length > 0 && (
              <div className="mt-8 sm:mt-10 pt-6 sm:pt-8 border-t border-gray-200">
                <div className="text-center mb-4 sm:mb-6">
                  <div className="inline-flex items-center gap-1 sm:gap-2 px-3 py-1 sm:px-4 sm:py-2 rounded-full">
                    <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-gray-500"></div>
                    <h3 className="text-xs sm:text-base font-bold text-gray-700">Extended Family</h3>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {generations.others.length} other relative{generations.others.length > 1 ? 's' : ''}
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                  {generations.others.map((relative) => (
                    <MemberCard 
                      key={relative.id} 
                      member={relative}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Legend - Simplified for mobile */}
        <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-gray-200">
          <h4 className="text-center text-sm sm:text-lg font-semibold text-gray-700 mb-4">Relationship Legend</h4>
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-[10px] sm:text-xs">
            <div className="flex items-center gap-1 sm:gap-2 px-2 py-1 sm:px-3 sm:py-2 rounded-lg">
              <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full border border-purple-500 bg-white"></div>
              <span className="font-medium text-purple-700">Memorialized</span>
            </div>
            <div className="flex items-center gap-1 sm:gap-2 px-2 py-1 sm:px-3 sm:py-2 rounded-lg">
              <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full border border-pink-500 bg-white"></div>
              <span className="font-medium text-pink-700">Spouse</span>
            </div>
            <div className="flex items-center gap-1 sm:gap-2 px-2 py-1 sm:px-3 sm:py-2 rounded-lg">
              <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full border border-green-500 bg-white"></div>
              <span className="font-medium text-green-700">Children</span>
            </div>
            <div className="flex items-center gap-1 sm:gap-2 px-2 py-1 sm:px-3 sm:py-2 rounded-lg">
              <span className="text-gray-700 text-sm">🕊️</span>
              <span className="font-medium text-gray-700 ml-1">Deceased</span>
            </div>
          </div>
        </div>

        {/* Family Summary - Clean without backgrounds */}
        <div className="mt-6 sm:mt-8 border border-gray-200 rounded-xl sm:rounded-2xl p-4 sm:p-6">
          <h4 className="text-sm sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4 text-center">Family Summary</h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <div className="text-center">
              <div className="text-lg sm:text-2xl font-bold text-gray-800 mb-0.5 sm:mb-1">{familyTree.length}</div>
              <div className="text-xs text-gray-600 font-medium">Total Members</div>
            </div>
            <div className="text-center">
              <div className="text-lg sm:text-2xl font-bold text-purple-600 mb-0.5 sm:mb-1">{generations.main.length}</div>
              <div className="text-xs text-gray-600 font-medium">Memorialized</div>
            </div>
            <div className="text-center">
              <div className="text-lg sm:text-2xl font-bold text-pink-600 mb-0.5 sm:mb-1">{generations.spouse.length}</div>
              <div className="text-xs text-gray-600 font-medium">Spouse/Partner</div>
            </div>
            <div className="text-center">
              <div className="text-lg sm:text-2xl font-bold text-green-600 mb-0.5 sm:mb-1">
                {generations.children.length + generations.grandchildren.length}
              </div>
              <div className="text-xs text-gray-600 font-medium">Descendants</div>
            </div>
          </div>
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
    <div className="bg-white p-4 sm:p-6 rounded-xl border border-gray-200 hover:shadow-md transition-all h-full flex flex-col relative">
      {/* You indicator - positioned at top right */}
      {canModify && (
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs font-bold z-10">
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

      <p className="text-gray-700 leading-relaxed mb-4 sm:mb-5 text-sm sm:text-base whitespace-pre-line flex-grow">
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

      <div className="flex items-center justify-between mt-auto">
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
// Tributes Carousel Component - Horizontal Auto-Sliding
const TributesCarousel: React.FC<{
  tributes: Tribute[];
  onEdit: (tribute: Tribute) => void;
  onDelete: (tributeId: string) => void;
  currentSessionId: string;
  likedMemories: Set<string>;
  onLike: (tributeId: string) => void;
}> = ({ tributes, onEdit, onDelete, currentSessionId, likedMemories, onLike }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [slidesToShow, setSlidesToShow] = useState(3);

  // Determine how many slides to show based on screen size
  useEffect(() => {
    const updateSlidesToShow = () => {
      if (window.innerWidth < 640) {
        setSlidesToShow(1); // Mobile: 1 slide
      } else if (window.innerWidth < 1024) {
        setSlidesToShow(2); // Tablet: 2 slides
      } else {
        setSlidesToShow(3); // Desktop: 3 slides
      }
    };

    updateSlidesToShow();
    window.addEventListener('resize', updateSlidesToShow);
    return () => window.removeEventListener('resize', updateSlidesToShow);
  }, []);

  // Auto-slide functionality
  useEffect(() => {
    if (isHovering || tributes.length <= slidesToShow) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        const next = prev + 1;
        // Loop back to start when reaching the end
        return next >= tributes.length ? 0 : next;
      });
    }, 5000); // Slide every 5 seconds

    return () => clearInterval(interval);
  }, [isHovering, tributes.length, slidesToShow]);

  const handlePrevious = () => {
    setCurrentIndex((prev) => {
      const newIndex = prev - 1;
      return newIndex < 0 ? tributes.length - 1 : newIndex;
    });
  };

  const handleNext = () => {
    setCurrentIndex((prev) => {
      const next = prev + 1;
      return next >= tributes.length ? 0 : next;
    });
  };

  // If there are fewer tributes than slides to show, just display them all
  if (tributes.length <= slidesToShow) {
    return (
      <div className={`grid gap-6 ${
        slidesToShow === 1 ? 'grid-cols-1' : 
        slidesToShow === 2 ? 'sm:grid-cols-2' : 
        'sm:grid-cols-2 lg:grid-cols-3'
      }`}>
        {tributes.map((tribute) => (
          <div key={tribute.id} className="relative">
            <TributeCard
              tribute={tribute}
              onEdit={onEdit}
              onDelete={onDelete}
              currentSessionId={currentSessionId}
              onLike={onLike}
              isLiked={likedMemories.has(tribute.id || '')}
            />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div 
      className="relative group"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Carousel Container */}
      <div className="overflow-hidden">
        <div 
          className="flex transition-transform duration-500 ease-in-out gap-6"
          style={{
            transform: `translateX(-${currentIndex * (100 / slidesToShow)}%)`
          }}
        >
          {tributes.map((tribute) => (
            <div
              key={tribute.id}
              className="flex-shrink-0 relative"
              style={{ 
                width: slidesToShow === 1 ? '100%' : 
                       slidesToShow === 2 ? 'calc(50% - 12px)' : 
                       'calc(33.333% - 16px)'
              }}
            >
              <TributeCard
                tribute={tribute}
                onEdit={onEdit}
                onDelete={onDelete}
                currentSessionId={currentSessionId}
                onLike={onLike}
                isLiked={likedMemories.has(tribute.id || '')}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Arrows - Show on hover */}
      <button
        onClick={handlePrevious}
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-700 hover:text-orange-500 hover:scale-110 transition-all z-10 opacity-0 group-hover:opacity-100"
        aria-label="Previous tribute"
      >
        <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>

      <button
        onClick={handleNext}
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-700 hover:text-orange-500 hover:scale-110 transition-all z-10 opacity-0 group-hover:opacity-100"
        aria-label="Next tribute"
      >
        <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>

      {/* Dots Indicator */}
      <div className="flex justify-center gap-2 mt-8">
        {tributes.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`transition-all duration-300 rounded-full ${
              index === currentIndex
                ? 'w-8 h-2 bg-orange-500'
                : 'w-2 h-2 bg-gray-300 hover:bg-gray-400'
            }`}
            aria-label={`Go to tribute ${index + 1}`}
          />
        ))}
      </div>

      {/* Auto-slide indicator */}
      <div className="text-center mt-4">
        <p className="text-xs text-gray-500">
          {isHovering ? '⏸️ Paused' : '▶️ Auto-sliding'} • {currentIndex + 1} of {tributes.length}
        </p>
      </div>
    </div>
  );
};

// Enhanced service section with virtual link
// Enhanced service section with virtual link and Google Maps
const ServiceSection: React.FC<{ serviceInfo: ServiceInfo }> = ({ serviceInfo }) => {
  const [showVirtualOptions, setShowVirtualOptions] = useState(false);
  
  if (!serviceInfo || (!serviceInfo.venue && !serviceInfo.address && !serviceInfo.date && !serviceInfo.time)) {
    return null;
  }
  
  const formatFullDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Google Maps embed URL
  const mapEmbedUrl = serviceInfo.address 
    ? `https://maps.google.com/maps?q=${encodeURIComponent(serviceInfo.address)}&t=&z=15&ie=UTF8&iwloc=&output=embed`
    : null;

  // Google Maps navigation URL for mobile
  const getDirectionsUrl = serviceInfo.address
    ? `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(serviceInfo.address)}`
    : null;

  const handleVirtualLink = (platform: 'zoom' | 'meet' | 'teams') => {
    const url = serviceInfo.virtualLink || (platform === 'zoom' ? 'https://zoom.us/' : platform === 'meet' ? 'https://meet.google.com/' : 'https://teams.microsoft.com/');
    
    const win = window.open(url, '_blank');
    
    if (!win || win.closed || typeof win.closed === 'undefined') {
      alert(`Please allow pop-ups in your browser to join the virtual service.`);
    }
    
    setShowVirtualOptions(false);
  };

  return (
    <section id="service" className="py-16 sm:py-20 px-3 sm:px-4 scroll-mt-24">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 sm:mb-12">
          <h2 className="text-4xl sm:text-5xl font-serif text-gray-800 inline-block relative">
            Memorial Service
            <div className="absolute -bottom-2 left-0 w-1/2 h-1 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"></div>
          </h2>
          <p className="text-sm text-gray-600 mt-2">Join us in celebrating a life well lived</p>
        </div>

        {/* Main Grid - Map and Details */}
        <div className="grid lg:grid-cols-2 gap-6 md:gap-8 mb-8">
          
          {/* Left: Google Map */}
          {mapEmbedUrl && (
            <div className="order-2 lg:order-1">
              <div className="bg-gray-100 rounded-2xl overflow-hidden shadow-lg h-full min-h-[350px] md:min-h-[450px]">
                <iframe
                  width="100%"
                  height="100%"
                  src={mapEmbedUrl}
                  title="Service Location Map"
                  className="w-full h-full border-0"
                  style={{ minHeight: '350px' }}
                  loading="lazy"
                />
              </div>
              
              {/* Get Directions Button - Mobile Friendly */}
              {getDirectionsUrl && (
                <div className="mt-4">
                  <a
                    href={getDirectionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all font-medium shadow-sm hover:shadow-md"
                  >
                    <MapPin className="w-5 h-5" />
                    Get Directions via Google Maps
                  </a>
                </div>
              )}
            </div>
          )}

          {/* Right: Service Details */}
          <div className="order-1 lg:order-2 space-y-6">
            
            {/* Venue & Address Card */}
            {(serviceInfo.venue || serviceInfo.address) && (
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-orange-500" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-3">Location</h3>
                    {serviceInfo.venue && (
                      <p className="text-xl text-gray-900 font-semibold mb-2">
                        {serviceInfo.venue}
                      </p>
                    )}
                    {serviceInfo.address && (
                      <p className="text-gray-700 leading-relaxed">
                        {serviceInfo.address}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Date & Time Card */}
            {(serviceInfo.date || serviceInfo.time) && (
              <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-6 h-6 text-orange-500" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-3">Date & Time</h3>
                    {serviceInfo.date && (
                      <p className="text-xl text-gray-900 font-semibold mb-2">
                        {formatFullDate(serviceInfo.date)}
                      </p>
                    )}
                    {serviceInfo.time && (
                      <div className="flex items-center gap-2 text-gray-700">
                        <Clock className="w-5 h-5 text-orange-500" />
                        <p className="text-lg font-medium">
                          {serviceInfo.time}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Virtual Service Card */}
            {serviceInfo.virtualLink && (
              <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-6 border-2 border-purple-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center flex-shrink-0">
                    <Video className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Join Virtually</h3>
                    <p className="text-gray-700 mb-4 text-sm leading-relaxed">
                      Can't attend in person? Join the memorial service online from anywhere in the world
                      {serviceInfo.virtualPlatform && (
                        <span className="font-semibold text-purple-600 ml-1">
                          via {serviceInfo.virtualPlatform.charAt(0).toUpperCase() + serviceInfo.virtualPlatform.slice(1)}
                        </span>
                      )}
                    </p>
                    
                    {!showVirtualOptions ? (
                      <button
                        onClick={() => setShowVirtualOptions(true)}
                        className="w-full px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-all flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
                      >
                        <Video className="w-5 h-5" />
                        Join Virtual Service
                      </button>
                    ) : (
                      <div className="space-y-3 animate-slide-down">
                        <button
                          onClick={() => handleVirtualLink(serviceInfo.virtualPlatform || 'zoom')}
                          className="w-full px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-all flex items-center justify-center gap-2"
                        >
                          <Video className="w-5 h-5" />
                          Launch {serviceInfo.virtualPlatform ? serviceInfo.virtualPlatform.charAt(0).toUpperCase() + serviceInfo.virtualPlatform.slice(1) : 'Meeting'}
                        </button>
                        <button
                          onClick={() => setShowVirtualOptions(false)}
                          className="w-full px-4 py-2 text-gray-600 hover:text-gray-800 text-sm font-medium"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Service Flow Timeline */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <h4 className="text-center text-sm font-semibold text-gray-600 mb-6 uppercase tracking-wider">
            Service Schedule
          </h4>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8">
            {[
              { label: 'Arrival & Gathering', icon: Users, time: '15 min before' },
              { label: 'Memorial Ceremony', icon: Heart, time: 'Main service' },
              { label: 'Reception', icon: MessageCircle, time: 'After ceremony' }
            ].map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={step.label} className="flex items-center gap-4">
                  <div className="flex flex-col items-center">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center shadow-md ${
                      index === 0 ? 'bg-gradient-to-br from-orange-400 to-amber-500' :
                      index === 1 ? 'bg-gradient-to-br from-purple-400 to-indigo-500' :
                      'bg-gradient-to-br from-blue-400 to-cyan-500'
                    }`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <p className="text-sm font-semibold text-gray-800 mt-3 text-center max-w-[120px]">
                      {step.label}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{step.time}</p>
                  </div>
                  {index < 2 && (
                    <div className="hidden sm:block w-12 h-0.5 bg-gray-300 mb-16"></div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Additional Information Footer */}
        <div className="mt-12 pt-8 border-t border-gray-200 text-center">
          <p className="text-gray-600 leading-relaxed">
            Your presence would mean a great deal to the family. For any questions or special accommodations, please contact the family directly.
          </p>
          <p className="text-sm text-gray-500 mt-4">
            We look forward to celebrating this beautiful life together
          </p>
        </div>
      </div>

      <style>{`
        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-slide-down {
          animation: slide-down 0.3s ease-out forwards;
        }
      `}</style>
    </section>
  );
};

// Animated Footer with Floating Icons
// Redesigned Memorial Footer with Enhanced Responsiveness
const MemorialFooter: React.FC<{ memorialName: string }> = ({ memorialName }) => {
  const [iconIndex, setIconIndex] = useState(0);
  const icons = [Heart, Flower2, Sparkles, Star];

  useEffect(() => {
    const interval = setInterval(() => {
      setIconIndex((prev) => (prev + 1) % icons.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const Icon = icons[iconIndex];

  return (
    <footer className="mt-8 sm:mt-12 lg:mt-16 relative overflow-hidden">
      {/* CSS Animations */}
      <style>{`
        @keyframes float {
          0%, 100% { 
            transform: translateY(0) rotate(0deg); 
            opacity: 0.2; 
          }
          50% { 
            transform: translateY(-15px) rotate(5deg); 
            opacity: 0.4; 
          }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-amber-50/30 to-amber-100/20"></div>
      
      {/* Decorative Top Border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-300/40 to-transparent"></div>
      
      {/* Floating Icons - Responsive Count */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(6)].map((_, i) => {
          const RandIcon = icons[Math.floor(Math.random() * icons.length)];
          const isVisible = i < 3 ? 'block' : 'hidden sm:block';
          
          return (
            <div
              key={i}
              className={`absolute ${isVisible}`}
              style={{
                left: `${10 + Math.random() * 80}%`,
                top: `${10 + Math.random() * 80}%`,
                animation: `float ${4 + Math.random() * 3}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 2}s`,
              }}
            >
              <RandIcon className="w-3 h-3 sm:w-4 sm:h-4 text-amber-300/40" />
            </div>
          );
        })}
      </div>
      
      {/* Main Content */}
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12">
        {/* Header Section */}
        <div className="text-center space-y-3 sm:space-y-4">
          {/* Icon and Title Row */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-3">
            <div className="animate-pulse hidden sm:block">
              <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400 fill-amber-400" />
            </div>
            
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-serif font-bold text-gray-900 leading-tight">
              Forever in our hearts
            </h3>
            
            <div className="animate-pulse hidden sm:block">
              <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400 fill-amber-400" />
            </div>
          </div>
          
          {/* Memorial Message */}
          <div className="max-w-2xl mx-auto space-y-2">
            <p className="text-sm sm:text-base lg:text-lg text-gray-700 px-4">
              {memorialName}'s memory lives on in the hearts of those who loved them
            </p>
            
            {/* Divider */}
            <div className="flex items-center justify-center gap-2 py-2">
              <div className="h-px w-8 sm:w-12 bg-gradient-to-r from-transparent to-amber-300/50"></div>
              <Heart className="w-3 h-3 sm:w-4 sm:h-4 text-amber-400 fill-amber-400" />
              <div className="h-px w-8 sm:w-12 bg-gradient-to-l from-transparent to-amber-300/50"></div>
            </div>
            
            {/* Footer Info */}
            <p className="text-xs sm:text-sm text-gray-500">
              {new Date().getFullYear()} • Created with love
            </p>
          </div>
        </div>
        

      </div>
      
      {/* Bottom Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-t from-amber-100/30 to-transparent"></div>
    </footer>
  );
};
// Main Component
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
const [headerLocked, setHeaderLocked] = useState(false);
const [headerLockedTime, setHeaderLockedTime] = useState<number>(0);
const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [currentSessionId, setCurrentSessionId] = useState('');
  const [likedMemories, setLikedMemories] = useState<Set<string>>(new Set());
  const [editingTribute, setEditingTribute] = useState<Tribute | null>(null);
  
  // Check if user is logged in (has a token)
  const isLoggedIn = () => {
    // Check for token in localStorage or sessionStorage
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    return !!token;
  };

  // Handle navigation based on login status
  const handleBackNavigation = () => {
    if (isLoggedIn()) {
      navigate('/dashboard');
    } else {
      navigate('/');
    }
  };

  const fetchMemorial = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://wings-of-memories-backend.onrender.com/api/memorials/public/${identifier}`
      );

      if (!response.ok) throw new Error(`Memorial not found`);

      const data = await response.json();
    // Get family tree data safely
const familyTreeData = data?.familyTree || data?.memorial?.familyTree;

// Log all the debugging info in a safer way
console.log('=== Family Tree Debug Info ===');
console.log('Data has memorial property:', 'memorial' in data);
console.log('Data.familyTree exists:', 'familyTree' in data);
console.log('Data.memorial?.familyTree exists:', data?.memorial?.familyTree !== undefined);

if (familyTreeData === undefined) {
  console.log('Family tree: undefined');
} else if (familyTreeData === null) {
  console.log('Family tree: null');
} else if (Array.isArray(familyTreeData)) {
  console.log('Family tree length:', familyTreeData.length);
  console.log('Family tree data:', familyTreeData);
} else if (typeof familyTreeData === 'string') {
  console.log('Family tree is a string:', familyTreeData);
  // Try to parse if it looks like JSON
  if (familyTreeData.startsWith('[') || familyTreeData.startsWith('{')) {
    try {
      const parsed = JSON.parse(familyTreeData);
      console.log('Parsed family tree:', parsed);
    } catch  {
      console.log('Could not parse as JSON');
    }
  }
} else {
  console.log('Family tree type:', typeof familyTreeData, 'value:', familyTreeData);
}
console.log('=== End Family Tree Debug ===');
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
  
  // Make sure familyTree is properly handled
 familyTree: (() => {
  const rawData = memorialData.familyTree || [];
  console.log('Raw family tree data:', rawData);
  
  if (Array.isArray(rawData)) {
    return rawData.map((member: unknown, index: number) => {
      // Type guard to ensure member has the expected structure
      const typedMember = member as {
        id?: string;
        name?: string;
        image?: string;
        photo?: string;
        relation?: string;
        isDeceased?: boolean;
        parentId?: string;
        spouse?: string;
      };
      
      return {
        id: typedMember.id || `member-${index}`,
        name: typedMember.name || 'Unknown',
        image: typedMember.image || typedMember.photo || '',
        relation: typedMember.relation || 'Family Member',
        isDeceased: typedMember.isDeceased || false,
        parentId: typedMember.parentId || null,
        spouse: typedMember.spouse || null,
        original: typedMember
      };
    });
  }
  return [];
})(),
  
  gallery: Array.isArray(memorialData.gallery) ? memorialData.gallery : [],
  serviceInfo: memorialData.serviceInfo || memorialData.service || {},
  service: memorialData.service || memorialData.serviceInfo || {},
  memoryWall: Array.isArray(memorialData.memoryWall) ? memorialData.memoryWall : [],
  memories: Array.isArray(memorialData.memories) ? memorialData.memories : [],
  tributes: Array.isArray(memorialData.tributes || memorialData.memoryWall) 
  ? (memorialData.tributes || memorialData.memoryWall).map((tribute: unknown) => {
      const typedTribute = tribute as {
        id?: string;
        authorName?: string;
        name?: string;
        authorLocation?: string;
        location?: string;
        message?: string;
        authorImage?: string;
        image?: string;
        createdAt?: string;
        date?: string;
        sessionId?: string;
        isAnonymous?: boolean;
      };
      
      return {
        id: typedTribute.id || '',
        name: typedTribute.authorName || typedTribute.name || 'Anonymous',
        location: typedTribute.authorLocation || typedTribute.location || '',
        message: typedTribute.message || '',
        image: typedTribute.authorImage || typedTribute.image || '',
        date: typedTribute.createdAt || typedTribute.date || new Date().toISOString(),
        sessionId: typedTribute.sessionId,
        isAnonymous: typedTribute.authorName === 'Anonymous' || typedTribute.isAnonymous
      };
    })
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
    const currentScroll = window.scrollY;
    
    // If user scrolls to the very top (within 20px)
    if (currentScroll <= 20) {
      // Only unlock if enough time has passed since locking (1 second minimum)
      const timeSinceLock = Date.now() - headerLockedTime;
      if (timeSinceLock > 1000) {
        setHeaderLocked(false);
        setIsScrolled(false);
      }
      return;
    }
    
    // Don't update scroll state if header is locked (navigation was clicked)
    if (headerLocked) return;
    
    // Clear any pending timeout
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    
    // Debounce: wait 100ms after last scroll before updating state
    scrollTimeoutRef.current = setTimeout(() => {
      const shouldBeScrolled = currentScroll > 100;
      
      // Only update if state actually needs to change
      setIsScrolled(prev => prev !== shouldBeScrolled ? shouldBeScrolled : prev);
    }, 100);
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  
  return () => {
    window.removeEventListener('scroll', handleScroll);
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
  };
}, [headerLocked, headerLockedTime]);

  useEffect(() => {
    // Initialize session ID
    if (identifier) {
      const sessionId = getOrCreateSessionId(identifier);
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
      const sessionId = getOrCreateSessionId(identifier || '');
      
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
         {/* BACK BUTTON - Fixed positioning */}
  <div className="fixed top-4 left-4 sm:top-6 sm:left-6 z-50">
    <button
      onClick={handleBackNavigation}
      className="flex items-center gap-2 bg-white/90 backdrop-blur-sm text-gray-800 hover:text-orange-600 transition-colors group px-4 py-2.5 rounded-lg shadow-lg hover:shadow-xl border border-gray-200"
    >
      <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
      <span className="text-sm font-medium">
        {isLoggedIn() ? 'Back to Dashboard' : 'Back to Home'}
      </span>
    </button>
  </div>

        {/* HEADER WITH WARM BACKGROUND IMAGE */}
        <header className={`sticky top-0 z-40 transition-all duration-200 ${
          isScrolled 
            ? 'bg-white shadow-md' 
            : 'relative bg-gray-900'
        }`}>
          
          {/* Background Image Layer */}
          <div className={`absolute inset-0 z-0 overflow-hidden transition-opacity duration-300 ${
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
          <div className={`relative z-10 max-w-7xl mx-auto px-4 sm:px-6 transition-all duration-200 ${
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
                    className={`object-cover shadow-2xl transition-all duration-200 ease-in-out ${
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
              <div className={`transition-all duration-200 ${
                isScrolled ? 'flex-1' : ''
              }`}>
                
                {/* Name - Smooth animation */}
                <h1 className={`font-serif transition-all duration-200 ease-in-out ${
                  isScrolled 
                    ? 'text-lg text-gray-900 font-semibold'
                    : 'text-4xl md:text-5xl lg:text-6xl text-white font-bold drop-shadow-2xl mb-8'
                }`}
                style={{ willChange: 'font-size, color' }}>
                  {memorial.name}
                </h1>
                
                {/* Dates & Location - TIMELINE STYLE WITHOUT CARD */}
                <div className={`transition-all duration-300 ease-in-out ${
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
        <nav className="sticky top-[72px] z-30 bg-white border-b border-gray-200 transition-all duration-200">
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
  // Lock the header in collapsed state and record the time
  setHeaderLocked(true);
  setIsScrolled(true);
  setHeaderLockedTime(Date.now());
  setActiveSection(item.id);
  
  const element = document.getElementById(item.id);
  if (element) {
    // Fixed offset since nav is now always at same position
    const navHeight = 72; // Height of collapsed header
    const navBarHeight = 60; // Height of nav bar itself
    const totalOffset = navHeight + navBarHeight + 20; // 20px padding
    
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - totalOffset;
    
    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  }
  
  // Header stays locked until user scrolls to very top AND 1 second has passed
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
            {/* Tributes Section - Horizontal Auto-Sliding Carousel */}
            <section id="tributes" className="animate-fadeIn scroll-mt-24 py-16 sm:py-20 px-3 sm:px-4">
              <div className="max-w-7xl mx-auto">
                {/* Header matching other sections */}
               <div className="mb-8 sm:mb-12">
  <div className="mb-6 sm:mb-8">
    <h2 className="text-4xl sm:text-5xl font-serif text-gray-800 inline-block relative">
      Memory Wall
      <div className="absolute -bottom-2 left-0 w-1/2 h-1 bg-amber-500 rounded-full"></div>
    </h2>
    <p className="text-sm text-gray-600 mt-2">
      {memorial.tributes.length} {memorial.tributes.length === 1 ? 'memory' : 'memories'} shared
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
                  <TributesCarousel
                    tributes={memorial.tributes}
                    onEdit={handleEditTribute}
                    onDelete={handleDeleteTribute}
                    currentSessionId={currentSessionId}
                    likedMemories={likedMemories}
                    onLike={toggleLike}
                  />
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