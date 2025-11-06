import React, { useState, useEffect } from 'react';
import { TopNav } from './TopNav';
import { Header } from './Header';
import { Navigation } from './Navigation';
import { QuoteSection } from './QuoteSection';
import { ObituarySection } from './ObituarySection';
import { FavoritesSection } from './FavouriteSection';
import { TimelineSection } from './TimelineSection';
import { GallerySection } from './GallerySection';
import { MemoryWallDashboard } from './MemoryWallSection';
import { FamilyTreeSection } from './FamilyTreeSection';
import { ServiceSection } from './ServicesSection';
import { Footer } from './Footer';
import { mockMemorialData } from '../data/mockData';

const Home: React.FC = () => {
  const [activeSection, setActiveSection] = useState('obituary');

  const handleSectionClick = (section: string) => {
    const element = document.getElementById(section);
    if (element) {
      const offset = 128;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
      setActiveSection(section);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['obituary', 'favorites', 'timeline', 'gallery', 'memory', 'family', 'service'];
      const scrollPosition = window.scrollY + 200;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slide-down {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slide-right {
          from { opacity: 0; transform: translateX(-30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
        .animate-slide-up {
          animation: slide-up 0.8s ease-out;
        }
        .animate-slide-down {
          animation: slide-down 0.3s ease-out;
        }
        .animate-slide-right {
          animation: slide-right 0.8s ease-out;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .border-3 {
          border-width: 3px;
        }
      `}</style>
      
      <TopNav />
      <Header />
      <Navigation activeSection={activeSection} onSectionClick={handleSectionClick} />
      <QuoteSection quote={mockMemorialData.quote} />
      <ObituarySection text={mockMemorialData.obituary} />
      <FavoritesSection favorites={mockMemorialData.favorites} />
      <TimelineSection events={mockMemorialData.timeline} />
      <GallerySection images={mockMemorialData.gallery} />
      <MemoryWallDashboard 
        memories={mockMemorialData.memoryWall} 
        lovedOneName={mockMemorialData.name}
      />
      <FamilyTreeSection members={mockMemorialData.familyTree} />
      <ServiceSection service={mockMemorialData.service} memorialName={mockMemorialData.name} />
      <Footer />
    </div>
  );
};

export default Home;