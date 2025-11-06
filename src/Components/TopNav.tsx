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
      <nav className={`sticky top-0 z-50 transition-all duration-500 ${
        scrolled 
          ? 'bg-white/95 backdrop-blur-xl shadow-xl border-b-2 border-amber-200/60' 
          : 'bg-gradient-to-r from-amber-50/90 via-white to-orange-50/90 shadow-md'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16 lg:h-17">
            
            {/* Logo Section - Premium styling */}
            <div className="flex items-center gap-2 sm:gap-3 group cursor-pointer select-none">
              <div className="relative flex items-center">
                {/* Animated glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500 blur-xl opacity-20 group-hover:opacity-40 transition-all duration-700 rounded-full scale-150 animate-pulse"></div>
                
                {/* Heart icon container with enhanced styling */}
                <div className="relative p-1 sm:p-1.5">
                  {/* Main heart with shadow */}
                  <div className="relative">
                    <Heart className="w-7 h-7 sm:w-9 sm:h-9 lg:w-10 lg:h-10 text-amber-600 fill-amber-600 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 drop-shadow-lg filter" 
                      style={{ filter: 'drop-shadow(0 4px 12px rgba(217, 119, 6, 0.3))' }} 
                    />
                    {/* Inner glow effect */}
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 opacity-0 group-hover:opacity-20 blur-sm transition-opacity duration-500"></div>
                  </div>
                  
                  {/* Small accent heart */}
                  <Heart className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 lg:w-4 lg:h-4 text-orange-500 fill-orange-500 absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300 animate-pulse" />
                </div>
              </div>
              
              {/* Brand name with premium typography */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-0">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight leading-none">
                  <span className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 bg-clip-text text-transparent group-hover:from-amber-700 group-hover:via-orange-700 group-hover:to-amber-800 transition-all duration-500 drop-shadow-sm"
                    style={{ 
                      textShadow: '0 2px 8px rgba(217, 119, 6, 0.15)',
                      fontFamily: 'system-ui, -apple-system, sans-serif',
                      letterSpacing: '-0.02em'
                    }}>
                    4revah
                  </span>
                </h1>
                
                {/* Tagline - responsive visibility */}
                <span className="hidden md:block lg:ml-3 md:ml-2 text-[10px] md:text-xs text-gray-600 font-semibold md:border-l-2 border-amber-400/50 md:pl-2 lg:pl-3 leading-tight uppercase tracking-wider">
                  Forever in Memory
                </span>
              </div>
            </div>

            {/* Desktop Navigation & Auth */}
            <div className="hidden md:flex items-center gap-4 lg:gap-8">
              <nav className="flex items-center gap-4 lg:gap-7">
                <a href="/about" className="relative text-sm lg:text-base text-gray-700 hover:text-amber-600 font-semibold transition-all duration-300 group whitespace-nowrap px-1 py-2">
                  <span className="relative z-10">About Us</span>
                  <span className="absolute bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-amber-500 to-orange-500 group-hover:w-full transition-all duration-400 rounded-full"></span>
                  <span className="absolute inset-0 bg-amber-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg -z-10"></span>
                </a>
                <a href="/services" className="relative text-sm lg:text-base text-gray-700 hover:text-amber-600 font-semibold transition-all duration-300 group whitespace-nowrap px-1 py-2">
                  <span className="relative z-10">What We Offer</span>
                  <span className="absolute bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-amber-500 to-orange-500 group-hover:w-full transition-all duration-400 rounded-full"></span>
                  <span className="absolute inset-0 bg-amber-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg -z-10"></span>
                </a>
                <a href="/contact" className="relative text-sm lg:text-base text-gray-700 hover:text-amber-600 font-semibold transition-all duration-300 group whitespace-nowrap px-1 py-2">
                  <span className="relative z-10">Contact Us</span>
                  <span className="absolute bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-amber-500 to-orange-500 group-hover:w-full transition-all duration-400 rounded-full"></span>
                  <span className="absolute inset-0 bg-amber-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg -z-10"></span>
                </a>
              </nav>
              
              <div className="flex items-center gap-2 lg:gap-3 pl-4 lg:pl-6 border-l-2 border-amber-300/60">
                <LoginButton onClick={() => openAuth('login')} />
                <RegisterButton onClick={() => openAuth('register')} />
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden relative w-11 h-11 flex items-center justify-center text-gray-700 hover:text-amber-600 transition-all duration-300 rounded-xl hover:bg-gradient-to-br hover:from-amber-50 hover:to-orange-50 active:scale-95 shadow-sm hover:shadow-md"
              aria-label="Toggle menu"
            >
              <div className="relative">
                {mobileMenuOpen ? (
                  <X className="w-6 h-6 transition-all duration-300 rotate-90" />
                ) : (
                  <Menu className="w-6 h-6 transition-all duration-300" />
                )}
              </div>
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden pb-5 animate-slide-down border-t-2 border-amber-200/60 mt-1 bg-gradient-to-b from-amber-50/50 via-orange-50/30 to-transparent rounded-b-2xl backdrop-blur-sm">
              <div className="flex flex-col gap-1.5 pt-4 px-2">
                <a 
                  href="/about"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-5 py-3.5 text-gray-700 hover:text-amber-600 hover:bg-gradient-to-r hover:from-amber-50 hover:to-orange-50 rounded-xl font-semibold transition-all duration-300 active:scale-98 border border-transparent hover:border-amber-200/50 shadow-sm hover:shadow-md"
                >
                  About Us
                </a>
                <a 
                  href="/services"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-5 py-3.5 text-gray-700 hover:text-amber-600 hover:bg-gradient-to-r hover:from-amber-50 hover:to-orange-50 rounded-xl font-semibold transition-all duration-300 active:scale-98 border border-transparent hover:border-amber-200/50 shadow-sm hover:shadow-md"
                >
                  What We Offer
                </a>
                <a 
                  href="/contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-5 py-3.5 text-gray-700 hover:text-amber-600 hover:bg-gradient-to-r hover:from-amber-50 hover:to-orange-50 rounded-xl font-semibold transition-all duration-300 active:scale-98 border border-transparent hover:border-amber-200/50 shadow-sm hover:shadow-md"
                >
                  Contact Us
                </a>
                
                <div className="relative my-3">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t-2 border-amber-300/40"></div>
                  </div>
                  <div className="relative flex justify-center">
                    <span className="bg-gradient-to-r from-amber-50 via-white to-orange-50 px-3 text-xs text-gray-500 font-medium">
                      Get Started
                    </span>
                  </div>
                </div>
                
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