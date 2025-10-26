import React from 'react';
import { Share2, Facebook, Twitter, Mail } from 'lucide-react';

interface QuoteSectionProps {
  quote: string;
}

export const QuoteSection: React.FC<QuoteSectionProps> = ({ quote }) => {
  return (
    <div className="bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 py-20 px-4 animate-fade-in">
      <div className="max-w-5xl mx-auto">
        <div className="text-center relative">
          <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 text-9xl text-amber-200 opacity-40 font-serif">"</div>
          <p className="text-2xl md:text-4xl font-serif text-gray-700 italic relative z-10 leading-relaxed px-8">{quote}</p>
          <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 text-9xl text-amber-200 opacity-40 rotate-180 font-serif">"</div>
        </div>
        <div className="flex justify-center gap-3 mt-16 flex-wrap">
          <button className="flex items-center gap-2 px-6 py-3 bg-white text-gray-600 rounded-full hover:text-amber-600 hover:shadow-xl transition-all transform hover:scale-105 border border-gray-100">
            <Share2 className="w-4 h-4" />
            Share
          </button>
          <button className="flex items-center gap-2 px-6 py-3 bg-white text-gray-600 rounded-full hover:text-blue-600 hover:shadow-xl transition-all transform hover:scale-105 border border-gray-100">
            <Facebook className="w-4 h-4" />
            Facebook
          </button>
          <button className="flex items-center gap-2 px-6 py-3 bg-white text-gray-600 rounded-full hover:text-blue-400 hover:shadow-xl transition-all transform hover:scale-105 border border-gray-100">
            <Twitter className="w-4 h-4" />
            X/Twitter
          </button>
          <button className="flex items-center gap-2 px-6 py-3 bg-white text-gray-600 rounded-full hover:text-orange-600 hover:shadow-xl transition-all transform hover:scale-105 border border-gray-100">
            <Mail className="w-4 h-4" />
            E-mail
          </button>
        </div>
      </div>
    </div>
  );
};

