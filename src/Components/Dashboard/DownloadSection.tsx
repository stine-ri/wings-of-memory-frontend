import React, { useState } from 'react';
import { FileText, QrCode, Share2, Download, ExternalLink } from 'lucide-react';
import { useMemorial } from '../../hooks/useMemorial';
import { QRCodeCanvas } from 'qrcode.react';

export const DownloadSection: React.FC = () => {
  const { memorialData, loading } = useMemorial();
  const [generatingPDF, setGeneratingPDF] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  const [copied, setCopied] = useState(false);

  // Show loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  // Show error state if no data
  if (!memorialData) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Unable to load memorial data.</p>
      </div>
    );
  }

  const memorialUrl = `${window.location.origin}/memorial/${memorialData.customUrl || memorialData.id}`;

  // Calculate memorial statistics
  const memorialStats = {
    photos: memorialData.gallery?.length || 0,
    family: memorialData.familyTree?.length || 0,
    favorites: memorialData.favorites?.length || 0,
    timeline: memorialData.timeline?.length || 0,
    memoryWall: memorialData.memoryWall?.length || 0
  };

  const handleGeneratePDF = async () => {
    if (!memorialData) return;
    
    setGeneratingPDF(true);
    
    try {
      // Send memorial data to backend for PDF generation
      const response = await fetch('https://wings-of-memories-backend.onrender.com/api/memorials/generate-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          memorialId: memorialData.id,
          data: memorialData
        })
      });

      if (!response.ok) throw new Error('PDF generation failed');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${memorialData.name.replace(/\s+/g, '-').toLowerCase()}-memorial.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error('PDF generation failed:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setGeneratingPDF(false);
    }
  };

  const handleGenerateQRCode = () => {
    setShowQRCode(true);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(memorialUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Clipboard copy failed:', err);
      alert('Failed to copy link');
    }
  };

  const handlePublish = async () => {
    if (!memorialData) return;
    
    try {
      const response = await fetch(`https://wings-of-memories-backend.onrender.com/api/memorials/${memorialData.id}/publish`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        alert('Memorial published successfully!');
      } else {
        throw new Error('Publication failed');
      }
    } catch (error) {
      console.error('Error publishing memorial:', error);
      alert('Failed to publish memorial');
    }
  };

  const downloadOptions = [
    {
      icon: FileText,
      title: 'Memorial Booklet (PDF)',
      description: 'Beautiful printable booklet with all memorial content - perfect for printing or digital sharing',
      action: handleGeneratePDF,
      color: 'from-blue-500 to-blue-600',
      buttonText: generatingPDF ? 'Generating...' : 'Download PDF',
      disabled: generatingPDF
    },
    {
      icon: QrCode,
      title: 'QR Code',
      description: 'Generate QR code for memorial programs, announcements, and easy sharing',
      action: handleGenerateQRCode,
      color: 'from-green-500 to-green-600',
      buttonText: 'Create QR Code'
    },
    {
      icon: Share2,
      title: 'Shareable Link',
      description: 'Copy memorial link to share with family and friends via message or email',
      action: handleCopyLink,
      color: 'from-purple-500 to-purple-600',
      buttonText: copied ? 'Copied!' : 'Copy Link'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-gray-800 mb-3">Download & Share</h2>
        <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
          Your memorial is ready! Share it with family and friends or download keepsakes.
        </p>
      </div>

      {/* Memorial Completion Status */}
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border-2 border-amber-200">
        <h3 className="text-lg sm:text-xl font-serif font-bold text-amber-800 mb-3 sm:mb-4">Memorial Completion</h3>
        <div className="grid grid-cols-4 sm:grid-cols-7 gap-2 sm:gap-4">
          <div className="text-center">
            <div className="text-xl sm:text-2xl font-bold text-amber-600">{memorialData.obituary ? '✅' : '⭕'}</div>
            <div className="text-xs sm:text-sm text-amber-700">Obituary</div>
          </div>
          <div className="text-center">
            <div className="text-xl sm:text-2xl font-bold text-amber-600">{memorialStats.timeline > 0 ? '✅' : '⭕'}</div>
            <div className="text-xs sm:text-sm text-amber-700">Timeline</div>
          </div>
          <div className="text-center">
            <div className="text-xl sm:text-2xl font-bold text-amber-600">{memorialStats.favorites > 0 ? '✅' : '⭕'}</div>
            <div className="text-xs sm:text-sm text-amber-700">Favorites</div>
          </div>
          <div className="text-center">
            <div className="text-xl sm:text-2xl font-bold text-amber-600">{memorialStats.family > 0 ? '✅' : '⭕'}</div>
            <div className="text-xs sm:text-sm text-amber-700">Family</div>
          </div>
          <div className="text-center">
            <div className="text-xl sm:text-2xl font-bold text-amber-600">{memorialStats.photos > 0 ? '✅' : '⭕'}</div>
            <div className="text-xs sm:text-sm text-amber-700">Photos</div>
          </div>
          <div className="text-center">
            <div className="text-xl sm:text-2xl font-bold text-amber-600">{memorialStats.memoryWall > 0 ? '✅' : '⭕'}</div>
            <div className="text-xs sm:text-sm text-amber-700">Memories</div>
          </div>
          <div className="text-center">
            <div className="text-xl sm:text-2xl font-bold text-amber-600">{memorialData.service?.venue ? '✅' : '⭕'}</div>
            <div className="text-xs sm:text-sm text-amber-700">Service</div>
          </div>
        </div>
      </div>

      {/* Download Options */}
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-amber-200 p-4 sm:p-6">
        <h3 className="text-lg sm:text-xl font-serif font-bold text-gray-800 mb-4 sm:mb-6">Ready to Share Your Memorial?</h3>
        <p className="text-gray-600 text-sm sm:text-base mb-6 text-center">
          Download as PDF, generate QR code, or share the link with family and friends
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {downloadOptions.map((option, index) => {
            const Icon = option.icon;
            return (
              <button
                key={index}
                onClick={option.action}
                disabled={option.disabled}
                className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-amber-200 p-4 sm:p-6 text-left hover:shadow-xl transition-all duration-300 group hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                <div className={`w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r ${option.color} rounded-lg sm:rounded-xl flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-800 text-sm sm:text-base mb-2">{option.title}</h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-3 sm:mb-4">{option.description}</p>
                <div className={`px-3 py-2 sm:px-4 sm:py-2 bg-gradient-to-r ${option.color} text-white rounded-lg text-xs sm:text-sm font-medium text-center transition-all duration-300 group-hover:shadow-lg`}>
                  {option.buttonText}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Publish Status Section */}
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-amber-200 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="text-center sm:text-left">
            <h3 className="text-lg sm:text-xl font-serif font-bold text-gray-800 mb-2">
              {memorialData.isPublished ? 'Memorial is Live' : 'Make Memorial Public'}
            </h3>
            <p className="text-gray-600 text-sm sm:text-base">
              {memorialData.isPublished 
                ? 'Your memorial is live and accessible to visitors.'
                : 'Publish your memorial to make it accessible to family and friends.'
              }
            </p>
          </div>
          <div className="flex justify-center sm:justify-end">
            <button
              onClick={handlePublish}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-all duration-300 font-semibold text-sm sm:text-base"
            >
              <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5" />
              {memorialData.isPublished ? 'Update Settings' : 'Publish Memorial'}
            </button>
          </div>
        </div>
      </div>

      {/* QR Code Modal */}
      {showQRCode && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl sm:rounded-2xl max-w-sm w-full p-4 sm:p-6 text-center">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">Memorial QR Code</h3>
            <div className="bg-gray-50 p-4 sm:p-6 rounded-xl mb-3 sm:mb-4">
              <QRCodeCanvas 
                value={memorialUrl}
                size={200}
                level="H"
                includeMargin
              />
            </div>
            <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
              Scan to visit {memorialData.name}'s memorial
            </p>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <button 
                onClick={() => {
                  const canvas = document.querySelector('canvas');
                  if (canvas) {
                    const url = canvas.toDataURL();
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `${memorialData.customUrl}-qrcode.png`;
                    a.click();
                  }
                }}
                className="flex-1 px-3 py-2 sm:px-4 sm:py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                <Download className="w-3 h-3 sm:w-4 sm:h-4" />
                Download
              </button>
              <button 
                onClick={() => setShowQRCode(false)}
                className="flex-1 px-3 py-2 sm:px-4 sm:py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm sm:text-base"
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