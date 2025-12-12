import React, { useState } from 'react';
import { MapPin, Clock, Calendar, Video, Youtube, Facebook, Instagram, MessageSquare, Twitch, Globe } from 'lucide-react';
import type { ServiceInfo } from '../types/memorial'; // Import from shared types


interface ServiceSectionProps {
  service: ServiceInfo; // Use the imported type
  memorialName: string;
}

export const ServiceSectionPublic: React.FC<ServiceSectionProps> = ({ service, memorialName }) => {
  const [showVirtualOptions, setShowVirtualOptions] = useState(false);

  // Only show the section if there's service data
  if (!service.venue && !service.address && !service.date && !service.time && !service.virtualLink && !service.additionalLinks?.length) {
    return null;
  }

  const handleVirtualLink = (url: string) => {
    const win = window.open(url, '_blank');
    
    if (!win || win.closed || typeof win.closed === 'undefined') {
      alert(`Please allow pop-ups in your browser to open the virtual service link.`);
    }
    
    setShowVirtualOptions(false);
  };

  // Helper function to get platform icon
  const getPlatformIcon = (platform?: string) => {
    if (!platform) return <Video className="w-4 h-4" />;
    
    const lowerPlatform = platform.toLowerCase();
    if (lowerPlatform.includes('youtube')) return <Youtube className="w-4 h-4" />;
    if (lowerPlatform.includes('facebook')) return <Facebook className="w-4 h-4" />;
    if (lowerPlatform.includes('instagram')) return <Instagram className="w-4 h-4" />;
    if (lowerPlatform.includes('tiktok')) return <MessageSquare className="w-4 h-4" />;
    if (lowerPlatform.includes('twitch')) return <Twitch className="w-4 h-4" />;
    if (lowerPlatform.includes('zoom') || lowerPlatform.includes('meet') || lowerPlatform.includes('teams')) {
      return <Video className="w-4 h-4" />;
    }
    return <Globe className="w-4 h-4" />;
  };

  // Helper function to get platform name
  const getPlatformName = (platform?: string) => {
    if (!platform) return 'Virtual Meeting';
    
    const lowerPlatform = platform.toLowerCase();
    if (lowerPlatform.includes('youtube')) return 'YouTube Live';
    if (lowerPlatform.includes('facebook')) return 'Facebook Live';
    if (lowerPlatform.includes('instagram')) return 'Instagram Live';
    if (lowerPlatform.includes('tiktok')) return 'TikTok Live';
    if (lowerPlatform.includes('twitch')) return 'Twitch';
    if (lowerPlatform.includes('zoom')) return 'Zoom Meeting';
    if (lowerPlatform.includes('meet')) return 'Google Meet';
    if (lowerPlatform.includes('teams')) return 'Microsoft Teams';
    return platform.charAt(0).toUpperCase() + platform.slice(1);
  };

  // Check if we have virtual links
  const hasVirtualLinks = service.virtualLink || (service.additionalLinks && service.additionalLinks.length > 0);
  const hasInPersonService = service.venue && service.address && service.date && service.time;

  // Google Maps embed URL using the service address
  const mapUrl = service.address ? 
    `https://maps.google.com/maps?q=${encodeURIComponent(service.address)}&t=&z=15&ie=UTF8&iwloc=&output=embed` : 
    '';

  return (
    <section id="service" className="py-12 md:py-20 px-4 bg-white">
      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
          opacity: 0;
        }

        .animate-slide-down {
          animation: slide-down 0.3s ease-out forwards;
        }

        iframe {
          border: none;
          border-radius: 1rem;
        }
      `}</style>

      <div className="max-w-7xl mx-auto">
        <div className="mb-12 md:mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-serif text-gray-800 inline-block relative">
            Service
            <div className="absolute -bottom-3 left-0 w-24 md:w-32 h-1 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full"></div>
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 md:gap-8 lg:gap-10">
          {/* Left Side - Map (only show if we have address) */}
          {hasInPersonService && (
            <div className="animate-fade-in" style={{ animationDelay: '100ms' }}>
              <div className="bg-gray-100 rounded-2xl md:rounded-3xl shadow-xl overflow-hidden h-full min-h-[400px] md:min-h-[500px] lg:min-h-[600px]">
                <iframe
                  width="100%"
                  height="100%"
                  src={mapUrl}
                  title="Service Location Map"
                  className="w-full h-full"
                />
              </div>
            </div>
          )}

          {/* Right Side - Service Details */}
          <div className="animate-fade-in space-y-6" style={{ animationDelay: '200ms' }}>
            {/* Introduction */}
            <div className="bg-gray-50 rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-sm border border-gray-200">
              <p className="text-gray-700 text-base md:text-lg mb-4 font-light">
                Please join us to pay a last tribute.
              </p>
              <p className="text-gray-600 text-sm md:text-base leading-relaxed font-light">
                We invite you to join us in a solemn gathering as we come together to celebrate the life of our beloved {memorialName}.
              </p>
              <p className="text-gray-600 text-sm md:text-base leading-relaxed mt-4 font-light">
                Your presence would mean a great deal to us as we remember and honor the legacy of a remarkable person. In this moment of remembrance, let us come together to share our fond memories, offer our support to one another, and bid farewell to a truly exceptional individual.
              </p>
            </div>

            {/* Location & Date Info - Only show if we have in-person service */}
            {hasInPersonService && (
              <div className="grid sm:grid-cols-2 gap-4 md:gap-6">
                <div className="bg-gray-50 rounded-2xl p-5 md:p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-400 rounded-full flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 text-sm md:text-base mb-1">Location</h3>
                      <p className="text-gray-600 text-xs md:text-sm font-light leading-relaxed">
                        {service.venue}<br />
                        {service.address}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-2xl p-5 md:p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-400 rounded-full flex items-center justify-center flex-shrink-0">
                      <Calendar className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 text-sm md:text-base mb-1">Date/time</h3>
                      <p className="text-gray-600 text-xs md:text-sm font-light">{service.date}</p>
                      <p className="text-gray-600 text-xs md:text-sm font-light flex items-center gap-1 mt-1">
                        <Clock className="w-3 h-3" />
                        {service.time}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Virtual Event Options - Show if we have any virtual links */}
            {hasVirtualLinks && (
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-5 md:p-6 shadow-sm border border-amber-200">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
                    <Video className="w-5 h-5 text-amber-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 text-sm md:text-base mb-2">Virtual Service Access</h3>
                    <p className="text-gray-700 text-xs md:text-sm font-light mb-3">
                      Can't attend in person? Join us virtually via the platforms below.
                    </p>
                    
                    <button 
                      onClick={() => setShowVirtualOptions(!showVirtualOptions)}
                      className="text-amber-600 hover:text-amber-700 font-medium text-xs md:text-sm flex items-center gap-1 transition-colors mb-3"
                    >
                      {showVirtualOptions ? 'Hide Virtual Options' : 'Show Virtual Options'} →
                    </button>
                    
                    {showVirtualOptions && (
                      <div className="mt-4 space-y-3 animate-slide-down">
                        {/* Primary Virtual Link */}
                        {service.virtualLink && service.virtualPlatform && (
                          <button
                            onClick={() => handleVirtualLink(service.virtualLink!)}
                            className="w-full px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium text-sm transition-colors flex items-center justify-center gap-2"
                          >
                            {getPlatformIcon(service.virtualPlatform)}
                            Join via {getPlatformName(service.virtualPlatform)}
                          </button>
                        )}

                        {/* Additional Platforms */}
                        {service.additionalLinks && service.additionalLinks.map((link, index) => (
                          <button
                            key={index}
                            onClick={() => handleVirtualLink(link.url)}
                            className="w-full px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg font-medium text-sm transition-colors flex items-center justify-center gap-2"
                          >
                            {getPlatformIcon(link.platform)}
                            Join via {link.platform}
                          </button>
                        ))}

                        <p className="text-xs text-gray-600 mt-2">
                          Note: Make sure pop-ups are allowed in your browser to open the links.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Message when no service details */}
            {!hasInPersonService && !hasVirtualLinks && (
              <div className="bg-gray-50 rounded-2xl p-6 text-center">
                <Video className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600">Service details will be announced soon.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};