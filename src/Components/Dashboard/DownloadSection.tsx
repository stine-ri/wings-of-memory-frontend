import React, { useState } from 'react';
import { FileText, QrCode, Share2, Printer, Eye, Download, ExternalLink } from 'lucide-react';
import { useMemorial } from '../../hooks/useMemorial';
import { QRCodeCanvas } from 'qrcode.react';
import { MemorialPreview } from '../Dashboard/MemorialPreview';

export const DownloadSection: React.FC = () => {
  const { memorialData, loading } = useMemorial();
  const [generatingPDF, setGeneratingPDF] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
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

  const memorialUrl = `${window.location.origin}/memorial/${memorialData.customUrl}`;

  // Calculate memorial statistics
// Calculate memorial statistics with safe defaults
  const memorialStats = {
    pages: Math.ceil(((memorialData.timeline?.length || 0) + (memorialData.favorites?.length || 0) + (memorialData.memories?.length || 0)) / 5) + 2,
    photos: memorialData.gallery?.length || 0,
    memories: memorialData.memories?.length || 0,
    family: memorialData.familyTree?.length || 0,
    favorites: memorialData.favorites?.length || 0,
    timeline: memorialData.timeline?.length || 0
  };

  const handleGeneratePDF = async () => {
    if (!memorialData) return;
    
    setGeneratingPDF(true);
    
    try {
      // Send memorial data to backend for PDF generation
      const response = await fetch('/api/memorials/generate-pdf', {
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

  const handlePrint = () => {
    setShowPreview(true);
  };

  const handlePublish = async () => {
    if (!memorialData) return;
    
    try {
      const response = await fetch(`/api/memorials/${memorialData.id}/publish`, {
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
      description: 'Beautiful printable booklet with all memorial content',
      action: handleGeneratePDF,
      color: 'from-blue-500 to-blue-600',
      buttonText: generatingPDF ? 'Generating...' : 'Download PDF'
    },
    {
      icon: QrCode,
      title: 'QR Code',
      description: 'Generate QR code for memorial programs and sharing',
      action: handleGenerateQRCode,
      color: 'from-green-500 to-green-600',
      buttonText: 'Create QR Code'
    },
    {
      icon: Share2,
      title: 'Shareable Link',
      description: 'Copy memorial link to share with family and friends',
      action: handleCopyLink,
      color: 'from-purple-500 to-purple-600',
      buttonText: copied ? 'Copied!' : 'Copy Link'
    },
    {
      icon: Printer,
      title: 'Print Memorial',
      description: 'Print the memorial with beautiful styling',
      action: handlePrint,
      color: 'from-amber-500 to-orange-500',
      buttonText: 'Print Preview'
    }
  ];

  return (
    <div className="max-w-6xl space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-serif font-bold text-gray-800 mb-3">Download & Share</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Your memorial is ready! Share it with family and friends or download keepsakes.
        </p>
      </div>

      {/* Memorial Completion Status */}
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border-2 border-amber-200">
        <h3 className="text-xl font-serif font-bold text-amber-800 mb-4">Memorial Completion</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-amber-600">{memorialData.obituary ? '✅' : '⭕'}</div>
            <div className="text-sm text-amber-700">Obituary</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-amber-600">{memorialStats.timeline > 0 ? '✅' : '⭕'}</div>
            <div className="text-sm text-amber-700">Timeline</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-amber-600">{memorialStats.favorites > 0 ? '✅' : '⭕'}</div>
            <div className="text-sm text-amber-700">Favorites</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-amber-600">{memorialStats.family > 0 ? '✅' : '⭕'}</div>
            <div className="text-sm text-amber-700">Family</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-amber-600">{memorialStats.photos > 0 ? '✅' : '⭕'}</div>
            <div className="text-sm text-amber-700">Photos</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-amber-600">{memorialStats.memories > 0 ? '✅' : '⭕'}</div>
            <div className="text-sm text-amber-700">Memories</div>
          </div>
        </div>
      </div>

      {/* Download Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {downloadOptions.map((option, index) => {
          const Icon = option.icon;
          return (
            <button
              key={index}
              onClick={option.action}
              disabled={generatingPDF}
              className="bg-white rounded-2xl shadow-lg border border-amber-200 p-6 text-left hover:shadow-xl transition-all group hover:scale-105 disabled:opacity-50"
            >
              <div className={`w-12 h-12 bg-gradient-to-r ${option.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">{option.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed mb-4">{option.description}</p>
              <div className={`px-4 py-2 bg-gradient-to-r ${option.color} text-white rounded-lg text-sm font-medium text-center`}>
                {option.buttonText}
              </div>
            </button>
          );
        })}
      </div>

      {/* Publish Section */}
      <div className="bg-white rounded-2xl shadow-lg border border-amber-200 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h3 className="text-xl font-serif font-bold text-gray-800 mb-2">Ready to Share Your Memorial?</h3>
            <p className="text-gray-600">
              {memorialData.isPublished 
                ? 'Your memorial is live and accessible to visitors.'
                : 'Publish your memorial to make it accessible to family and friends.'
              }
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowPreview(true)}
              className="flex items-center gap-2 px-6 py-3 bg-amber-500 text-white rounded-xl hover:bg-amber-600 transition-all font-semibold"
            >
              <Eye className="w-5 h-5" />
              Preview Memorial
            </button>
            <button
              onClick={handlePublish}
              className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-all font-semibold"
            >
              <ExternalLink className="w-5 h-5" />
              {memorialData.isPublished ? 'Update' : 'Publish'}
            </button>
          </div>
        </div>
      </div>

      {/* QR Code Modal */}
      {showQRCode && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 text-center">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Memorial QR Code</h3>
            <div className="bg-gray-50 p-6 rounded-xl mb-4">
              <QRCodeCanvas 
                value={memorialUrl}
                size={200}
                level="H"
                includeMargin
              />
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Scan to visit {memorialData.name}'s memorial
            </p>
            <div className="flex gap-3">
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
                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download
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

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-0">
          <div className="bg-white rounded-2xl w-full h-full max-h-screen overflow-hidden flex flex-col">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-xl font-semibold text-gray-800">Memorial Preview</h3>
              <div className="flex gap-3">
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600"
                >
                  <Printer className="w-4 h-4" />
                  Print
                </button>
                <button 
                  onClick={() => setShowPreview(false)}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                >
                  Close
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              <MemorialPreview />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};