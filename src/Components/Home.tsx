import React, { useState, useEffect } from 'react';
import { Heart, Image, MessageCircle, Users, MapPin, Book, Clock, Sparkles, X, Star } from 'lucide-react';
import TopNav from './TopNav';
import SearchNavbar from './SearchFunctionalities';
import { Header } from './Header';
import { QuoteSection } from './QuoteSection';
import { ObituarySection } from './ObituarySection';
import { FavoritesSection, Favorite } from './FavouriteSection';
import { TimelineSection } from './TimelineSection';
import { GallerySection } from './GallerySection';
import { MemoryWallDashboard } from './MemoryWallSection';
import { FamilyTreeSection } from './FamilyTreeSection';
import { ServiceSection } from './ServicesSection';
import { Footer } from './Footer';
import { mockMemorialData } from '../data/mockData';

// Import local images
import lifeStoryPreview from '../assets/images/lifestory.jpg';
import favoritesPreview from '../assets/images/favourites.png';
import timelinePreview from '../assets/images/timeline.png';
import galleryPreview from '../assets/images/gallery.png';
import memoryWallPreview from '../assets/images/memorywall.png';
import familyTreePreview from '../assets/images/familytree.png';
import servicesPreview from '../assets/images/service.png';

// Focus Manager Context
const FocusContext = React.createContext<{
  focusedSection: string | null;
  setFocusedSection: (id: string | null) => void;
}>({
  focusedSection: null,
  setFocusedSection: () => {},
});

// Fullscreen Focus Component Display - SIMPLIFIED
const FocusedComponentView: React.FC<{
  children: React.ReactNode;
  sectionId: string;
  title: string;
  onClose: () => void;
}> = ({ children, sectionId, title, onClose }) => {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black opacity-40"
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <div className="relative w-full h-full max-w-7xl max-h-[90vh] flex flex-col bg-white rounded-xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-linear-to-r from-orange-50 to-amber-50 border-b border-orange-200/50">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="bg-linear-to-br from-amber-100 to-orange-200 p-3 rounded-xl">
                  {getIcon()}
                </div>
                <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
              </div>
              
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-6 h-6 text-orange-600" />
              </button>
            </div>
          </div>
        </div>
        
        {/* Content Area */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

// Template Preview Card - NO ANIMATIONS, INSTANT DISPLAY
const TemplatePreviewCard: React.FC<{
  icon: React.ElementType;
  title: string;
  description: string;
  previewImage: string;
  imageAlt: string;
  onExplore: () => void;
}> = ({ 
  icon: Icon, 
  title, 
  description, 
  previewImage,
  imageAlt,
  onExplore
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden hover:shadow-lg">
      {/* Preview Image */}
      <div className="relative h-56 overflow-hidden">
        <img 
          src={previewImage} 
          alt={imageAlt}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent"></div>
        
        {/* Icon overlay */}
        <div className="absolute top-4 left-4 bg-white p-3 rounded-lg">
          <Icon className="w-6 h-6 text-orange-700" />
        </div>
        
        {/* Title overlay */}
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-xl font-bold text-white">{title}</h3>
        </div>
      </div>
      
      {/* Content Section */}
      <div className="p-5">
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">{description}</p>
        
        <button
          onClick={onExplore}
          className="w-full flex items-center justify-center gap-2 bg-amber-50 text-orange-700 font-medium py-3 px-4 rounded-lg border border-amber-200 hover:bg-amber-100"
        >
          <Sparkles className="w-4 h-4" />
          Preview This Section
        </button>
      </div>
    </div>
  );
};

const Home: React.FC = () => {
  const [focusedSection, setFocusedSection] = useState<string | null>(null);

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

  // Convert to Favorite[] array
  const getFavoritesData = (): Favorite[] => {
    return [
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
  };

  // Enhanced inclusive mock data
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
        onClose={() => setFocusedSection(null)}
      >
        {componentToShow}
      </FocusedComponentView>
    );
  };

  return (
    <FocusContext.Provider value={{ focusedSection, setFocusedSection }}>
      <div className="min-h-screen bg-linear-to-br from-amber-50 to-orange-50">
        {/* Navigation */}
        <div className="sticky top-0 z-40 bg-white shadow-sm">
          <TopNav />
          <SearchNavbar onSearch={() => {}} onFilterChange={() => {}} />
        </div>

        {/* Header */}
        <Header />

        {/* Quote Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <QuoteSection quote={inclusiveMockData.quote} />
        </div>

        {/* Template Features Section - INSTANT DISPLAY */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Star className="w-8 h-8 text-amber-500" />
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-800">
                Beautiful Memorial Features
              </h2>
              <Star className="w-8 h-8 text-amber-500" />
            </div>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto">
              Explore our thoughtfully designed templates. Click any section to preview how it would look.
            </p>
          </div>
          
          {/* Template Grid - NO ANIMATIONS, INSTANT DISPLAY */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templateSections.map((section) => (
              <TemplatePreviewCard
                key={section.id}
                icon={section.icon}
                title={section.title}
                description={section.description}
                previewImage={section.previewImage}
                imageAlt={section.imageAlt}
                onExplore={() => setFocusedSection(section.id)}
              />
            ))}
          </div>
        </div>

        {/* Footer */}
        <Footer />

        {/* Fullscreen Component View */}
        {renderFocusedComponent()}
      </div>
    </FocusContext.Provider>
  );
};

export default Home;