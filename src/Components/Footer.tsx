import React from 'react';
import { Heart, Facebook, Twitter, Instagram, Mail } from 'lucide-react';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    company: [
      { label: 'How It Works', href: '/how-it-works' },
    ],
    resources: [
      { label: 'Memorial Guide', href: '/guide' },
      { label: 'Help Center', href: '/help' }
    ]
  };

  return (
    <footer className="bg-gradient-to-br from-amber-50 via-orange-50/80 to-amber-100/60 border-t border-amber-200">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10 mb-10">
          
          {/* Brand Section */}
          <div className="lg:col-span-1 sm:col-span-2">
            <div className="flex items-center gap-2 mb-5">
              <div className="relative flex items-center">
                <div className="relative p-1">
                  <Heart className="w-8 h-8 text-amber-600 fill-amber-600" />
                </div>
              </div>
              
              <div className="flex flex-col">
                <h3 className="text-3xl font-bold bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 bg-clip-text text-transparent">
                  4revah
                </h3>
                <span className="text-xs text-gray-600 font-semibold uppercase tracking-wider mt-1">
                  Forever in Memory
                </span>
              </div>
            </div>
            
            <p className="text-gray-700 text-base leading-relaxed max-w-xs">
              Celebrating lives, cherishing memories, and honoring legacies with beautiful digital memorials.
            </p>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-semibold text-gray-800 mb-4 text-base flex items-center gap-2">
              <span className="w-1 h-5 bg-gradient-to-b from-amber-500 to-orange-500 rounded-full"></span>
              Company
            </h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-gray-600 hover:text-amber-600 transition-colors text-base"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h4 className="font-semibold text-gray-800 mb-4 text-base flex items-center gap-2">
              <span className="w-1 h-5 bg-gradient-to-b from-amber-500 to-orange-500 rounded-full"></span>
              Resources
            </h4>
            <ul className="space-y-3">
              {footerLinks.resources.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-gray-600 hover:text-amber-600 transition-colors text-base"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Follow Us Section - Moved from Expanded Section */}
          <div className="lg:col-span-1 sm:col-span-2">
            <h4 className="font-semibold text-gray-800 mb-4 text-base flex items-center gap-2">
              <span className="w-1 h-5 bg-gradient-to-b from-amber-500 to-orange-500 rounded-full"></span>
              Follow Us
            </h4>
            <p className="text-gray-700 text-sm mb-4">
              Stay connected with our memorial community
            </p>
            <div className="flex items-center gap-3">
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="p-3 bg-white text-blue-600 hover:text-white hover:bg-blue-600 rounded-xl transition-all shadow-sm hover:shadow-md flex items-center justify-center"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="p-3 bg-white text-blue-400 hover:text-white hover:bg-blue-400 rounded-xl transition-all shadow-sm hover:shadow-md flex items-center justify-center"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="p-3 bg-white text-pink-600 hover:text-white hover:bg-pink-600 rounded-xl transition-all shadow-sm hover:shadow-md flex items-center justify-center"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a 
                href="mailto:contact@4revah.com" 
                className="p-3 bg-white text-amber-600 hover:text-white hover:bg-amber-500 rounded-xl transition-all shadow-sm hover:shadow-md flex items-center justify-center"
                aria-label="Email"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-amber-200/50">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            <div className="flex items-center justify-center md:justify-start gap-2 text-gray-700 text-base">
              <Heart className="w-5 h-5 text-amber-500" />
              <span>Made with love and remembrance</span>
            </div>
            
            <p className="text-gray-700 text-base text-center md:text-right">
              © {currentYear} <span className="text-amber-600 font-semibold">4revah</span>. All rights reserved.
            </p>
          </div>

          {/* Legal links */}
          <div className="flex justify-center md:justify-end gap-6 text-base">
            <a href="/terms" className="text-gray-600 hover:text-amber-600 transition-colors">
              Terms of Service
            </a>
            <a href="/privacy" className="text-gray-600 hover:text-amber-600 transition-colors">
              Privacy Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};