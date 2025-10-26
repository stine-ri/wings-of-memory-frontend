import React from 'react';
import { Heart, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    company: [
      { label: 'About Us', href: '/about' },
      { label: 'How It Works', href: '/how-it-works' },
      { label: 'Pricing', href: '/pricing' },
      { label: 'Blog', href: '/blog' }
    ],
    support: [
      { label: 'Help Center', href: '/help' },
      { label: 'Contact Us', href: '/contact' },
      { label: 'FAQs', href: '/faq' },
      { label: 'Privacy Policy', href: '/privacy' }
    ],
    resources: [
      { label: 'Memorial Guide', href: '/guide' },
      { label: 'Grief Support', href: '/support' },
      { label: 'Templates', href: '/templates' },
      { label: 'Community', href: '/community' }
    ]
  };

  const socialLinks = [
    { icon: Facebook, href: 'https://facebook.com', label: 'Facebook' },
    { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
    { icon: Instagram, href: 'https://instagram.com', label: 'Instagram' },
    { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' }
  ];

  const contactInfo = [
    { icon: Mail, text: 'support@wingsofmemory.com', href: 'mailto:support@wings of memory.com' },
    { icon: Phone, text: '+1 (555) 123-4567', href: 'tel:+15551234567' },
    { icon: MapPin, text: 'Nairobi, Kenya', href: '#' }
  ];

  return (
    <footer className="bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 border-t-2 border-amber-200">
      {/* Main Footer Content */}
      <div className="max-w-6xl mx-auto px-4 md:px-8 lg:px-12 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <Heart className="w-8 h-8 text-amber-600 fill-amber-600" />
              <h3 className="text-2xl font-serif font-bold text-gray-800">wings of memory</h3>
            </div>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Celebrating lives, cherishing memories, and honoring legacies with beautiful digital memorials.
            </p>
            
            {/* Social Links */}
            <div className="flex gap-3">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-amber-600 hover:bg-amber-600 hover:text-white transition-all shadow-sm hover:shadow-md"
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-semibold text-gray-800 mb-4 text-lg">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-gray-600 hover:text-amber-600 transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="font-semibold text-gray-800 mb-4 text-lg">Support</h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-gray-600 hover:text-amber-600 transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h4 className="font-semibold text-gray-800 mb-4 text-lg">Resources</h4>
            <ul className="space-y-3">
              {footerLinks.resources.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-gray-600 hover:text-amber-600 transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Contact Info Bar */}
        <div className="bg-white rounded-2xl shadow-sm border border-amber-200 p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-center gap-6 md:gap-8">
            {contactInfo.map((contact, index) => {
              const Icon = contact.icon;
              return (
                <a
                  key={index}
                  href={contact.href}
                  className="flex items-center gap-3 text-gray-700 hover:text-amber-600 transition-colors group"
                >
                  <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center group-hover:bg-amber-600 transition-colors">
                    <Icon className="w-5 h-5 text-amber-600 group-hover:text-white transition-colors" />
                  </div>
                  <span className="font-medium">{contact.text}</span>
                </a>
              );
            })}
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="bg-gradient-to-r from-amber-600 to-orange-600 rounded-2xl p-8 mb-8 text-center text-white">
          <h4 className="text-2xl font-serif font-bold mb-2">Stay Connected</h4>
          <p className="mb-6 opacity-90">Subscribe to our newsletter for memorial tips and updates</p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button className="px-6 py-3 bg-white text-amber-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors whitespace-nowrap">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-amber-200 bg-white bg-opacity-50">
        <div className="max-w-6xl mx-auto px-4 md:px-8 lg:px-12 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 text-gray-600">
              <Heart className="w-5 h-5 text-amber-600 animate-pulse" />
              <p className="text-sm">
                Made with love and remembrance
              </p>
            </div>
            
            <p className="text-sm text-gray-600">
              © {currentYear} wings of memory. All rights reserved.
            </p>
            
            <div className="flex items-center justify-center md:justify-end gap-6 text-sm">
              <a href="/terms" className="text-gray-600 hover:text-amber-600 transition-colors">
                Terms of Service
              </a>
              <a href="/privacy" className="text-gray-600 hover:text-amber-600 transition-colors">
                Privacy Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};