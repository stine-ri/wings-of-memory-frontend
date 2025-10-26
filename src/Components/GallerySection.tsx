import React, { useState, useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';

interface GalleryImage {
  url: string;
  category: string;
}

interface GallerySectionProps {
  images: GalleryImage[];
}

export const GallerySection: React.FC<GallerySectionProps> = ({ images }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isSlideshow, setIsSlideshow] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const categories = ['all', 'portraits', 'family-activities', 'loving-couple'];
  const filteredImages = selectedCategory === 'all' ? images : images.filter(img => img.category === selectedCategory);

  // Slideshow autoplay
  useEffect(() => {
    let interval: number | undefined;
    if (isPlaying && isSlideshow) {
      interval = window.setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % filteredImages.length);
      }, 3000);
    }
    return () => {
      if (interval !== undefined) {
        window.clearInterval(interval);
      }
    };
  }, [isPlaying, isSlideshow, filteredImages.length]);

  const openSlideshow = useCallback((index: number) => {
    setCurrentImageIndex(index);
    setIsSlideshow(true);
    document.body.style.overflow = 'hidden';
  }, []);

  const closeSlideshow = useCallback(() => {
    setIsSlideshow(false);
    setIsPlaying(false);
    document.body.style.overflow = 'unset';
  }, []);

  const nextImage = useCallback(() => {
    setCurrentImageIndex((prev) => (prev + 1) % filteredImages.length);
  }, [filteredImages.length]);

  const prevImage = useCallback(() => {
    setCurrentImageIndex((prev) => (prev - 1 + filteredImages.length) % filteredImages.length);
  }, [filteredImages.length]);

  const startSlideshow = () => {
    openSlideshow(0);
    setIsPlaying(true);
  };

  return (
    <section id="gallery" className="py-16 sm:py-20 px-3 sm:px-4 bg-orange-50">
      <div className="max-w-6xl mx-auto">
        {/* Header Section with Title and Horizontal Navigation */}
        <div className="mb-8 sm:mb-12">
          {/* Gallery Title with Half Underline */}
          <div className="mb-6 sm:mb-8">
            <h2 className="text-4xl sm:text-5xl font-serif text-gray-800 inline-block relative">
              Gallery
              <div className="absolute -bottom-2 left-0 w-1/2 h-1 bg-amber-500 rounded-full"></div>
            </h2>
          </div>
          
          {/* Horizontal Navigation */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
            {/* Categories */}
            <div className="flex flex-wrap gap-2 sm:gap-4">
              {categories.map(cat => (
                <button 
                  key={cat} 
                  onClick={() => setSelectedCategory(cat)} 
                  className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg transition-colors duration-200 font-medium text-sm sm:text-base ${
                    selectedCategory === cat 
                      ? 'bg-amber-500 text-white' 
                      : 'text-gray-700 bg-white hover:bg-orange-100'
                  }`}
                >
                  {cat.charAt(0).toUpperCase() + cat.slice(1).replace('-', ' ')}
                </button>
              ))}
            </div>
            
            {/* Divider Line */}
            <div className="hidden sm:block h-8 w-px bg-gray-300"></div>
            
            {/* Slideshow Button */}
            <button 
              onClick={startSlideshow}
              className="px-4 sm:px-6 py-2 sm:py-3 rounded-lg bg-purple-500 text-white hover:bg-purple-600 transition-colors duration-200 font-medium flex items-center gap-2 text-sm sm:text-base w-fit"
            >
              <Play size={16} className="sm:size-[18px]" />
              Slideshow
            </button>
          </div>
        </div>

        {/* Image Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {filteredImages.map((img, index) => (
            <div 
              key={index} 
              className="aspect-square overflow-hidden rounded-lg bg-orange-100 cursor-pointer"
              onClick={() => openSlideshow(index)}
            >
              <img 
                src={img.url} 
                alt="" 
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" 
              />
            </div>
          ))}
        </div>

        {/* Slideshow Modal */}
        {isSlideshow && (
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
              onClick={prevImage}
              className="absolute left-2 sm:left-6 text-white hover:text-gray-300 transition-colors z-10"
            >
              <ChevronLeft size={32} className="sm:size-[48px]" />
            </button>

            <button 
              onClick={nextImage}
              className="absolute right-2 sm:right-6 text-white hover:text-gray-300 transition-colors z-10"
            >
              <ChevronRight size={32} className="sm:size-[48px]" />
            </button>

            {/* Main Image */}
            <div className="max-w-4xl max-h-[80vh] w-full px-4 sm:px-20">
              <img 
                src={filteredImages[currentImageIndex].url}
                alt=""
                className="w-full h-full object-contain rounded-lg"
              />
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
                {currentImageIndex + 1} / {filteredImages.length}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};