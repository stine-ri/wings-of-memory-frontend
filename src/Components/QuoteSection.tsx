import React from 'react';
import { Sparkles, Heart, Flower2 } from 'lucide-react';

interface QuoteSectionProps {
  quote: string;
}

export const QuoteSection: React.FC<QuoteSectionProps> = ({ quote }) => {
  // Return null if no quote to prevent empty section
  if (!quote || quote.trim() === "") return null;
  
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-50/90 via-white to-amber-50/30 py-20 px-4">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating particles */}
        <div className="absolute top-1/4 left-1/4 w-4 h-4 rounded-full bg-amber-200/20 animate-float" style={{animationDelay: '0s'}}></div>
        <div className="absolute top-1/3 right-1/4 w-3 h-3 rounded-full bg-orange-200/20 animate-float" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-1/3 left-1/3 w-5 h-5 rounded-full bg-amber-300/10 animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-1/4 right-1/3 w-4 h-4 rounded-full bg-orange-300/10 animate-float" style={{animationDelay: '1.5s'}}></div>
        
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-5" 
             style={{
               backgroundImage: `linear-gradient(90deg, transparent 95%, #f59e0b 100%),
                                 linear-gradient(0deg, transparent 95%, #f59e0b 100%)`,
               backgroundSize: '60px 60px'
             }}>
        </div>
      </div>
      
      <div className="relative w-full max-w-5xl mx-auto z-10">
        <div className="text-center">
          
          {/* Top decorative section */}
          <div className="mb-12 md:mb-16">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="w-20 h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent"></div>
              <div className="flex items-center gap-3">
                <Flower2 className="w-6 h-6 text-amber-500 animate-pulse" />
                <span className="text-sm uppercase tracking-widest text-gray-500 font-light">In Memoriam</span>
                <Flower2 className="w-6 h-6 text-amber-500 animate-pulse" />
              </div>
              <div className="w-20 h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent"></div>
            </div>
            
            <h2 className="text-2xl sm:text-3xl font-serif text-gray-700 font-light tracking-wide">
              A Tribute to a Beautiful Life
            </h2>
          </div>
          
          {/* Main quote container */}
          <div className="relative bg-white/70 backdrop-blur-sm rounded-3xl border border-amber-200/50 shadow-xl p-8 md:p-12 mb-12 md:mb-16">
            {/* Corner decorations */}
            <div className="absolute -top-4 -left-4">
              <div className="bg-amber-100 p-3 rounded-2xl shadow-md">
                <Sparkles className="w-6 h-6 text-amber-600" />
              </div>
            </div>
            
            <div className="absolute -top-4 -right-4">
              <div className="bg-amber-100 p-3 rounded-2xl shadow-md">
                <Heart className="w-6 h-6 text-amber-600" />
              </div>
            </div>
            
            {/* Opening quote mark */}
            <div className="absolute -top-6 -left-2 text-8xl md:text-9xl text-amber-200/60 font-serif select-none -z-10">"</div>
            
            {/* Quote text with improved typography */}
            <div className="relative z-10">
              <p className="text-3xl sm:text-4xl md:text-5xl font-serif text-gray-800 italic leading-tight md:leading-snug px-4 md:px-8 mb-8">
                {quote}
              </p>
              
              {/* Author/attribution */}
              <div className="flex items-center justify-center gap-2 mt-8">
                <div className="w-12 h-px bg-amber-300"></div>
                <p className="text-gray-600 font-light tracking-wide text-sm uppercase">
                  Remembered With Love
                </p>
                <div className="w-12 h-px bg-amber-300"></div>
              </div>
            </div>
            
            {/* Closing quote mark */}
            <div className="absolute -bottom-6 -right-2 text-8xl md:text-9xl text-amber-200/60 font-serif select-none -z-10 rotate-180">"</div>
            
            <div className="absolute -bottom-4 -left-4">
              <div className="bg-amber-100 p-3 rounded-2xl shadow-md">
                <Flower2 className="w-6 h-6 text-amber-600" />
              </div>
            </div>
            
            <div className="absolute -bottom-4 -right-4">
              <div className="bg-amber-100 p-3 rounded-2xl shadow-md">
                <Heart className="w-6 h-6 text-amber-600" fill="#f59e0b" />
              </div>
            </div>
          </div>
          
          {/* Bottom section with memorial message */}
          <div className="space-y-8">
            {/* Memorial symbol row */}
            <div className="flex items-center justify-center gap-6 md:gap-10">
              <div className="text-4xl animate-float" style={{animationDelay: '0s'}}>🕊️</div>
              <div className="text-5xl animate-float" style={{animationDelay: '0.5s'}}>🌸</div>
              <div className="text-6xl animate-float" style={{animationDelay: '1s'}}>✨</div>
              <div className="text-5xl animate-float" style={{animationDelay: '1.5s'}}>🕯️</div>
              <div className="text-4xl animate-float" style={{animationDelay: '2s'}}>🌹</div>
            </div>
            
            {/* Memorial message */}
            <div className="max-w-2xl mx-auto">
              <h3 className="text-xl sm:text-2xl font-serif text-gray-700 mb-4">
                Their Legacy Lives On
              </h3>
              <p className="text-gray-600 leading-relaxed font-light">
                Though they may be gone from our sight, their memory remains forever in our hearts. 
                Every laugh shared, every lesson taught, and every moment of kindness continues 
                to inspire those they left behind.
              </p>
            </div>
            
            {/* Final decorative element */}
            <div className="pt-8">
              <div className="inline-flex flex-col items-center gap-4">
                <div className="w-32 h-px bg-gradient-to-r from-amber-300 via-orange-300 to-amber-300"></div>
                <p className="text-sm text-gray-500 uppercase tracking-widest font-light">
                  Forever in Our Hearts • Always Remembered
                </p>
                <div className="w-32 h-px bg-gradient-to-r from-amber-300 via-orange-300 to-amber-300"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Add the floating animation to global styles if not already present */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};