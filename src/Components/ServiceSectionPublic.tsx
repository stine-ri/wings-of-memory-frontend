import React, { useState } from 'react';
import { MapPin, Clock, Calendar, Video } from 'lucide-react';

interface ServiceInfo {
  venue: string;
  address: string;
  date: string;
  time: string;
  virtualLink?: string;
  virtualPlatform?: 'zoom' | 'meet' | 'teams';
}

interface ServiceSectionProps {
  service: ServiceInfo;
  memorialName: string;
}

export const ServiceSectionPublic: React.FC<ServiceSectionProps> = ({ service, memorialName }) => {
  const [showVirtualOptions, setShowVirtualOptions] = useState(false);

  // Only show the section if there's service data
  if (!service.venue && !service.address && !service.date && !service.time) {
    return null;
  }

  const handleVirtualLink = (platform: 'zoom' | 'meet' | 'teams') => {
    const url = service.virtualLink || (platform === 'zoom' ? 'https://zoom.us/' : 'https://meet.google.com/');
    
    const win = window.open(url, '_blank');
    
    if (!win || win.closed || typeof win.closed === 'undefined') {
      alert(`Please install ${platform === 'zoom' ? 'Zoom' : 'Google Meet'} to join virtually, or allow pop-ups in your browser.`);
    }
    
    setShowVirtualOptions(false);
  };

  // Google Maps embed URL using the service address
  const mapUrl = `https://maps.google.com/maps?q=${encodeURIComponent(service.address)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;

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
          {/* Left Side - Map */}
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

            {/* Location & Date Info */}
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

            {/* Virtual Event Option - Only show if virtual link exists */}
            {service.virtualLink && (
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-5 md:p-6 shadow-sm border border-amber-200">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
                    <Video className="w-5 h-5 text-amber-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 text-sm md:text-base mb-2">Virtual event</h3>
                    <p className="text-gray-700 text-xs md:text-sm font-light mb-3">
                      Can't attend in person? Join us virtually via {service.virtualPlatform || 'Zoom'}.
                    </p>
                    <button 
                      onClick={() => setShowVirtualOptions(!showVirtualOptions)}
                      className="text-amber-600 hover:text-amber-700 font-medium text-xs md:text-sm flex items-center gap-1 transition-colors"
                    >
                      Click here → 
                    </button>
                    
                    {showVirtualOptions && (
                      <div className="mt-4 p-4 bg-white rounded-xl border border-amber-200 animate-slide-down">
                        <p className="text-sm text-gray-700 mb-3 font-medium">Join virtual service:</p>
                        <button
                          onClick={() => handleVirtualLink(service.virtualPlatform || 'zoom')}
                          className="w-full px-4 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium text-sm transition-colors flex items-center justify-center gap-2"
                        >
                          <Video className="w-4 h-4" />
                          Join via {service.virtualPlatform || 'Zoom'}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};