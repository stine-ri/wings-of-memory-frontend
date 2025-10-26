import React from 'react';
import { MapPin } from 'lucide-react';

interface TimelineEvent {
  date: string;
  year: number;
  title: string;
  description: string;
  location?: string;
  icon: string;
}

interface TimelineSectionProps {
  events: TimelineEvent[];
}

export const TimelineSection: React.FC<TimelineSectionProps> = ({ events }) => {
  const getIcon = (iconType: string) => {
    switch (iconType) {
      case 'baby': return '👶';
      case 'graduation': return '🎓';
      case 'heart': return '❤️';
      default: return '📍';
    }
  };

  return (
    <section id="timeline" className="py-16 sm:py-20 px-3 sm:px-4 bg-white">
      <div className="max-w-4xl mx-auto">
        {/* Left-aligned Title with Half Underline - Reduced margin */}
        <div className="mb-12 sm:mb-16 sm:-ml-32">
          <h2 className="text-4xl sm:text-5xl font-serif text-gray-800 inline-block relative">
            Timeline
            <div className="absolute -bottom-2 left-0 w-1/2 h-1 bg-amber-500"></div>
          </h2>
        </div>
        
        <div className="relative">
          {/* Vertical line passing through icons */}
          <div className="absolute left-4 sm:left-1/2 top-0 bottom-0 w-0.5 bg-gray-300 transform sm:-translate-x-1/2"></div>
          
          {events.map((event, index) => (
            <div 
              key={index} 
              className={`relative flex items-start mb-12 sm:mb-16 last:mb-0 ${
                index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
              }`}
            >
              {/* Left/Right side - Year and Date */}
              <div className={`flex-1 ${index % 2 === 0 ? 'pr-8 sm:pr-12 text-right' : 'pl-8 sm:pl-12'}`}>
                <div className="text-2xl sm:text-3xl font-light text-gray-400 mb-1">{event.year}</div>
                <div className="text-sm sm:text-base text-gray-500 font-medium">{event.date}</div>
              </div>
              
              {/* Center - Icon with line passing through */}
              <div className="flex-shrink-0 relative z-10">
                <div className="w-10 h-10 sm:w-14 sm:h-14 bg-white border-4 border-amber-500 rounded-full flex items-center justify-center text-lg sm:text-xl shadow-lg">
                  {getIcon(event.icon)}
                </div>
              </div>
              
              {/* Right/Left side - Content */}
              <div className={`flex-1 ${index % 2 === 0 ? 'pl-8 sm:pl-12' : 'pr-8 sm:pr-12'} pb-4 sm:pb-6`}>
                <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-100">
                  <h3 className="text-lg sm:text-xl font-normal text-amber-500 mb-2 sm:mb-3">{event.title}</h3>
                  {event.description && (
                    <p className="text-gray-700 text-sm sm:text-base leading-relaxed mb-2 sm:mb-3">
                      {event.description}
                    </p>
                  )}
                  {event.location && (
                    <div className="flex items-center gap-2 text-gray-500 text-xs sm:text-sm">
                      <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span>{event.location}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TimelineSection;