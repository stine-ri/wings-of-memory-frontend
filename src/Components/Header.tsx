import React from 'react';
import { Calendar, MapPin } from 'lucide-react';

interface HeaderProps {
  data: {
    name: string;
    profileImage: string | null;
    birthDate: string;
    deathDate: string;
    location: string;
  };
}

export const Header: React.FC<HeaderProps> = ({ data }) => {
  return (
    <header className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50"></div>
      <div className="relative max-w-6xl mx-auto px-3 sm:px-4 py-12 sm:py-16 md:py-24">
        <div className="flex flex-col items-center text-center animate-fade-in">
          <div className="relative group mb-6 sm:mb-8">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-400 to-orange-400 rounded-full blur-2xl opacity-30 group-hover:opacity-50 transition-opacity duration-700"></div>
            <img 
                src={data.profileImage || '/default-avatar.png'} 
              alt={data.name} 
              className="relative w-32 h-32 sm:w-40 sm:h-40 md:w-56 md:h-56 rounded-full object-cover shadow-2xl border-4 border-white transform group-hover:scale-105 transition-transform duration-500" 
            />
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-serif mb-4 sm:mb-6 text-gray-800 tracking-tight">{data.name}</h1>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 text-gray-600 mb-4 sm:mb-6">
            <div className="flex items-center gap-2 justify-center">
              <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500" />
              <span className="font-light text-sm sm:text-base">{data.birthDate} - {data.deathDate}</span>
            </div>
            <div className="hidden sm:block text-gray-300">•</div>
            <div className="flex items-center gap-2 justify-center">
              <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500" />
              <span className="font-light text-sm sm:text-base">{data.location}</span>
            </div>
          </div>
          <div className="inline-block px-6 sm:px-8 py-2 sm:py-3 bg-white/80 backdrop-blur-sm rounded-full shadow-lg">
            <p className="text-gray-700 font-light text-sm sm:text-base">Forever in our hearts 🕊️</p>
          </div>
        </div>
      </div>
    </header>
  );
};