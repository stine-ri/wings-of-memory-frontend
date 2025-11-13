import React, { useState, useEffect, useCallback } from 'react';
import { Users, Download, QrCode, Save, Plus, X } from 'lucide-react';
import { useMemorial } from '../../hooks/useMemorial';
import { QRCodeSVG } from 'qrcode.react';

interface ServiceInfo {
  venue: string;
  address: string;
  date: string;
  time: string;
  virtualLink?: string;
  virtualPlatform?: 'zoom' | 'meet' | 'teams';
}

interface RSVP {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  attending: 'in_person' | 'virtual';
  guests: number;
  createdAt: string;
}

// Debounce hook for auto-saving
const useDebounce = <T,>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

export const ServiceSection: React.FC = () => {
  const { memorialData, updateService, saveToBackend } = useMemorial();
  const [service, setService] = useState<ServiceInfo>({
    venue: '',
    address: '',
    date: '',
    time: '',
    virtualLink: '',
    virtualPlatform: 'zoom'
  });
  const [rsvps, setRsvps] = useState<RSVP[]>([]);
  const [showQRCode, setShowQRCode] = useState(false);
  const [showRSVPForm, setShowRSVPForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loadingRsvps, setLoadingRsvps] = useState(true);
  const [submittingRSVP, setSubmittingRSVP] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);

  const [newRSVP, setNewRSVP] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    attending: 'in_person' as 'in_person' | 'virtual',
    guests: 1
  });

  const debouncedService = useDebounce(service, 1000);

  // Initialize service info from memorial data (only once)
  useEffect(() => {
    if (memorialData?.service && !hasInitialized) {
      setService(memorialData.service);
      setHasInitialized(true);
    }
  }, [memorialData, hasInitialized]);

  // Memoize the comparison function
  const hasChanges = useCallback((currentService: ServiceInfo) => {
    if (!memorialData?.service) return true;
    return JSON.stringify(currentService) !== JSON.stringify(memorialData.service);
  }, [memorialData]);

  // Auto-save debounced changes
  useEffect(() => {
    if (hasInitialized && hasChanges(debouncedService)) {
      updateService(debouncedService);
    }
  }, [debouncedService, hasInitialized, hasChanges, updateService]);

  // Warn about unsaved changes
  useEffect(() => {
    const hasUnsavedChanges = hasChanges(service);
    
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [service, hasChanges]);

  // Load RSVPs from backend
  useEffect(() => {
    const loadRsvps = async () => {
      if (!memorialData?.id) return;

      try {
        setLoadingRsvps(true);
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Authentication token not found');
        }

        const response = await fetch(`https://wings-of-memories-backend.onrender.com/api/rsvps/${memorialData.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setRsvps(data.rsvps || []);
        } else {
          // If no RSVPs endpoint, use mock data for demo
          setRsvps([]);
        }
      } catch (error) {
        console.error('Error loading RSVPs:', error);
        // Fallback to empty array if endpoint doesn't exist
        setRsvps([]);
      } finally {
        setLoadingRsvps(false);
      }
    };

    loadRsvps();
  }, [memorialData?.id]);

  const handleServiceChange = (updates: Partial<ServiceInfo>) => {
    setService(prev => ({ ...prev, ...updates }));
  };

  const handleSaveService = async () => {
    setSaving(true);
    try {
      await updateService(service);
      await saveToBackend();
      alert('Service details saved successfully!');
    } catch (error) {
      console.error('Error saving service details:', error);
      alert('Failed to save service details. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleAddRSVP = async () => {
    if (!newRSVP.firstName.trim() || !newRSVP.lastName.trim() || !newRSVP.email.trim()) {
      alert('Please fill in all required fields (First Name, Last Name, and Email)');
      return;
    }

    setSubmittingRSVP(true);
    try {
      const newRsvp: RSVP = {
        id: Date.now().toString(),
        ...newRSVP,
        createdAt: new Date().toISOString()
      };

      const updatedRsvps = [newRsvp, ...rsvps];
      setRsvps(updatedRsvps);
      
      // Save to backend if you have an API endpoint
      if (memorialData?.id) {
        const token = localStorage.getItem('token');
        if (token) {
          await fetch(`https://wings-of-memories-backend.onrender.com/api/rsvps/${memorialData.id}`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(newRsvp)
          });
        }
      }

      setNewRSVP({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        attending: 'in_person',
        guests: 1
      });
      setShowRSVPForm(false);
      alert('RSVP added successfully!');
    } catch (error) {
      console.error('Error adding RSVP:', error);
      alert('Failed to add RSVP. Please try again.');
    } finally {
      setSubmittingRSVP(false);
    }
  };

  const handleGenerateQRCode = () => {
    setShowQRCode(true);
  };

  const handleExportRSVPs = () => {
    const csvContent = [
      ['Name', 'Email', 'Phone', 'Attending', 'Guests', 'Date'],
      ...rsvps.map(rsvp => [
        `${rsvp.firstName} ${rsvp.lastName}`,
        rsvp.email,
        rsvp.phone,
        rsvp.attending === 'in_person' ? 'In Person' : 'Virtual',
        rsvp.guests.toString(),
        new Date(rsvp.createdAt).toLocaleDateString()
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `memorial-rsvps-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const downloadQRCode = () => {
    const element = document.getElementById('memorial-qr-code');

    if (element && element instanceof SVGSVGElement) {
      const svgData = new XMLSerializer().serializeToString(element);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);
        const pngUrl = canvas.toDataURL('image/png');
        const downloadLink = document.createElement('a');
        downloadLink.href = pngUrl;
        downloadLink.download = `memorial-service-qr-${memorialData?.name || 'service'}.png`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
      };

      img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
    }
  };

  // Enhanced QR code data with service information
  const getQRCodeData = () => {
    const memorialUrl = getMemorialUrl();
    const serviceDetails = {
      title: `${memorialData?.name || 'Memorial'} Service`,
      venue: service.venue,
      address: service.address,
      date: service.date,
      time: service.time,
      virtualLink: service.virtualLink,
      virtualPlatform: service.virtualPlatform
    };

    // Create a structured data object for the QR code
    return JSON.stringify({
      type: 'memorial_service',
      url: memorialUrl,
      service: serviceDetails,
      timestamp: new Date().toISOString()
    });
  };

  const getMemorialUrl = () => {
    // Replace with your actual memorial URL structure
    return memorialData?.customUrl 
      ? `${window.location.origin}/memorial/${memorialData.customUrl}`
      : `${window.location.origin}/memorial/${memorialData?.id}`;
  };

  const stats = {
    total: rsvps.length,
    inPerson: rsvps.filter(r => r.attending === 'in_person').length,
    virtual: rsvps.filter(r => r.attending === 'virtual').length,
    totalGuests: rsvps.reduce((sum, rsvp) => sum + rsvp.guests, 0)
  };

  // Show loading state while initializing
  if (!hasInitialized && !memorialData) {
    return (
      <div className="max-w-6xl space-y-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="animate-pulse text-center py-8">Loading service data...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">Service Details</h2>
          <p className="text-gray-600 mt-1">Manage memorial service information and RSVPs</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowRSVPForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-full hover:bg-amber-600 transition-all"
          >
            <Plus className="w-4 h-4" />
            Add RSVP
          </button>
          <button
            onClick={handleGenerateQRCode}
            disabled={!service.venue || !service.date}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-all disabled:opacity-50"
          >
            <QrCode className="w-4 h-4" />
            QR Code
          </button>
          <button
            onClick={handleExportRSVPs}
            disabled={rsvps.length === 0}
            className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-all disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            Export RSVPs
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Service Details Form */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Service Information</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Venue Name *</label>
                <input
                  type="text"
                  value={service.venue}
                  onChange={(e) => handleServiceChange({ venue: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400"
                  placeholder="Enter venue name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Address *</label>
                <textarea
                  value={service.address}
                  onChange={(e) => handleServiceChange({ address: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none"
                  placeholder="Full address"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date *</label>
                  <input
                    type="date"
                    value={service.date}
                    onChange={(e) => handleServiceChange({ date: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Time *</label>
                  <input
                    type="time"
                    value={service.time}
                    onChange={(e) => handleServiceChange({ time: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Virtual Meeting Link (Optional)</label>
                <input
                  type="url"
                  value={service.virtualLink || ''}
                  onChange={(e) => handleServiceChange({ virtualLink: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400"
                  placeholder="https://zoom.us/j/..."
                />
                <div className="flex gap-4 mt-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="platform"
                      checked={service.virtualPlatform === 'zoom'}
                      onChange={() => handleServiceChange({ virtualPlatform: 'zoom' })}
                      className="text-amber-500"
                    />
                    <span className="text-sm text-gray-700">Zoom</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="platform"
                      checked={service.virtualPlatform === 'meet'}
                      onChange={() => handleServiceChange({ virtualPlatform: 'meet' })}
                      className="text-amber-500"
                    />
                    <span className="text-sm text-gray-700">Google Meet</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="platform"
                      checked={service.virtualPlatform === 'teams'}
                      onChange={() => handleServiceChange({ virtualPlatform: 'teams' })}
                      className="text-amber-500"
                    />
                    <span className="text-sm text-gray-700">Teams</span>
                  </label>
                </div>
              </div>
            </div>

            <button 
              onClick={handleSaveService}
              disabled={saving || !hasChanges(service)}
              className="w-full mt-6 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg hover:from-amber-600 hover:to-orange-600 transition-all font-medium disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Saving...' : 'Save Service Details'}
            </button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 text-center">
              <div className="text-2xl font-bold text-gray-800">{stats.total}</div>
              <div className="text-sm text-gray-600">Total RSVPs</div>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 text-center">
              <div className="text-2xl font-bold text-gray-800">{stats.inPerson}</div>
              <div className="text-sm text-gray-600">In Person</div>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 text-center">
              <div className="text-2xl font-bold text-gray-800">{stats.virtual}</div>
              <div className="text-sm text-gray-600">Virtual</div>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 text-center">
              <div className="text-2xl font-bold text-gray-800">{stats.totalGuests}</div>
              <div className="text-sm text-gray-600">Total Guests</div>
            </div>
          </div>
        </div>

        {/* RSVP List */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">RSVP Responses ({rsvps.length})</h3>
          </div>
          
          {loadingRsvps ? (
            <div className="text-center py-8 text-gray-500">
              <div className="animate-spin w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full mx-auto mb-3"></div>
              <p>Loading RSVPs...</p>
            </div>
          ) : (
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {rsvps.map(rsvp => (
                <div key={rsvp.id} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-semibold text-gray-800">
                        {rsvp.firstName} {rsvp.lastName}
                      </h4>
                      <p className="text-sm text-gray-600">{rsvp.email}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      rsvp.attending === 'in_person' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {rsvp.attending === 'in_person' ? 'In Person' : 'Virtual'}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>{rsvp.phone}</span>
                    <span>{rsvp.guests} guest{rsvp.guests !== 1 ? 's' : ''}</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-2">
                    Responded on {new Date(rsvp.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loadingRsvps && rsvps.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>No RSVPs yet</p>
              <p className="text-sm">Click "Add RSVP" to create your first RSVP</p>
            </div>
          )}
        </div>
      </div>

      {/* Add RSVP Modal */}
      {showRSVPForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-800">Add RSVP</h3>
              <button
                onClick={() => setShowRSVPForm(false)}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                  <input
                    type="text"
                    value={newRSVP.firstName}
                    onChange={(e) => setNewRSVP(prev => ({ ...prev, firstName: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400"
                    placeholder="First name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                  <input
                    type="text"
                    value={newRSVP.lastName}
                    onChange={(e) => setNewRSVP(prev => ({ ...prev, lastName: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400"
                    placeholder="Last name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                <input
                  type="email"
                  value={newRSVP.email}
                  onChange={(e) => setNewRSVP(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400"
                  placeholder="email@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                <input
                  type="tel"
                  value={newRSVP.phone}
                  onChange={(e) => setNewRSVP(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400"
                  placeholder="Phone number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Attending</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="attending"
                      checked={newRSVP.attending === 'in_person'}
                      onChange={() => setNewRSVP(prev => ({ ...prev, attending: 'in_person' }))}
                      className="text-amber-500"
                    />
                    <span className="text-sm text-gray-700">In Person</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="attending"
                      checked={newRSVP.attending === 'virtual'}
                      onChange={() => setNewRSVP(prev => ({ ...prev, attending: 'virtual' }))}
                      className="text-amber-500"
                    />
                    <span className="text-sm text-gray-700">Virtual</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Number of Guests</label>
                <select
                  value={newRSVP.guests}
                  onChange={(e) => setNewRSVP(prev => ({ ...prev, guests: parseInt(e.target.value) }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                    <option key={num} value={num}>{num} guest{num !== 1 ? 's' : ''}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleAddRSVP}
                disabled={submittingRSVP || !newRSVP.firstName.trim() || !newRSVP.lastName.trim() || !newRSVP.email.trim()}
                className="flex-1 px-6 py-3 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors disabled:opacity-50"
              >
                {submittingRSVP ? 'Adding...' : 'Add RSVP'}
              </button>
              <button
                onClick={() => setShowRSVPForm(false)}
                className="flex-1 px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* QR Code Modal */}
      {showQRCode && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 text-center">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-800">Memorial Service QR Code</h3>
              <button
                onClick={() => setShowQRCode(false)}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="bg-white p-6 rounded-lg mb-4 flex items-center justify-center">
              <QRCodeSVG 
                id="memorial-qr-code"
                value={getQRCodeData()}
                size={200}
                level="H"
                includeMargin
              />
            </div>
            
            <div className="text-left mb-4">
              <h4 className="font-semibold text-gray-800 mb-2">Service Details:</h4>
              <div className="text-sm text-gray-600 space-y-1">
                <p><strong>Venue:</strong> {service.venue || 'Not set'}</p>
                <p><strong>Date:</strong> {service.date || 'Not set'}</p>
                <p><strong>Time:</strong> {service.time || 'Not set'}</p>
                {service.virtualLink && (
                  <p><strong>Virtual:</strong> Available</p>
                )}
              </div>
            </div>
            
            <p className="text-sm text-gray-500 mb-4">
              Scan this code to view memorial service details and RSVP
            </p>
            
            <div className="flex gap-3">
              <button 
                onClick={downloadQRCode}
                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Download PNG
              </button>
              <button 
                onClick={() => setShowQRCode(false)}
                className="flex-1 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};