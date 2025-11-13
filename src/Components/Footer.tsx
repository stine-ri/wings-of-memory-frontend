import React from 'react';
import { Heart, Mail, Phone, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    company: [
      { label: 'How It Works', href: '/how-it-works' },
      { label: 'Pricing', href: '/pricing' }
    ],
    support: [
      { label: 'Contact Us', href: '/contact' }
    ],
    resources: [
      { label: 'Memorial Guide', href: '/guide' },
    ]
  };

  const contactInfo = [
    { icon: Mail, text: 'support@4revah.com', href: 'mailto:support@4revah.com' },
    { icon: Phone, text: '+254 (702) 727-450', href: 'tel:+254702727450' },
    { icon: MapPin, text: 'Nairobi, Kenya', href: '#' }
  ];

  return (
    <footer className="bg-gradient-to-br from-amber-50 via-orange-50/80 to-amber-100/60 border-t-2 border-amber-300/50">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-12">
          
          {/* Brand Section - Matching TopNav Logo */}
          <div className="lg:col-span-1 sm:col-span-2">
            <div className="flex items-center gap-2 sm:gap-3 group cursor-pointer mb-5 select-none">
              <div className="relative flex items-center">
                {/* Animated glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500 blur-xl opacity-20 group-hover:opacity-40 transition-all duration-700 rounded-full scale-150"></div>
                
                {/* Heart icon container */}
                <div className="relative p-1 sm:p-1.5">
                  <div className="relative">
                    <Heart className="w-8 h-8 sm:w-9 sm:h-9 text-amber-600 fill-amber-600 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 drop-shadow-lg filter" 
                      style={{ filter: 'drop-shadow(0 4px 12px rgba(217, 119, 6, 0.3))' }} 
                    />
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 opacity-0 group-hover:opacity-20 blur-sm transition-opacity duration-500"></div>
                  </div>
                  
                  {/* Small accent heart */}
                  <Heart className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-orange-500 fill-orange-500 absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300" />
                </div>
              </div>
              
              {/* Brand name */}
              <div className="flex flex-col">
                <h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-none">
                  <span className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 bg-clip-text text-transparent group-hover:from-amber-700 group-hover:via-orange-700 group-hover:to-amber-800 transition-all duration-500 drop-shadow-sm"
                    style={{ 
                      textShadow: '0 2px 8px rgba(217, 119, 6, 0.15)',
                      letterSpacing: '-0.02em'
                    }}>
                    4revah
                  </span>
                </h3>
                <span className="text-[10px] sm:text-xs text-gray-600 font-semibold uppercase tracking-wider mt-0.5">
                  Forever in Memory
                </span>
              </div>
            </div>
            
            <p className="text-gray-700 mb-6 leading-relaxed text-sm sm:text-base max-w-sm">
              Celebrating lives, cherishing memories, and honoring legacies with beautiful digital memorials.
            </p>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-bold text-gray-800 mb-4 text-base sm:text-lg flex items-center gap-2">
              <span className="w-1 h-5 bg-gradient-to-b from-amber-500 to-orange-500 rounded-full"></span>
              Company
            </h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-gray-600 hover:text-amber-600 transition-all duration-300 text-sm sm:text-base font-medium hover:translate-x-1 inline-block"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="font-bold text-gray-800 mb-4 text-base sm:text-lg flex items-center gap-2">
              <span className="w-1 h-5 bg-gradient-to-b from-amber-500 to-orange-500 rounded-full"></span>
              Support
            </h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-gray-600 hover:text-amber-600 transition-all duration-300 text-sm sm:text-base font-medium hover:translate-x-1 inline-block"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h4 className="font-bold text-gray-800 mb-4 text-base sm:text-lg flex items-center gap-2">
              <span className="w-1 h-5 bg-gradient-to-b from-amber-500 to-orange-500 rounded-full"></span>
              Resources
            </h4>
            <ul className="space-y-3">
              {footerLinks.resources.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-gray-600 hover:text-amber-600 transition-all duration-300 text-sm sm:text-base font-medium hover:translate-x-1 inline-block"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Contact Info Bar */}
        <div className="bg-white rounded-2xl shadow-md border-2 border-amber-200/60 p-5 sm:p-6 lg:p-8 mb-8 backdrop-blur-sm bg-white/90">
          <div className="flex flex-col md:flex-row md:items-center md:justify-center gap-5 sm:gap-6 lg:gap-10">
            {contactInfo.map((contact, index) => {
              const Icon = contact.icon;
              return (
                <a
                  key={index}
                  href={contact.href}
                  className="flex items-center gap-3 text-gray-700 hover:text-amber-600 transition-all duration-300 group"
                >
                  <div className="w-11 h-11 sm:w-12 sm:h-12 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full flex items-center justify-center group-hover:from-amber-600 group-hover:to-orange-600 transition-all duration-300 shadow-sm group-hover:shadow-md">
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600 group-hover:text-white transition-colors duration-300" />
                  </div>
                  <span className="font-semibold text-sm sm:text-base">{contact.text}</span>
                </a>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t-2 border-amber-300/50 bg-gradient-to-r from-white/80 via-amber-50/50 to-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 text-gray-700">
              <Heart className="w-5 h-5 text-amber-600 fill-amber-600 animate-pulse" />
              <p className="text-xs sm:text-sm font-medium">
                Made with love and remembrance
              </p>
            </div>
            
            <p className="text-xs sm:text-sm text-gray-600 font-medium">
              © {currentYear} <span className="text-amber-600 font-bold">4revah</span>. All rights reserved.
            </p>
            
            <div className="flex items-center justify-center md:justify-end gap-4 sm:gap-6 text-xs sm:text-sm">
              <a href="/terms" className="text-gray-600 hover:text-amber-600 transition-colors duration-300 font-medium">
                Terms of Service
              </a>
              <a href="/privacy" className="text-gray-600 hover:text-amber-600 transition-colors duration-300 font-medium">
                Privacy Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};