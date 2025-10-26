import React from 'react';
import { FileText, Star, Clock, Image, Heart, Users, MapPin } from 'lucide-react';

interface NavigationProps {
  activeSection: string;
  onSectionClick: (section: string) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeSection, onSectionClick }) => {
  const sections = [
    { id: 'obituary', label: 'Obituary', icon: FileText },
    { id: 'favorites', label: 'Favorites', icon: Star },
    { id: 'timeline', label: 'Timeline', icon: Clock },
    { id: 'gallery', label: 'Gallery', icon: Image },
    { id: 'memory', label: 'Memory wall', icon: Heart },
    { id: 'family', label: 'Family tree', icon: Users },
    { id: 'service', label: 'Service', icon: MapPin }
  ];

  return (
    <nav className="sticky top-16 bg-white shadow-md z-40">
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        
        /* Smooth scroll behavior */
        .nav-container {
          scroll-behavior: smooth;
        }
        
        /* Active indicator animation */
        @keyframes slide-up {
          from {
            transform: scaleX(0);
          }
          to {
            transform: scaleX(1);
          }
        }
        
        .active-indicator {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
      
      <div className="max-w-7xl mx-auto px-2 sm:px-4">
        <div className="flex overflow-x-auto scrollbar-hide nav-container snap-x snap-mandatory">
          {sections.map(({ id, label, icon: Icon }) => (
            <button 
              key={id} 
              onClick={() => onSectionClick(id)} 
              className={`flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 px-3 sm:px-4 md:px-6 py-3 sm:py-4 whitespace-nowrap transition-all flex-shrink-0 snap-center min-w-[80px] sm:min-w-0 relative ${
                activeSection === id 
                  ? 'text-amber-600 bg-amber-50' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <Icon className="w-4 h-4 sm:w-4 sm:h-4 md:w-5 md:h-5" />
              <span className="text-xs sm:text-sm md:text-base font-medium">{label}</span>
              {activeSection === id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 sm:h-1 bg-amber-600 active-indicator"></div>
              )}
            </button>
          ))}
        </div>
      </div>
      
      {/* Scroll indicators for mobile */}
      <div className="sm:hidden absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent pointer-events-none"></div>
      <div className="sm:hidden absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent pointer-events-none"></div>
    </nav>
  );
};