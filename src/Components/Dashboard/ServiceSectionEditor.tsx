import React, { useState, useEffect } from 'react';
import { QrCode, Save, Plus, X } from 'lucide-react'; // Removed Download
import { useMemorial } from '../../hooks/useMemorial';
import { QRCodeSVG } from 'qrcode.react';

interface ServiceInfo {
  venue: string;
  address: string;
  date: string;
  time: string;
  virtualLink?: string;
  virtualPlatform?: 'zoom' | 'meet' | 'teams' | 'youtube' | 'facebook' | 'instagram' | 'tiktok' | 'twitch' | 'other';
  additionalLinks?: Array<{
    platform: string;
    url: string;
  }>;
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
    virtualPlatform: 'zoom',
    additionalLinks: []
  });
  
  const [showQRCode, setShowQRCode] = useState(false);
  const [localHasChanges, setLocalHasChanges] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [newLink, setNewLink] = useState({ platform: '', url: '' });

  // Initialize service info from memorial data
  useEffect(() => {
    if (memorialData?.service) {
      console.log('📥 Initializing service from memorial data:', memorialData.service);
      // Safely cast the service data to our interface
      const serviceData = memorialData.service as ServiceInfo;
      setService({
        venue: serviceData.venue || '',
        address: serviceData.address || '',
        date: serviceData.date || '',
        time: serviceData.time || '',
        virtualLink: serviceData.virtualLink || '',
        virtualPlatform: serviceData.virtualPlatform || 'zoom',
        additionalLinks: serviceData.additionalLinks || []
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
        virtualPlatform: 'zoom',
        additionalLinks: []
      });
      setLocalHasChanges(false);
    }
  }, [memorialData, memorialData?.id]); // Added memorialData dependency

  // Track local changes
  useEffect(() => {
    if (!memorialData) return;

    const originalService = memorialData.service ? (memorialData.service as ServiceInfo) : {
      venue: '',
      address: '',
      date: '',
      time: '',
      virtualLink: '',
      virtualPlatform: 'zoom',
      additionalLinks: []
    };

    const hasChanges = 
      service.venue !== originalService.venue ||
      service.address !== originalService.address ||
      service.date !== originalService.date ||
      service.time !== originalService.time ||
      (service.virtualLink || '') !== (originalService.virtualLink || '') ||
      service.virtualPlatform !== (originalService.virtualPlatform || 'zoom') ||
      JSON.stringify(service.additionalLinks || []) !== JSON.stringify(originalService.additionalLinks || []);

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
      
      // Create a properly typed service object for the update
      const serviceToSave = {
        venue: service.venue,
        address: service.address,
        date: service.date,
        time: service.time,
        virtualLink: service.virtualLink,
        virtualPlatform: service.virtualPlatform,
        additionalLinks: service.additionalLinks
      };
      
      // Update the context with new service data
      updateService(serviceToSave);
      
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

  const handleGenerateQRCode = () => {
    if (!service.venue || !service.address || !service.date || !service.time) {
      alert('Please fill in venue, address, date, and time before generating QR code');
      return;
    }
    setShowQRCode(true);
  };

  const handleAddLink = () => {
    if (!newLink.platform.trim() || !newLink.url.trim()) {
      alert('Please enter both platform and URL');
      return;
    }

    if (!isValidUrl(newLink.url)) {
      alert('Please enter a valid URL starting with http:// or https://');
      return;
    }

    const updatedLinks = [...(service.additionalLinks || []), { ...newLink }];
    handleServiceChange({ additionalLinks: updatedLinks });
    setNewLink({ platform: '', url: '' });
  };

  const handleRemoveLink = (index: number) => {
    const updatedLinks = [...(service.additionalLinks || [])];
    updatedLinks.splice(index, 1);
    handleServiceChange({ additionalLinks: updatedLinks });
  };

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
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
      virtualPlatform: service.virtualPlatform,
      additionalLinks: service.additionalLinks
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
    
    return 'bg-linear-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 shadow-lg hover:shadow-xl cursor-pointer';
  };

  const getPlatformIcon = (platform: string) => {
    const lowerPlatform = platform.toLowerCase();
    if (lowerPlatform.includes('youtube')) return '▶️';
    if (lowerPlatform.includes('facebook')) return '📘';
    if (lowerPlatform.includes('instagram')) return '📷';
    if (lowerPlatform.includes('tiktok')) return '🎵';
    if (lowerPlatform.includes('twitch')) return '🎮';
    if (lowerPlatform.includes('zoom')) return '📹';
    if (lowerPlatform.includes('meet')) return '📅';
    if (lowerPlatform.includes('teams')) return '💼';
    return '🔗';
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
          <p className="text-gray-600 mt-1 text-sm sm:text-base">Manage memorial service information</p>
        </div>
        <div className="flex flex-wrap justify-center sm:justify-end gap-2">
          <button
            onClick={handleGenerateQRCode}
            disabled={!hasRequiredFields}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            <QrCode className="w-4 h-4" />
            <span className="hidden sm:inline">QR Code</span>
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
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="radio"
                      name="platform"
                      checked={service.virtualPlatform === 'youtube'}
                      onChange={() => handleServiceChange({ virtualPlatform: 'youtube' })}
                      className="text-amber-500"
                    />
                    <span>YouTube</span>
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="radio"
                      name="platform"
                      checked={service.virtualPlatform === 'facebook'}
                      onChange={() => handleServiceChange({ virtualPlatform: 'facebook' })}
                      className="text-amber-500"
                    />
                    <span>Facebook</span>
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="radio"
                      name="platform"
                      checked={service.virtualPlatform === 'tiktok'}
                      onChange={() => handleServiceChange({ virtualPlatform: 'tiktok' })}
                      className="text-amber-500"
                    />
                    <span>TikTok</span>
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="radio"
                      name="platform"
                      checked={service.virtualPlatform === 'instagram'}
                      onChange={() => handleServiceChange({ virtualPlatform: 'instagram' })}
                      className="text-amber-500"
                    />
                    <span>Instagram</span>
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="radio"
                      name="platform"
                      checked={service.virtualPlatform === 'twitch'}
                      onChange={() => handleServiceChange({ virtualPlatform: 'twitch' })}
                      className="text-amber-500"
                    />
                    <span>Twitch</span>
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="radio"
                      name="platform"
                      checked={service.virtualPlatform === 'other'}
                      onChange={() => handleServiceChange({ virtualPlatform: 'other' })}
                      className="text-amber-500"
                    />
                    <span>Other</span>
                  </label>
                </div>
              </div>

              {/* Additional Links Section */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Additional Virtual Platforms</h4>
                
                {/* Existing Links */}
                <div className="space-y-2 mb-4">
                  {(service.additionalLinks || []).map((link, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                      <span className="text-lg">{getPlatformIcon(link.platform)}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 truncate">{link.platform}</p>
                        <p className="text-xs text-gray-600 truncate">{link.url}</p>
                      </div>
                      <button
                        onClick={() => handleRemoveLink(index)}
                        className="p-1 text-red-400 hover:text-red-600 transition-colors"
                        title="Remove link"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Add New Link Form */}
                <div className="space-y-3 p-3 bg-amber-50 rounded-lg border border-amber-200">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Platform</label>
                      <input
                        type="text"
                        value={newLink.platform}
                        onChange={(e) => setNewLink(prev => ({ ...prev, platform: e.target.value }))}
                        className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-400 text-sm"
                        placeholder="e.g., YouTube Live, Instagram Live"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">URL</label>
                      <input
                        type="url"
                        value={newLink.url}
                        onChange={(e) => setNewLink(prev => ({ ...prev, url: e.target.value }))}
                        className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-400 text-sm"
                        placeholder="https://..."
                      />
                    </div>
                  </div>
                  <button
                    onClick={handleAddLink}
                    disabled={!newLink.platform.trim() || !newLink.url.trim()}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  >
                    <Plus className="w-4 h-4" />
                    Add Platform Link
                  </button>
                </div>

                <p className="text-xs text-gray-500 mt-2">
                  Add links to other platforms like YouTube Live, Instagram Live, TikTok Live, etc.
                </p>
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

          {/* Completion Status */}
          <div className="bg-linear-to-br from-amber-50 to-orange-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border-2 border-amber-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Memorial Completion Status</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="text-center bg-white rounded-lg p-3 shadow-sm">
                <div className="text-xl sm:text-2xl font-bold text-amber-600">
                  {hasRequiredFields ? '✅' : '⭕'}
                </div>
                <div className="text-xs sm:text-sm text-amber-700 font-medium">Service Info</div>
              </div>
              <div className="text-center bg-white rounded-lg p-3 shadow-sm">
                <div className="text-xl sm:text-2xl font-bold text-amber-600">
                  {(service.virtualLink || (service.additionalLinks || []).length > 0) ? '✅' : '⭕'}
                </div>
                <div className="text-xs sm:text-sm text-amber-700 font-medium">Virtual Links</div>
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
        </div>

        {/* Preview and QR Section */}
        <div className="space-y-6">
          {/* Service Preview */}
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Service Preview</h3>
            
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-1">Event Details</h4>
                <div className="space-y-2 text-sm">
                  {service.venue ? (
                    <p className="text-gray-800"><strong>Venue:</strong> {service.venue}</p>
                  ) : (
                    <p className="text-gray-500 italic">Venue not set</p>
                  )}
                  
                  {service.address ? (
                    <p className="text-gray-800"><strong>Address:</strong> {service.address}</p>
                  ) : (
                    <p className="text-gray-500 italic">Address not set</p>
                  )}
                  
                  {service.date && service.time ? (
                    <p className="text-gray-800"><strong>When:</strong> {service.date} at {service.time}</p>
                  ) : (
                    <p className="text-gray-500 italic">Date and time not set</p>
                  )}
                </div>
              </div>

              {/* Virtual Access */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Virtual Access</h4>
                <div className="space-y-3">
                  {service.virtualLink ? (
                    <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <p className="text-sm font-medium text-blue-800 mb-1">
                        {service.virtualPlatform ? service.virtualPlatform.charAt(0).toUpperCase() + service.virtualPlatform.slice(1) : 'Virtual'} Link
                      </p>
                      <p className="text-xs text-blue-600 truncate">{service.virtualLink}</p>
                    </div>
                  ) : (
                    <p className="text-gray-500 italic text-sm">No primary virtual link set</p>
                  )}

                  {(service.additionalLinks || []).length > 0 && (
                    <div className="space-y-2">
                      <p className="text-xs font-medium text-gray-700">Other Platforms:</p>
                      <div className="space-y-2">
                        {service.additionalLinks?.map((link, index) => (
                          <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded border">
                            <span className="text-sm">{getPlatformIcon(link.platform)}</span>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-medium text-gray-800 truncate">{link.platform}</p>
                              <p className="text-xs text-gray-600 truncate">{link.url}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* QR Code Section */}
              <div className="pt-4 border-t border-gray-200">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Shareable QR Code</h4>
                <button
                  onClick={handleGenerateQRCode}
                  disabled={!hasRequiredFields}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-linear-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <QrCode className="w-5 h-5" />
                  {hasRequiredFields ? 'Generate & View QR Code' : 'Complete Service Details to Generate QR'}
                </button>
                <p className="text-xs text-gray-500 mt-2">
                  Generate a QR code that guests can scan to get all service details and virtual links.
                </p>
              </div>
            </div>
          </div>

          {/* Tips Section */}
          <div className="bg-linear-to-br from-blue-50 to-cyan-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border-2 border-blue-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Tips for Virtual Platforms</h3>
            <div className="space-y-3 text-sm text-gray-700">
              <div className="flex items-start gap-2">
                <span className="text-blue-500">▶️</span>
                <p><strong>YouTube:</strong> Create a scheduled live stream for better reach</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-pink-500">📷</span>
                <p><strong>Instagram:</strong> Use Instagram Live for mobile-friendly streaming</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-black">🎵</span>
                <p><strong>TikTok:</strong> Great for shorter memorial moments and clips</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-purple-500">🎮</span>
                <p><strong>Twitch:</strong> Good for longer memorial services with chat interaction</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-red-500">📘</span>
                <p><strong>Facebook:</strong> Helps reach family and friends easily</p>
              </div>
            </div>
          </div>
        </div>
      </div>

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
                  <p><strong>Virtual:</strong> {service.virtualPlatform || 'Link'} available</p>
                )}
                {(service.additionalLinks || []).length > 0 && (
                  <p><strong>Additional Platforms:</strong> {(service.additionalLinks || []).length}</p>
                )}
              </div>
            </div>
            
            <p className="text-sm text-gray-500 mb-4">
              Scan this code to view memorial service details and all virtual links
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