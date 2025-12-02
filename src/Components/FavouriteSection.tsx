import React from 'react';
import { Music, Film, Coffee, Camera, Globe, Book, Heart, Tv, Utensils, Mountain, Palette } from 'lucide-react';

export interface Favorite {
  category: string;
  icon: string;
  question: string;
  answer: string;
}

interface FavoritesSectionProps {
  favorites: Favorite[];
}

// Map string icons to actual icon components
const iconMap: Record<string, React.ElementType> = {
  'music': Music,
  'film': Film,
  'coffee': Coffee,
  'camera': Camera,
  'globe': Globe,
  'book': Book,
  'heart': Heart,
  'tv': Tv,
  'utensils': Utensils,
  'mountain': Mountain,
  'palette': Palette
};

export const FavoritesSection: React.FC<FavoritesSectionProps> = ({ favorites }) => {
  return (
    <section id="favorites" className="py-16 sm:py-20 px-3 sm:px-4 bg-gradient-to-br from-amber-50 to-orange-50">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl sm:text-5xl font-serif mb-2 text-gray-800">
          Favorite Memories
        </h2>
        <div className="w-16 h-1 bg-gradient-to-r from-amber-400 to-orange-400 mb-12 sm:mb-16"></div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 sm:gap-x-12 gap-y-8 sm:gap-y-12">
          {favorites.map((favorite, index) => {
            const IconComponent = iconMap[favorite.icon] || Heart;
            
            return (
              <div 
                key={index} 
                className="space-y-3"
              >
                <div className="flex items-start gap-2">
                  <IconComponent className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
                  <h3 className="text-sm text-amber-600 font-medium leading-snug">
                    {favorite.question}
                  </h3>
                </div>
                <p className="text-gray-800 text-base leading-relaxed whitespace-pre-line">
                  {favorite.answer}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FavoritesSection;