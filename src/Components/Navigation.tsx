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
    { id: 'memory', label: 'Tributes', icon: Heart },
    { id: 'family', label: 'Family tree', icon: Users },
    { id: 'service', label: 'Service', icon: MapPin }
  ];

  return (
    <nav className="sticky top-16 bg-white shadow-lg z-40 border-b border-gray-100 w-full">
      <div className="w-full">
        {/* Desktop - Full width grid */}
        <div className="hidden sm:grid grid-cols-7 w-full">
          {sections.map(({ id, label, icon: Icon }) => (
            <button 
              key={id} 
              onClick={() => onSectionClick(id)} 
              className={`
                flex flex-col items-center justify-center 
                gap-2 lg:gap-3 
                px-2 py-4 lg:py-5
                whitespace-nowrap transition-all duration-300 
                relative w-full
                ${
                  activeSection === id 
                    ? 'text-amber-700 bg-amber-50/80 font-semibold' 
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50/70 font-medium'
                }
              `}
            >
              <Icon className="w-5 h-5 lg:w-5.5 lg:h-5.5 transition-transform duration-300" />
              <span className="text-sm lg:text-base font-medium tracking-wide text-center">
                {label}
              </span>
              {activeSection === id && (
                <div className="absolute bottom-0 left-4 right-4 h-1.5 bg-amber-600 rounded-t-full shadow-sm"></div>
              )}
            </button>
          ))}
        </div>

        {/* Mobile - Scrollable but full width items */}
        <div className="sm:hidden flex overflow-x-auto scrollbar-hide snap-x snap-mandatory w-full">
          {sections.map(({ id, label, icon: Icon }) => (
            <button 
              key={id} 
              onClick={() => onSectionClick(id)} 
              className={`
                flex flex-col items-center justify-center 
                gap-2 
                px-6 py-4
                whitespace-nowrap transition-all duration-300 
                flex-shrink-0 snap-center 
                min-w-[120px]
                relative
                ${
                  activeSection === id 
                    ? 'text-amber-700 bg-amber-50/80 font-semibold' 
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50/70 font-medium'
                }
              `}
            >
              <Icon className="w-5 h-5 transition-transform duration-300" />
              <span className="text-sm font-medium tracking-wide text-center">
                {label}
              </span>
              {activeSection === id && (
                <div className="absolute bottom-0 left-4 right-4 h-1.5 bg-amber-600 rounded-t-full shadow-sm"></div>
              )}
            </button>
          ))}
        </div>
      </div>
      
      {/* Scroll indicators for mobile */}
      <div className="sm:hidden absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent pointer-events-none" />
      <div className="sm:hidden absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent pointer-events-none" />
    </nav>
  );
};