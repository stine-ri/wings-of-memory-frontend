import React, { useState, useEffect } from 'react';
import { Users, Download, QrCode, Save, Plus, X, Trash2 } from 'lucide-react';
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

export const ServiceSection: React.FC = () => {
  const { 
    memorialData, 
    updateService, 
    saveToBackend, 
    saving 
  } = useMemorial();
  
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
  const [loadingRsvps, setLoadingRsvps] = useState(true);
  const [submittingRSVP, setSubmittingRSVP] = useState(false);
  const [localHasChanges, setLocalHasChanges] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const [newRSVP, setNewRSVP] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    attending: 'in_person' as 'in_person' | 'virtual',
    guests: 1
  });

  // Load RSVPs from backend
  useEffect(() => {
    const loadRSVPs = async () => {
      if (!memorialData?.id) {
        setLoadingRsvps(false);
        return;
      }

      try {
        setLoadingRsvps(true);
        const token = localStorage.getItem('token');
        
        if (!token) {
          console.log('No token available, skipping RSVP load');
          setLoadingRsvps(false);
          return;
        }

        const response = await fetch(
          `https://wings-of-memories-backend.onrender.com/api/rsvps/${memorialData.id}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );

        if (response.ok) {
          const data = await response.json();
          setRsvps(data.rsvps || []);
          console.log('✅ Loaded RSVPs:', data.rsvps?.length || 0);
        } else if (response.status === 404) {
          // Memorial has no RSVPs yet
          setRsvps([]);
        } else {
          console.error('Failed to load RSVPs:', response.status);
          setRsvps([]);
        }
      } catch (error) {
        console.error('Error loading RSVPs:', error);
        setRsvps([]);
      } finally {
        setLoadingRsvps(false);
      }
    };

    loadRSVPs();
  }, [memorialData?.id]);

  // Initialize service info from memorial data
  useEffect(() => {
    if (memorialData?.service) {
      console.log('📥 Initializing service from memorial data:', memorialData.service);
      setService({
        venue: memorialData.service.venue || '',
        address: memorialData.service.address || '',
        date: memorialData.service.date || '',
        time: memorialData.service.time || '',
        virtualLink: memorialData.service.virtualLink || '',
        virtualPlatform: memorialData.service.virtualPlatform || 'zoom'
      });
      // Reset local changes when loading from backend
      setLocalHasChanges(false);
    } else if (memorialData) {
      console.log('📥 Memorial exists but no service data, using defaults');
      setService({
        venue: '',
        address: '',
        date: '',
        time: '',
        virtualLink: '',
        virtualPlatform: 'zoom'
      });
      setLocalHasChanges(false);
    }
  }, [memorialData?.id]); // Only reset when memorial ID changes

  // Track local changes
  useEffect(() => {
    if (!memorialData) return;

    const originalService = memorialData.service || {
      venue: '',
      address: '',
      date: '',
      time: '',
      virtualLink: '',
      virtualPlatform: 'zoom'
    };

    const hasChanges = 
      service.venue !== originalService.venue ||
      service.address !== originalService.address ||
      service.date !== originalService.date ||
      service.time !== originalService.time ||
      (service.virtualLink || '') !== (originalService.virtualLink || '') ||
      service.virtualPlatform !== (originalService.virtualPlatform || 'zoom');

    setLocalHasChanges(hasChanges);
  }, [service, memorialData]);

  const handleServiceChange = (updates: Partial<ServiceInfo>) => {
    setService(prev => {
      const newService = { ...prev, ...updates };
      console.log('✏️ Service updated:', updates);
      return newService;
    });
  };

  const handleSaveService = async () => {
    if (!localHasChanges || saving) {
      console.log('⏭️ Save skipped:', { localHasChanges, saving });
      return;
    }

    try {
      console.log('💾 Starting save process...', service);
      setSaveError(null);
      setSaveSuccess(false);
      
      // Update the context with new service data - this will trigger context save
      updateService(service);
      
      // Wait a moment for context to update
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Save to backend
      const success = await saveToBackend();
      
      if (success) {
        console.log('✅ Service saved successfully');
        setSaveSuccess(true);
        setLocalHasChanges(false);
        
        // Clear success message after 3 seconds
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        throw new Error('Backend save failed');
      }
    } catch (error) {
      console.error('❌ Error saving service:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to save service details';
      setSaveError(errorMessage);
      
      // Clear error after 5 seconds
      setTimeout(() => setSaveError(null), 5000);
    }
  };

  const handleAddRSVP = async () => {
    if (!newRSVP.firstName.trim() || !newRSVP.lastName.trim() || !newRSVP.email.trim()) {
      alert('Please fill in all required fields (First Name, Last Name, and Email)');
      return;
    }

    setSubmittingRSVP(true);
    try {
      const token = localStorage.getItem('token');
      
      if (!token || !memorialData?.id) {
        throw new Error('Authentication required');
      }

      // Create RSVP via backend
      const response = await fetch('https://wings-of-memories-backend.onrender.com/api/rsvps', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          memorialId: memorialData.id,
          firstName: newRSVP.firstName,
          lastName: newRSVP.lastName,
          email: newRSVP.email,
          phone: newRSVP.phone,
          attending: newRSVP.attending,
          guests: newRSVP.guests
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create RSVP');
      }

      const data = await response.json();
      
      // Add to local state
      setRsvps(prev => [data.rsvp, ...prev]);
      
      // Reset form
      setNewRSVP({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        attending: 'in_person',
        guests: 1
      });
      setShowRSVPForm(false);
      
      console.log('✅ RSVP added successfully');
    } catch (error) {
      console.error('Error adding RSVP:', error);
      alert('Failed to add RSVP. Please try again.');
    } finally {
      setSubmittingRSVP(false);
    }
  };

  const handleDeleteRSVP = async (rsvpId: string) => {
    if (!confirm('Are you sure you want to delete this RSVP?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch(
        `https://wings-of-memories-backend.onrender.com/api/rsvps/${rsvpId}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to delete RSVP');
      }

      // Remove from local state
      setRsvps(prev => prev.filter(r => r.id !== rsvpId));
      
      console.log('✅ RSVP deleted successfully');
    } catch (error) {
      console.error('Error deleting RSVP:', error);
      alert('Failed to delete RSVP. Please try again.');
    }
  };

  const handleGenerateQRCode = () => {
    if (!service.venue || !service.address || !service.date || !service.time) {
      alert('Please fill in venue, address, date, and time before generating QR code');
      return;
    }
    setShowQRCode(true);
  };

  const handleExportRSVPs = () => {
    if (rsvps.length === 0) {
      alert('No RSVPs to export');
      return;
    }
    
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

    return JSON.stringify({
      type: 'memorial_service',
      url: memorialUrl,
      service: serviceDetails,
      timestamp: new Date().toISOString()
    });
  };

  const getMemorialUrl = () => {
    return memorialData?.customUrl 
      ? `${window.location.origin}/memorial/${memorialData.customUrl}`
      : `${window.location.origin}/memorial/${memorialData?.id}`;
  };

  const hasRequiredFields = service.venue.trim() && service.address.trim() && service.date && service.time;
  const shouldEnableSave = localHasChanges && !saving;

  const getSaveButtonStyles = () => {
    if (saveSuccess) {
      return 'bg-green-500 text-white cursor-default';
    }
    
    if (saveError) {
      return 'bg-red-500 text-white cursor-pointer hover:bg-red-600';
    }
    
    if (!shouldEnableSave) {
      return 'bg-gray-200 text-gray-500 cursor-not-allowed';
    }
    
    if (saving) {
      return 'bg-blue-500 text-white cursor-wait';
    }
    
    return 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 shadow-lg hover:shadow-xl cursor-pointer';
  };

  const stats = {
    total: rsvps.length,
    inPerson: rsvps.filter(r => r.attending === 'in_person').length,
    virtual: rsvps.filter(r => r.attending === 'virtual').length,
    totalGuests: rsvps.reduce((sum, rsvp) => sum + rsvp.guests, 0)
  };

  if (!memorialData) {
    return (
      <div className="max-w-6xl space-y-6 px-4 sm:px-6">
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="animate-pulse text-center py-8">Loading service data...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl space-y-6 px-4 sm:px-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div className="text-center sm:text-left">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">Service Details</h2>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">Manage memorial service information and RSVPs</p>
        </div>
        <div className="flex flex-wrap justify-center sm:justify-end gap-2">
          <button
            onClick={() => setShowRSVPForm(true)}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-amber-500 text-white rounded-full hover:bg-amber-600 transition-all text-sm"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add RSVP</span>
            <span className="sm:hidden">RSVP</span>
          </button>
          <button
            onClick={handleGenerateQRCode}
            disabled={!hasRequiredFields}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            <QrCode className="w-4 h-4" />
            <span className="hidden sm:inline">QR Code</span>
          </button>
          <button
            onClick={handleExportRSVPs}
            disabled={rsvps.length === 0}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export</span>
          </button>
        </div>
      </div>

      {/* Success/Error Messages */}
      {saveSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <p className="text-green-800 text-sm flex items-center gap-2">
            <span className="text-lg">✅</span>
            Service details saved successfully!
          </p>
        </div>
      )}

      {saveError && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-red-800 text-sm flex items-center gap-2">
            <span className="text-lg">❌</span>
            {saveError}
          </p>
        </div>
      )}

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Service Details Form */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Service Information</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Venue Name *</label>
                <input
                  type="text"
                  value={service.venue}
                  onChange={(e) => handleServiceChange({ venue: e.target.value })}
                  className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 text-sm sm:text-base"
                  placeholder="Enter venue name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Address *</label>
                <textarea
                  value={service.address}
                  onChange={(e) => handleServiceChange({ address: e.target.value })}
                  rows={3}
                  className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none text-sm sm:text-base"
                  placeholder="Full address"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date *</label>
                  <input
                    type="date"
                    value={service.date}
                    onChange={(e) => handleServiceChange({ date: e.target.value })}
                    className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 text-sm sm:text-base"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Time *</label>
                  <input
                    type="time"
                    value={service.time}
                    onChange={(e) => handleServiceChange({ time: e.target.value })}
                    className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 text-sm sm:text-base"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Virtual Meeting Link (Optional)</label>
                <input
                  type="url"
                  value={service.virtualLink || ''}
                  onChange={(e) => handleServiceChange({ virtualLink: e.target.value })}
                  className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 text-sm sm:text-base"
                  placeholder="https://zoom.us/j/..."
                />
                <div className="flex flex-wrap gap-3 mt-2">
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="radio"
                      name="platform"
                      checked={service.virtualPlatform === 'zoom'}
                      onChange={() => handleServiceChange({ virtualPlatform: 'zoom' })}
                      className="text-amber-500"
                    />
                    <span>Zoom</span>
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="radio"
                      name="platform"
                      checked={service.virtualPlatform === 'meet'}
                      onChange={() => handleServiceChange({ virtualPlatform: 'meet' })}
                      className="text-amber-500"
                    />
                    <span>Meet</span>
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="radio"
                      name="platform"
                      checked={service.virtualPlatform === 'teams'}
                      onChange={() => handleServiceChange({ virtualPlatform: 'teams' })}
                      className="text-amber-500"
                    />
                    <span>Teams</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <button 
              onClick={handleSaveService}
              disabled={!shouldEnableSave && !saveError}
              className={`w-full mt-6 px-6 py-3 rounded-lg transition-all font-medium flex items-center justify-center gap-2 text-sm sm:text-base ${getSaveButtonStyles()}`}
            >
              <Save className="w-4 h-4" />
              {saveSuccess ? 'Saved!' : saving ? 'Saving...' : saveError ? 'Retry Save' : 'Save Service Details'}
            </button>

            {!hasRequiredFields && localHasChanges && (
              <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-amber-800 text-sm">
                  💡 <strong>Note:</strong> Fill in all required fields (Venue, Address, Date, Time) for complete service information.
                </p>
              </div>
            )}
          </div>

      <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border-2 border-amber-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Memorial Completion Status</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="text-center bg-white rounded-lg p-3 shadow-sm">
            <div className="text-xl sm:text-2xl font-bold text-amber-600">
              {memorialData?.service?.venue && memorialData?.service?.address && memorialData?.service?.date && memorialData?.service?.time ? '✅' : '⭕'}
            </div>
            <div className="text-xs sm:text-sm text-amber-700 font-medium">Service</div>
          </div>
          <div className="text-center bg-white rounded-lg p-3 shadow-sm">
            <div className="text-xl sm:text-2xl font-bold text-amber-600">{stats.total > 0 ? '✅' : '⭕'}</div>
            <div className="text-xs sm:text-sm text-amber-700 font-medium">RSVPs</div>
          </div>
          <div className="text-center bg-white rounded-lg p-3 shadow-sm">
            <div className="text-xl sm:text-2xl font-bold text-amber-600">{hasRequiredFields ? '✅' : '⭕'}</div>
            <div className="text-xs sm:text-sm text-amber-700 font-medium">Complete</div>
          </div>
          <div className="text-center bg-white rounded-lg p-3 shadow-sm">
            <div className="text-xl sm:text-2xl font-bold text-amber-600">{!localHasChanges ? '✅' : '⏳'}</div>
            <div className="text-xs sm:text-sm text-amber-700 font-medium">Saved</div>
          </div>
        </div>
        {!hasRequiredFields && (
          <div className="mt-3 p-3 bg-amber-100 border border-amber-300 rounded-lg">
            <p className="text-amber-800 text-xs sm:text-sm text-center">
              💡 Complete all required fields to get a checkmark
            </p>
          </div>
        )}
      </div>

        {/* RSVP List */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">RSVP Responses ({rsvps.length})</h3>
          </div>
          
          {loadingRsvps ? (
            <div className="text-center py-8 text-gray-500">
              <div className="animate-spin w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full mx-auto mb-3"></div>
              <p className="text-sm">Loading RSVPs...</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {rsvps.map(rsvp => (
                <div key={rsvp.id} className="p-3 border border-gray-200 rounded-lg hover:border-amber-300 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-800 text-sm sm:text-base truncate">
                        {rsvp.firstName} {rsvp.lastName}
                      </h4>
                      <p className="text-xs sm:text-sm text-gray-600 truncate">{rsvp.email}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 ml-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        rsvp.attending === 'in_person' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {rsvp.attending === 'in_person' ? 'In Person' : 'Virtual'}
                      </span>
                      <button
                        onClick={() => handleDeleteRSVP(rsvp.id)}
                        className="p-1 text-red-400 hover:text-red-600 transition-colors"
                        title="Delete RSVP"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-600">
                    <span className="truncate mr-2">{rsvp.phone || 'No phone'}</span>
                    <span>{rsvp.guests} guest{rsvp.guests !== 1 ? 's' : ''}</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-2">
                    {new Date(rsvp.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loadingRsvps && rsvps.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p className="text-sm">No RSVPs yet</p>
              <p className="text-xs mt-1">Click "Add RSVP" to create your first RSVP</p>
            </div>
          )}
        </div>

        {/* RSVP Quick Stats */}
        <div className="mt-4">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">RSVP Statistics</h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 text-center">
              <div className="text-xl sm:text-2xl font-bold text-gray-800">{stats.total}</div>
              <div className="text-xs sm:text-sm text-gray-600">Total RSVPs</div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 text-center">
              <div className="text-xl sm:text-2xl font-bold text-gray-800">{stats.inPerson}</div>
              <div className="text-xs sm:text-sm text-gray-600">In Person</div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 text-center">
              <div className="text-xl sm:text-2xl font-bold text-gray-800">{stats.virtual}</div>
              <div className="text-xs sm:text-sm text-gray-600">Virtual</div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 text-center">
              <div className="text-xl sm:text-2xl font-bold text-gray-800">{stats.totalGuests}</div>
              <div className="text-xs sm:text-sm text-gray-600">Total Guests</div>
            </div>
          </div>
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
                className="flex-1 px-6 py-3 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
    </div>
  );
};