import React from 'react';
import { Calendar, MapPin, Flower2, Heart, Star } from 'lucide-react';
import memorialImage from '../assets/images/home.png';
interface HeaderProps {
  data?: {
    name: string;
    profileImage: string | null;
    birthDate: string;
    deathDate: string;
    location: string;
  };
}

export const Header: React.FC<HeaderProps> = ({ data }) => {
  // Landing page mode (no data provided)
  if (!data) {
    return (
      <header className="relative w-full min-h-screen overflow-hidden">
        {/* FULL-WIDTH Background gradient - removed container constraints */}
        <div className="absolute inset-0 w-full bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
          {/* Subtle floral pattern overlay */}
          <div className="absolute inset-0 w-full opacity-5" 
               style={{
                 backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M50 0c13.807 0 25 11.193 25 25 0 13.807-11.193 25-25 25S25 38.807 25 25C25 11.193 36.193 0 50 0zm0 50c13.807 0 25 11.193 25 25S63.807 100 50 100 25 88.807 25 75s11.193-25 25-25z' fill='%23f97316' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
               }}>
          </div>
        </div>
        
        {/* Decorative floating elements - full width */}
        <div className="absolute inset-0 w-full overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-8 h-8 rounded-full bg-amber-300/20 animate-float"></div>
          <div className="absolute top-1/3 right-1/4 w-6 h-6 rounded-full bg-orange-300/20 animate-float" style={{animationDelay: '1s'}}></div>
          <div className="absolute bottom-1/3 left-1/3 w-7 h-7 rounded-full bg-yellow-300/15 animate-float" style={{animationDelay: '2s'}}></div>
          <div className="absolute bottom-1/4 right-1/3 w-8 h-8 rounded-full bg-amber-400/15 animate-float" style={{animationDelay: '1.5s'}}></div>
        </div>

        {/* Content container WITH max width */}
        <div className="relative w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-24">
          <div className="flex flex-col items-center text-center">
            
            {/* Decorative top elements - HALVED MARGIN */}
            <div className="mb-4 md:mb-6"> {/* Changed from mb-8 md:mb-12 */}
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="w-20 h-px bg-gradient-to-r from-transparent via-amber-500 to-transparent"></div>
                <div className="flex items-center gap-3">
                  <Flower2 className="w-6 h-6 text-amber-600 animate-pulse" />
                  <span className="text-sm uppercase tracking-widest text-amber-700/70 font-medium">Celebrating Life's Journey</span>
                  <Flower2 className="w-6 h-6 text-amber-600 animate-pulse" />
                </div>
                <div className="w-20 h-px bg-gradient-to-r from-transparent via-amber-500 to-transparent"></div>
              </div>
            </div>
            
            {/* Profile image with elegant frame - ALL OTHER CODE REMAINS UNCHANGED */}
            <div className="relative group mb-8 sm:mb-12">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full blur-3xl opacity-25 group-hover:opacity-35 transition-opacity duration-700"></div>
              <div className="relative">
                <div className="w-32 h-32 sm:w-40 sm:h-40 md:w-56 md:h-56 rounded-full p-1 bg-gradient-to-br from-amber-100 via-orange-50 to-yellow-100 shadow-2xl">
                  <div className="w-full h-full rounded-full overflow-hidden border-4 border-white/90">
                   <img 
          src={memorialImage} 
          alt="Memorial tribute" 
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
        />
                  </div>
                </div>
                
                {/* Decorative corner elements */}
                <div className="absolute -top-2 -left-2">
                  <div className="bg-white/90 backdrop-blur-sm p-2 rounded-lg shadow-md">
                    <Star className="w-4 h-4 text-amber-600" fill="#f59e0b" />
                  </div>
                </div>
                <div className="absolute -top-2 -right-2">
                  <div className="bg-white/90 backdrop-blur-sm p-2 rounded-lg shadow-md">
                    <Heart className="w-4 h-4 text-amber-600" fill="#f59e0b" />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Main title */}
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-serif mb-6 text-gray-800 tracking-tight">
              Eternal<span className="text-amber-600 mx-3">Remembrance</span>
            </h1>
            
            {/* Subtitle */}
            <p className="text-xl sm:text-2xl md:text-3xl text-gray-700 font-light mb-8 max-w-3xl leading-relaxed">
              Where Memories Become Everlasting Tributes
            </p>
            
            {/* Description */}
            <div className="max-w-2xl mx-auto mb-12">
              <p className="text-gray-600 leading-relaxed text-lg">
                Create beautiful memorials that honor the unique stories of loved ones. 
                Share cherished memories, photographs, and life moments in a warm, 
                respectful space that families can visit forever.
              </p>
            </div>
            
            {/* Memorial features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12 max-w-3xl">
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-amber-100 hover:shadow-xl transition-shadow duration-300">
                <Heart className="w-8 h-8 text-amber-600 mx-auto mb-3" fill="#f59e0b" />
                <h3 className="font-semibold text-gray-700 mb-2">Share Love</h3>
                <p className="text-sm text-gray-600">Collect heartfelt stories from family & friends</p>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-amber-100 hover:shadow-xl transition-shadow duration-300">
                <Flower2 className="w-8 h-8 text-amber-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-700 mb-2">Preserve Legacy</h3>
                <p className="text-sm text-gray-600">Create lasting tributes for generations</p>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-amber-100 hover:shadow-xl transition-shadow duration-300">
                <Star className="w-8 h-8 text-amber-600 mx-auto mb-3" fill="#f59e0b" />
                <h3 className="font-semibold text-gray-700 mb-2">Celebrate Life</h3>
                <p className="text-sm text-gray-600">Honor each unique life journey</p>
              </div>
            </div>
            
            {/* Final message */}
            <div className="inline-block px-8 py-4 bg-gradient-to-r from-amber-50 to-orange-50 backdrop-blur-sm rounded-2xl shadow-lg border border-amber-200/50 mt-8 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center gap-3">
                <Heart className="w-5 h-5 text-amber-600" fill="#f59e0b" />
                <p className="text-gray-700 font-medium text-lg">
                  Forever cherished in our hearts 🕊️
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>
    );
  }

  // Memorial page mode (with data provided)
  return (
    <header className="relative w-full overflow-hidden">
      <div className="absolute inset-0 w-full bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50"></div>
      <div className="relative w-full max-w-6xl mx-auto px-3 sm:px-4 py-12 sm:py-16 md:py-24">
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
              <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600" />
              <span className="font-light text-sm sm:text-base">{data.birthDate} - {data.deathDate}</span>
            </div>
            <div className="hidden sm:block text-gray-300">•</div>
            <div className="flex items-center gap-2 justify-center">
              <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
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