import React, { useState } from 'react';
import { MapPin, Clock, Calendar, Users, Video, CheckCircle, AlertCircle, X } from 'lucide-react';

interface ServiceInfo {
  venue: string;
  address: string;
  date: string;
  time: string;
}

interface ServiceSectionProps {
  service: ServiceInfo;
  memorialName: string;
}

interface Guest {
  id: number;
  firstName: string;
  lastName: string;
}

export const ServiceSection: React.FC<ServiceSectionProps> = ({ service, memorialName }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [attending, setAttending] = useState('attending');
  const [guests, setGuests] = useState<Guest[]>([]);
  const [showVirtualOptions, setShowVirtualOptions] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackType, setFeedbackType] = useState<'success' | 'error'>('success');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePhone = (phone: string) => {
    const re = /^[\d\s\-+()]+$/;
    return phone.length >= 10 && re.test(phone);
  };

  const handleAddGuest = () => {
    const newGuest: Guest = {
      id: Date.now(),
      firstName: '',
      lastName: ''
    };
    setGuests([...guests, newGuest]);
  };

  const handleRemoveGuest = (id: number) => {
    setGuests(guests.filter(guest => guest.id !== id));
  };

  const handleGuestChange = (id: number, field: 'firstName' | 'lastName', value: string) => {
    setGuests(guests.map(guest => 
      guest.id === id ? { ...guest, [field]: value } : guest
    ));
  };

  const handleVirtualLink = (platform: 'zoom' | 'meet') => {
    const zoomUrl = 'https://zoom.us/';
    const meetUrl = 'https://meet.google.com/';
    
    const url = platform === 'zoom' ? zoomUrl : meetUrl;
    
    // Check if user can open the app
    const win = window.open(url, '_blank');
    
    if (!win || win.closed || typeof win.closed === 'undefined') {
      // Popup blocked or couldn't open
      alert(`Please install ${platform === 'zoom' ? 'Zoom' : 'Google Meet'} to join virtually, or allow pop-ups in your browser.`);
    }
    
    setShowVirtualOptions(false);
  };

  const handleSubmit = () => {
    const newErrors: {[key: string]: string} = {};

    // Validate main attendee
    if (!firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    if (!lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    if (email && !validateEmail(email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (phone && !validatePhone(phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    // Validate guests
    guests.forEach((guest, index) => {
      if (!guest.firstName.trim()) {
        newErrors[`guest${index}FirstName`] = 'Guest first name is required';
      }
      if (!guest.lastName.trim()) {
        newErrors[`guest${index}LastName`] = 'Guest last name is required';
      }
    });

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      setFeedbackType('error');
      setFeedbackMessage('Please fill in all required fields correctly');
      setShowFeedback(true);
      setTimeout(() => setShowFeedback(false), 5000);
      return;
    }

    // Success
    setFeedbackType('success');
    setFeedbackMessage(`RSVP submitted successfully for ${firstName} ${lastName}${guests.length > 0 ? ` and ${guests.length} guest${guests.length > 1 ? 's' : ''}` : ''}. You are ${attending === 'attending' ? 'attending in person' : 'joining virtually'}.`);
    setShowFeedback(true);

    // Reset form after 3 seconds
    setTimeout(() => {
      setFirstName('');
      setLastName('');
      setEmail('');
      setPhone('');
      setGuests([]);
      setAttending('attending');
      setShowFeedback(false);
    }, 3000);
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

        {/* Feedback Message */}
        {showFeedback && (
          <div className={`mb-6 p-4 rounded-xl flex items-start gap-3 animate-slide-down ${
            feedbackType === 'success' 
              ? 'bg-green-50 border border-green-200' 
              : 'bg-red-50 border border-red-200'
          }`}>
            {feedbackType === 'success' ? (
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            )}
            <p className={`text-sm md:text-base ${
              feedbackType === 'success' ? 'text-green-800' : 'text-red-800'
            }`}>
              {feedbackMessage}
            </p>
          </div>
        )}

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

          {/* Right Side - Service Details & RSVP */}
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

            {/* Virtual Event Option */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-5 md:p-6 shadow-sm border border-amber-200">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
                  <Video className="w-5 h-5 text-amber-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800 text-sm md:text-base mb-2">Virtual event</h3>
                  <p className="text-gray-700 text-xs md:text-sm font-light mb-3">
                    Can't attend in person? Join us virtually via Zoom or Google Meet.
                  </p>
                  <button 
                    onClick={() => setShowVirtualOptions(!showVirtualOptions)}
                    className="text-amber-600 hover:text-amber-700 font-medium text-xs md:text-sm flex items-center gap-1 transition-colors"
                  >
                    Click here → 
                  </button>
                  
                  {showVirtualOptions && (
                    <div className="mt-4 p-4 bg-white rounded-xl border border-amber-200 animate-slide-down">
                      <p className="text-sm text-gray-700 mb-3 font-medium">Choose your platform:</p>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <button
                          onClick={() => handleVirtualLink('zoom')}
                          className="flex-1 px-4 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium text-sm transition-colors flex items-center justify-center gap-2"
                        >
                          <Video className="w-4 h-4" />
                          Join via Zoom
                        </button>
                        <button
                          onClick={() => handleVirtualLink('meet')}
                          className="flex-1 px-4 py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium text-sm transition-colors flex items-center justify-center gap-2"
                        >
                          <Video className="w-4 h-4" />
                          Join via Google Meet
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* RSVP Form */}
            <div className="bg-gray-50 rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-sm border border-gray-200">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-400 rounded-full flex items-center justify-center">
                  <Users className="w-4 h-4 text-white" />
                </div>
                <h3 className="font-semibold text-gray-800 text-lg md:text-xl">RSVP</h3>
              </div>

              <div className="space-y-5">
                {/* Name Fields */}
                <div className="grid grid-cols-2 gap-3 md:gap-4">
                  <div>
                    <label className="block text-xs md:text-sm text-gray-600 mb-2 font-medium">FIRST NAME *</label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="John"
                      className={`w-full px-4 py-2.5 md:py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all text-sm md:text-base ${
                        errors.firstName 
                          ? 'border-red-300 focus:ring-red-400' 
                          : 'border-gray-300 focus:ring-amber-400 focus:border-transparent'
                      }`}
                    />
                    {errors.firstName && (
                      <p className="text-xs text-red-600 mt-1">{errors.firstName}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs md:text-sm text-gray-600 mb-2 font-medium">LAST NAME *</label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Doe"
                      className={`w-full px-4 py-2.5 md:py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all text-sm md:text-base ${
                        errors.lastName 
                          ? 'border-red-300 focus:ring-red-400' 
                          : 'border-gray-300 focus:ring-amber-400 focus:border-transparent'
                      }`}
                    />
                    {errors.lastName && (
                      <p className="text-xs text-red-600 mt-1">{errors.lastName}</p>
                    )}
                  </div>
                </div>

                {/* Attendance Options */}
                <div>
                  <label className="flex items-center gap-3 p-3 md:p-4 border-2 rounded-xl cursor-pointer hover:bg-amber-50 transition-colors mb-2">
                    <input
                      type="radio"
                      name="attendance"
                      value="attending"
                      checked={attending === 'attending'}
                      onChange={(e) => setAttending(e.target.value)}
                      className="w-4 h-4 md:w-5 md:h-5 text-amber-500 focus:ring-amber-400"
                    />
                    <span className="text-gray-700 text-sm md:text-base font-light flex-1">Attending</span>
                  </label>
                  <label className="flex items-center gap-3 p-3 md:p-4 border-2 rounded-xl cursor-pointer hover:bg-amber-50 transition-colors">
                    <input
                      type="radio"
                      name="attendance"
                      value="virtual"
                      checked={attending === 'virtual'}
                      onChange={(e) => setAttending(e.target.value)}
                      className="w-4 h-4 md:w-5 md:h-5 text-amber-500 focus:ring-amber-400"
                    />
                    <span className="text-gray-700 text-sm md:text-base font-light flex-1">Virtual attendance</span>
                  </label>
                </div>

                {/* Guests */}
                {guests.map((guest, index) => (
                  <div key={guest.id} className="p-4 bg-white rounded-xl border border-gray-200 animate-slide-down">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-gray-700 text-sm">Guest {index + 1}</h4>
                      <button
                        onClick={() => handleRemoveGuest(guest.id)}
                        className="text-red-500 hover:text-red-600 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <input
                          type="text"
                          value={guest.firstName}
                          onChange={(e) => handleGuestChange(guest.id, 'firstName', e.target.value)}
                          placeholder="First name"
                          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-all text-sm ${
                            errors[`guest${index}FirstName`]
                              ? 'border-red-300 focus:ring-red-400'
                              : 'border-gray-300 focus:ring-amber-400'
                          }`}
                        />
                        {errors[`guest${index}FirstName`] && (
                          <p className="text-xs text-red-600 mt-1">{errors[`guest${index}FirstName`]}</p>
                        )}
                      </div>
                      <div>
                        <input
                          type="text"
                          value={guest.lastName}
                          onChange={(e) => handleGuestChange(guest.id, 'lastName', e.target.value)}
                          placeholder="Last name"
                          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-all text-sm ${
                            errors[`guest${index}LastName`]
                              ? 'border-red-300 focus:ring-red-400'
                              : 'border-gray-300 focus:ring-amber-400'
                          }`}
                        />
                        {errors[`guest${index}LastName`] && (
                          <p className="text-xs text-red-600 mt-1">{errors[`guest${index}LastName`]}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {/* Add Guest Button */}
                <button
                  type="button"
                  onClick={handleAddGuest}
                  className="text-amber-600 hover:text-amber-700 font-medium text-sm md:text-base flex items-center gap-2 transition-colors"
                >
                  + Add guest
                </button>

                {/* Contact Fields */}
                <div className="grid sm:grid-cols-2 gap-3 md:gap-4">
                  <div>
                    <label className="block text-xs md:text-sm text-gray-600 mb-2 font-medium">E-MAIL</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      className={`w-full px-4 py-2.5 md:py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all text-sm md:text-base ${
                        errors.email 
                          ? 'border-red-300 focus:ring-red-400' 
                          : 'border-gray-300 focus:ring-amber-400 focus:border-transparent'
                      }`}
                    />
                    {errors.email && (
                      <p className="text-xs text-red-600 mt-1">{errors.email}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs md:text-sm text-gray-600 mb-2 font-medium">MOBILE PHONE</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1 (555) 123-4567"
                      className={`w-full px-4 py-2.5 md:py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all text-sm md:text-base ${
                        errors.phone 
                          ? 'border-red-300 focus:ring-red-400' 
                          : 'border-gray-300 focus:ring-amber-400 focus:border-transparent'
                      }`}
                    />
                    {errors.phone && (
                      <p className="text-xs text-red-600 mt-1">{errors.phone}</p>
                    )}
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="w-full bg-gradient-to-r from-green-400 to-teal-400 hover:from-green-500 hover:to-teal-500 text-white py-3 md:py-4 rounded-xl font-medium text-sm md:text-base shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2"
                >
                  Submit RSVP →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};