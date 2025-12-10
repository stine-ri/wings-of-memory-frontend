import React, { useState, useEffect, lazy, Suspense } from 'react';
import { Heart, Image, MessageCircle, Users, MapPin, Book, Clock, Sparkles, X, Star, Loader2 } from 'lucide-react';
import TopNav from './TopNav';
import SearchNavbar from './SearchFunctionalities';
import { Header } from './Header';
import { QuoteSection } from './QuoteSection';
import { mockMemorialData } from '../data/mockData';

// Import local images
import lifeStoryPreview from '../assets/images/lifestory.jpg';
import favoritesPreview from '../assets/images/favourites.png';
import timelinePreview from '../assets/images/timeline.png';
import galleryPreview from '../assets/images/gallery.png';
import memoryWallPreview from '../assets/images/memorywall.png';
import familyTreePreview from '../assets/images/familytree.png';
import servicesPreview from '../assets/images/service.png';

// FIX: Create separate lazy-loaded components with proper default exports
const ObituarySection = lazy(() => import('./ObituarySection').then(module => ({ default: module.ObituarySection })));
const FavoritesSection = lazy(() => import('./FavouriteSection').then(module => ({ default: module.FavoritesSection })));
const TimelineSection = lazy(() => import('./TimelineSection').then(module => ({ default: module.TimelineSection })));
const GallerySection = lazy(() => import('./GallerySection').then(module => ({ default: module.GallerySection })));
const MemoryWallDashboard = lazy(() => import('./MemoryWallSection').then(module => ({ default: module.MemoryWallDashboard })));
const FamilyTreeSection = lazy(() => import('./FamilyTreeSection').then(module => ({ default: module.FamilyTreeSection })));
const ServiceSection = lazy(() => import('./ServicesSection').then(module => ({ default: module.ServiceSection })));
const Footer = lazy(() => import('./Footer').then(module => ({ default: module.Footer })));

// Loading Component
const SectionLoading: React.FC<{ message?: string }> = ({ message = "Loading beautiful memories..." }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] bg-linear-to-br from-amber-50 to-orange-50 rounded-2xl p-8 animate-pulse">
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-linear-to-r from-amber-400 to-orange-500 rounded-full blur-xl opacity-20"></div>
        <Loader2 className="w-16 h-16 text-amber-600 animate-spin relative" />
      </div>
      <p className="text-gray-700 text-lg font-medium mb-2">{message}</p>
      <p className="text-gray-500 text-sm">Please wait while we prepare this special tribute...</p>
      <div className="mt-8 flex space-x-2">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="w-3 h-3 bg-linear-to-r from-amber-400 to-orange-500 rounded-full animate-bounce"
            style={{ animationDelay: `${i * 0.1}s` }}
          />
        ))}
      </div>
    </div>
  );
};

// Home Loading Component
const HomeLoading: React.FC = () => {
  return (
    <div className="min-h-screen bg-linear-to-br from-amber-50 to-orange-50">
      {/* Navigation Skeleton */}
      <div className="sticky top-0 z-40 bg-white shadow-sm">
        <div className="h-16 bg-linear-to-r from-amber-50 to-orange-50 animate-pulse" />
      </div>

      {/* Header Skeleton */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="h-32 bg-linear-to-r from-amber-100 to-orange-100 rounded-2xl animate-pulse mb-8" />
      </div>

      {/* Quote Section Skeleton */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="h-24 bg-linear-to-r from-amber-50 to-white rounded-2xl animate-pulse" />
      </div>

      {/* Template Grid Skeleton */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="h-10 bg-linear-to-r from-amber-200 to-orange-200 rounded-full w-64 mx-auto animate-pulse mb-4" />
          <div className="h-6 bg-linear-to-r from-amber-100 to-orange-100 rounded-full w-96 mx-auto animate-pulse" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6, 7].map((i) => (
            <div
              key={i}
              className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden animate-pulse"
            >
              <div className="h-56 bg-linear-to-r from-amber-100 to-orange-100" />
              <div className="p-5">
                <div className="h-6 bg-linear-to-r from-amber-100 to-orange-100 rounded-full w-3/4 mb-3" />
                <div className="space-y-2">
                  <div className="h-4 bg-linear-to-r from-amber-50 to-orange-50 rounded-full" />
                  <div className="h-4 bg-linear-to-r from-amber-50 to-orange-50 rounded-full w-5/6" />
                  <div className="h-4 bg-linear-to-r from-amber-50 to-orange-50 rounded-full w-2/3" />
                </div>
                <div className="h-12 bg-linear-to-r from-amber-100 to-orange-100 rounded-lg mt-4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Focus Manager Context
const FocusContext = React.createContext<{
  focusedSection: string | null;
  setFocusedSection: (id: string | null) => void;
  loadingSection: string | null;
  setLoadingSection: (id: string | null) => void;
}>({
  focusedSection: null,
  setFocusedSection: () => {},
  loadingSection: null,
  setLoadingSection: () => {},
});

// Enhanced Fullscreen Focus Component Display with Loading
const FocusedComponentView: React.FC<{
  children: React.ReactNode;
  sectionId: string;
  title: string;
  onClose: () => void;
  isLoading?: boolean;
}> = ({ children, sectionId, title, onClose, isLoading = false }) => {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const getIcon = () => {
    switch(sectionId) {
      case 'life-story': return <Book className="w-5 h-5 text-orange-700" />;
      case 'favorites': return <Heart className="w-5 h-5 text-orange-700" />;
      case 'timeline': return <Clock className="w-5 h-5 text-orange-700" />;
      case 'gallery': return <Image className="w-5 h-5 text-orange-700" />;
      case 'memory-wall': return <MessageCircle className="w-5 h-5 text-orange-700" />;
      case 'family-tree': return <Users className="w-5 h-5 text-orange-700" />;
      case 'services': return <MapPin className="w-5 h-5 text-orange-700" />;
      default: return <Book className="w-5 h-5 text-orange-700" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-all duration-300"
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <div className="relative w-full h-full max-w-7xl max-h-[90vh] flex flex-col bg-white rounded-2xl shadow-2xl overflow-hidden animate-slide-up">
        {/* Header */}
        <div className="bg-linear-to-r from-orange-50 to-amber-50 border-b border-orange-200">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="bg-linear-to-br from-amber-100 to-orange-200 p-3 rounded-xl">
                  {getIcon()}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
                  {isLoading && (
                    <div className="flex items-center gap-2 mt-1">
                      <Loader2 className="w-4 h-4 text-amber-600 animate-spin" />
                      <span className="text-sm text-gray-600">Loading content...</span>
                    </div>
                  )}
                </div>
              </div>
              
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-all hover:scale-105"
                disabled={isLoading}
              >
                <X className="w-6 h-6 text-orange-600" />
              </button>
            </div>
          </div>
        </div>
        
        {/* Content Area */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            {isLoading ? (
              <SectionLoading message={`Loading ${title.toLowerCase()}...`} />
            ) : (
              children
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Template Preview Card with Loading State
const TemplatePreviewCard: React.FC<{
  icon: React.ElementType;
  title: string;
  description: string;
  previewImage: string;
  imageAlt: string;
  onExplore: () => void;
  isLoading?: boolean;
}> = ({ 
  icon: Icon, 
  title, 
  description, 
  previewImage,
  imageAlt,
  onExplore,
  isLoading = false
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      {/* Preview Image */}
      <div className="relative h-56 overflow-hidden">
        {isLoading ? (
          <div className="absolute inset-0 bg-linear-to-r from-amber-100 to-orange-100 animate-pulse flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-amber-600 animate-spin" />
          </div>
        ) : (
          <>
            <img 
              src={previewImage} 
              alt={imageAlt}
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent"></div>
            
            {/* Icon overlay */}
            <div className="absolute top-4 left-4 bg-white p-3 rounded-lg shadow-lg">
              <Icon className="w-6 h-6 text-orange-700" />
            </div>
            
            {/* Title overlay */}
            <div className="absolute bottom-4 left-4 right-4">
              <h3 className="text-xl font-bold text-white">{title}</h3>
            </div>
          </>
        )}
      </div>
      
      {/* Content Section */}
      <div className="p-5">
        {isLoading ? (
          <div className="space-y-3">
            <div className="h-4 bg-linear-to-r from-amber-50 to-orange-50 rounded-full animate-pulse"></div>
            <div className="h-4 bg-linear-to-r from-amber-50 to-orange-50 rounded-full w-5/6 animate-pulse"></div>
            <div className="h-10 bg-linear-to-r from-amber-100 to-orange-100 rounded-lg mt-4 animate-pulse"></div>
          </div>
        ) : (
          <>
            <p className="text-gray-600 text-sm mb-4 line-clamp-3">{description}</p>
            
            <button
              onClick={onExplore}
              className="w-full flex items-center justify-center gap-2 bg-amber-50 text-orange-700 font-medium py-3 px-4 rounded-lg border border-amber-200 hover:bg-amber-100 transition-all duration-300 hover:shadow-md group"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4 group-hover:scale-110 transition-transform" />
              )}
              {isLoading ? 'Loading...' : 'Preview This Section'}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

const Home: React.FC = () => {
  const [focusedSection, setFocusedSection] = useState<string | null>(null);
  const [loadingSection, setLoadingSection] = useState<string | null>(null);
  const [isHomeLoading, setIsHomeLoading] = useState(true);
  const [preloadedSections, setPreloadedSections] = useState<Set<string>>(new Set());

  // Simulate initial home page loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsHomeLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

  // Preload sections when user hovers over nav items
  const preloadSection = async (sectionId: string) => {
    if (preloadedSections.has(sectionId)) return;
    
    try {
      setPreloadedSections(prev => new Set(prev).add(sectionId));
      
      // Simulate preloading different sections
      await new Promise(resolve => setTimeout(resolve, 300));
      
    } catch (error) {
      console.error(`Failed to preload section ${sectionId}:`, error);
    }
  };

  // Handle opening section from TopNav with loading state
  const handleOpenSection = async (sectionId: string) => {
    console.log('Opening section from navbar:', sectionId);
    setLoadingSection(sectionId);
    setFocusedSection(sectionId);
    
    // Simulate loading time based on section complexity
    const loadTimes: Record<string, number> = {
      'life-story': 800,
      'favorites': 600,
      'timeline': 1000,
      'gallery': 1200,
      'memory-wall': 900,
      'family-tree': 1100,
      'services': 700
    };
    
    await new Promise(resolve => setTimeout(resolve, loadTimes[sectionId] || 800));
    
    setLoadingSection(null);
  };

  // Check for Memorial Guide navigation on mount
  useEffect(() => {
    const checkForMemorialGuideNavigation = async () => {
      const sectionId = localStorage.getItem('memorialGuideSection');
      if (sectionId) {
        console.log('Found memorial guide section in localStorage:', sectionId);
        await handleOpenSection(sectionId);
        localStorage.removeItem('memorialGuideSection');
      }
    };

    checkForMemorialGuideNavigation();
  }, []);

  // Check for pending scroll after navigation
  useEffect(() => {
    const targetSection = sessionStorage.getItem('targetScrollSection');
    if (targetSection) {
      sessionStorage.removeItem('targetScrollSection');
      
      const scrollTimer = setTimeout(() => {
        const element = document.getElementById(targetSection);
        if (element) {
          const navHeight = 100;
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.scrollY - navHeight;
          
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }, 500);
      
      return () => clearTimeout(scrollTimer);
    }
  }, []);

  // Template sections data
  const templateSections = [
    {
      id: "life-story",
      icon: Book,
      title: "Life Story & Obituary",
      description: "A beautifully crafted narrative celebrating a life well-lived, highlighting achievements, passions, and the lasting legacy left behind.",
      previewImage: lifeStoryPreview,
      imageAlt: "Life story template preview"
    },
    {
      id: "favorites",
      icon: Heart,
      title: "Favorite Memories",
      description: "Showcase cherished hobbies, favorite music, beloved places, and personal passions that made their life unique and meaningful.",
      previewImage: favoritesPreview,
      imageAlt: "Favorites template preview"
    },
    {
      id: "timeline",
      icon: Clock,
      title: "Life Timeline",
      description: "An interactive timeline highlighting significant milestones, achievements, and memorable moments throughout their journey.",
      previewImage: timelinePreview,
      imageAlt: "Timeline template preview"
    },
    {
      id: "gallery",
      icon: Image,
      title: "Photo Gallery",
      description: "A curated collection of photographs capturing precious moments, family gatherings, travels, and everyday joys.",
      previewImage: galleryPreview,
      imageAlt: "Gallery template preview"
    },
    {
      id: "memory-wall",
      icon: MessageCircle,
      title: "Memory Wall",
      description: "A digital space for friends and family to share stories, condolences, and cherished memories in a respectful online memorial.",
      previewImage: memoryWallPreview,
      imageAlt: "Memory wall template preview"
    },
    {
      id: "family-tree",
      icon: Users,
      title: "Family Connections",
      description: "Visualize family relationships and connections, honoring the network of love that extends through generations.",
      previewImage: familyTreePreview,
      imageAlt: "Family tree template preview"
    },
    {
      id: "services",
      icon: MapPin,
      title: "Service Information",
      description: "Share details about memorial services, gatherings, or virtual remembrance events for friends and family.",
      previewImage: servicesPreview,
      imageAlt: "Services template preview"
    }
  ];

  // Enhanced data
  const getFavoritesData = () => [
    {
      category: 'Music',
      icon: 'music',
      question: 'What was their favorite song?',
      answer: '"What a Wonderful World" by Louis Armstrong'
    },
    {
      category: 'Movies',
      icon: 'film',
      question: 'Which movie could they watch over and over?',
      answer: 'The Sound of Music - they loved the music and story'
    },
    {
      category: 'Food',
      icon: 'coffee',
      question: 'What was their favorite home-cooked meal?',
      answer: 'Homemade lasagna with extra cheese'
    },
    {
      category: 'Hobbies',
      icon: 'camera',
      question: 'What hobby brought them the most joy?',
      answer: 'Gardening - especially growing roses and herbs'
    },
    {
      category: 'Travel',
      icon: 'globe',
      question: 'Where was their favorite vacation spot?',
      answer: 'The mountains - any chance to hike and be in nature'
    },
    {
      category: 'Reading',
      icon: 'book',
      question: 'What book had the biggest impact on them?',
      answer: 'To Kill a Mockingbird - they reread it every year'
    }
  ];

  const inclusiveMockData = {
    ...mockMemorialData,
    name: "A Loved One",
    quote: "In loving memory of those who have touched our lives. Their light continues to shine through our memories.",
    obituary: "This is a sample obituary to showcase how beautiful life stories can be presented. Each memorial website can be customized to honor a unique individual's journey, achievements, and the special moments that defined their life.",
    favorites: getFavoritesData()
  };

  // Render the focused component
  const renderFocusedComponent = () => {
    if (!focusedSection) return null;

    const section = templateSections.find(s => s.id === focusedSection);
    if (!section) return null;

    let componentToShow;
    
    switch (focusedSection) {
      case 'life-story':
        componentToShow = <ObituarySection text={inclusiveMockData.obituary} />;
        break;
      case 'favorites':
        componentToShow = <FavoritesSection favorites={inclusiveMockData.favorites} />;
        break;
      case 'timeline':
        componentToShow = <TimelineSection events={inclusiveMockData.timeline} />;
        break;
      case 'gallery':
        componentToShow = <GallerySection images={inclusiveMockData.gallery} />;
        break;
      case 'memory-wall':
        componentToShow = <MemoryWallDashboard memories={inclusiveMockData.memoryWall} lovedOneName={inclusiveMockData.name} />;
        break;
      case 'family-tree':
        componentToShow = <FamilyTreeSection members={inclusiveMockData.familyTree} />;
        break;
      case 'services':
        componentToShow = <ServiceSection service={inclusiveMockData.service} memorialName={inclusiveMockData.name} />;
        break;
      default:
        componentToShow = <div>Component not found</div>;
    }

    return (
      <FocusedComponentView
        sectionId={focusedSection}
        title={section.title}
        onClose={() => {
          setFocusedSection(null);
          setLoadingSection(null);
        }}
        isLoading={loadingSection === focusedSection}
      >
        <Suspense fallback={<SectionLoading message={`Preparing ${section.title.toLowerCase()}...`} />}>
          {componentToShow}
        </Suspense>
      </FocusedComponentView>
    );
  };

  if (isHomeLoading) {
    return <HomeLoading />;
  }

  return (
    <FocusContext.Provider value={{ 
      focusedSection, 
      setFocusedSection, 
      loadingSection, 
      setLoadingSection 
    }}>
      <div className="min-h-screen bg-linear-to-br from-amber-50 to-orange-50">
        {/* Navigation */}
        <div className="sticky top-0 z-40 bg-white shadow-sm">
          <TopNav 
            onOpenSection={handleOpenSection}
            onSectionHover={preloadSection}
          />
          <SearchNavbar onSearch={() => {}} onFilterChange={() => {}} />
        </div>

        {/* Header */}
        <Suspense fallback={<div className="max-w-7xl mx-auto px-4 py-12"><SectionLoading /></div>}>
          <Header />
        </Suspense>

        {/* Quote Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <QuoteSection quote={inclusiveMockData.quote} />
        </div>

        {/* Template Features Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Star className="w-8 h-8 text-amber-500 animate-pulse" />
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-800">
                Beautiful Memorial Features
              </h2>
              <Star className="w-8 h-8 text-amber-500 animate-pulse" />
            </div>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto">
              Explore our thoughtfully designed templates. Click any section to preview how it would look.
            </p>
          </div>
          
          {/* Template Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templateSections.map((section) => (
              <TemplatePreviewCard
                key={section.id}
                icon={section.icon}
                title={section.title}
                description={section.description}
                previewImage={section.previewImage}
                imageAlt={section.imageAlt}
                onExplore={() => handleOpenSection(section.id)}
                isLoading={loadingSection === section.id}
              />
            ))}
          </div>
        </div>

        {/* Footer */}
        <Suspense fallback={<div className="mt-12"><SectionLoading message="Loading footer..." /></div>}>
          <Footer />
        </Suspense>

        {/* Fullscreen Component View */}
        {renderFocusedComponent()}
      </div>
    </FocusContext.Provider>
  );
};

export default Home;