import React, { useState, useEffect } from 'react';
import { Heart, Menu, X } from 'lucide-react';
import { AuthModal } from './AuthModal';
import { LoginButton } from './LoginButton';
import { RegisterButton } from './RegisterButton';

export const TopNav: React.FC = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const openAuth = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setShowAuthModal(true);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <nav className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/98 backdrop-blur-md shadow-lg border-b border-amber-100' 
          : 'bg-gradient-to-r from-amber-50 via-white to-orange-50 shadow-sm'
      }`}>
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            
            {/* Logo Section - Enhanced */}
            <div className="flex items-center gap-2 group cursor-pointer">
              <div className="relative">
                <div className="absolute inset-0 bg-amber-400 blur-md opacity-20 group-hover:opacity-40 transition-opacity rounded-full"></div>
                <Heart className="w-6 h-6 sm:w-8 sm:h-8 text-amber-600 fill-amber-600 relative group-hover:scale-110 transition-transform drop-shadow-md" />
              </div>
              <span className="text-lg sm:text-xl font-serif font-bold bg-gradient-to-r from-amber-700 to-orange-600 bg-clip-text text-transparent">
                Wings of Memories
              </span>
            </div>

            {/* Desktop Navigation & Auth */}
            <div className="hidden md:flex items-center gap-6 lg:gap-8">
              <div className="flex items-center gap-6">
                <a href="/about" className="text-gray-700 hover:text-amber-600 font-medium transition-colors">
                  About Us
                </a>
                <a href="/services" className="text-gray-700 hover:text-amber-600 font-medium transition-colors">
                  What We Offer
                </a>
                <a href="/contact" className="text-gray-700 hover:text-amber-600 font-medium transition-colors">
                  Contact Us
                </a>
              </div>
              <div className="flex items-center gap-3 pl-6 border-l border-amber-200">
                <LoginButton onClick={() => openAuth('login')} />
                <RegisterButton onClick={() => openAuth('register')} />
              </div>
            </div>

            {/* Mobile Menu Button - Enhanced */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden relative w-9 h-9 flex items-center justify-center text-gray-700 hover:text-amber-600 transition-all rounded-lg hover:bg-amber-50 active:scale-95"
              aria-label="Toggle menu"
            >
              <div className="relative">
                {mobileMenuOpen ? (
                  <X className="w-5 h-5 sm:w-6 sm:h-6 transition-transform duration-300 rotate-90" />
                ) : (
                  <Menu className="w-5 h-5 sm:w-6 sm:h-6 transition-transform duration-300" />
                )}
              </div>
            </button>
          </div>

          {/* Mobile Menu - Enhanced */}
          {mobileMenuOpen && (
            <div className="md:hidden pb-3 animate-slide-down border-t border-amber-200/50 mt-2 bg-gradient-to-b from-amber-50/30 to-transparent rounded-b-xl">
              <div className="flex flex-col gap-2 pt-3 px-2">
                <a 
                  href="/about"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-2.5 text-gray-700 hover:text-amber-600 hover:bg-amber-50 rounded-lg font-medium transition-all"
                >
                  About Us
                </a>
                <a 
                  href="/services"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-2.5 text-gray-700 hover:text-amber-600 hover:bg-amber-50 rounded-lg font-medium transition-all"
                >
                  What We Offer
                </a>
                <a 
                  href="/contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-2.5 text-gray-700 hover:text-amber-600 hover:bg-amber-50 rounded-lg font-medium transition-all"
                >
                  Contact Us
                </a>
                <div className="border-t border-amber-200/50 my-2"></div>
                <LoginButton 
                  onClick={() => openAuth('login')} 
                  mobile 
                />
                <RegisterButton 
                  onClick={() => openAuth('register')} 
                  mobile 
                />
              </div>
            </div>
          )}
        </div>
      </nav>
      
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
        mode={authMode} 
      />
    </>
  );
};