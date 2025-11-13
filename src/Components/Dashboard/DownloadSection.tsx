import React, { useState, useEffect } from 'react';
import { FileText, QrCode, Share2, Download, ExternalLink, AlertCircle, CheckCircle, X, Eye } from 'lucide-react';
import { useMemorial } from '../../hooks/useMemorial';
import { QRCodeCanvas } from 'qrcode.react';
import type { MemorialData } from '../../types/memorial';

interface DownloadOption {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>; 
  title: string;
  description: string;
  action: () => void;
  color: string;
  buttonText: string;
  disabled?: boolean;
  status?: 'default' | 'success' | 'error';
}

export const DownloadSection: React.FC = () => {
  const { memorialData, loading } = useMemorial();
  const [generatingPDF, setGeneratingPDF] = useState(false);
  const [generatingPreview, setGeneratingPreview] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  const [copied, setCopied] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);
  const [pdfSuccess, setPdfSuccess] = useState(false);
  const [previewError, setPreviewError] = useState<string | null>(null);

  useEffect(() => {
    setPdfError(null);
    setPdfSuccess(false);
    setPreviewError(null);
  }, [memorialData?.id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  if (!memorialData) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
        <p className="text-gray-600 text-lg mb-2">Unable to load memorial data</p>
        <p className="text-gray-500">Please try refreshing the page or check your connection</p>
      </div>
    );
  }

  // FIXED: Point to the proper preview page that will fetch data
  const memorialUrl = `${window.location.origin}/memorial/${memorialData.customUrl || memorialData.id}`;

  const memorialStats = {
    photos: memorialData.gallery?.length || 0,
    family: memorialData.familyTree?.length || 0,
    favorites: memorialData.favorites?.length || 0,
    timeline: memorialData.timeline?.length || 0,
    memoryWall: memorialData.memoryWall?.length || 0
  };

  // FIXED: Preview now sends complete memorial data to backend
  const handlePreviewPDF = async () => {
    if (!memorialData) return;

    setGeneratingPreview(true);
    setPreviewError(null);

    try {
      console.log('🚀 Generating preview with complete data:', {
        name: memorialData.name,
        timeline: memorialData.timeline?.length || 0,
        favorites: memorialData.favorites?.length || 0,
        family: memorialData.familyTree?.length || 0,
        gallery: memorialData.gallery?.length || 0,
        memoryWall: memorialData.memoryWall?.length || 0
      });

      // Send memorial data to backend for preview generation
      const response = await fetch('https://wings-of-memories-backend.onrender.com/api/memorials/generate-preview-pdf', {
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

      if (!response.ok) {
        throw new Error('Failed to generate preview');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      // Open PDF in new window
      const newWindow = window.open(url, '_blank');
      
      if (!newWindow) {
        throw new Error('Popup blocked. Please allow popups for this site.');
      }

      console.log('✅ PDF preview opened successfully');

    } catch (error: unknown) {
      console.error('❌ Preview failed:', error);
      
      let errorMessage = 'Failed to generate preview. Please try again.';
      if (error instanceof Error) {
        if (error.message.includes('Popup blocked')) {
          errorMessage = 'Popup blocked. Please allow popups for this site to view the preview.';
        } else {
          errorMessage = error.message || errorMessage;
        }
      }
      
      setPreviewError(errorMessage);
      setTimeout(() => setPreviewError(null), 8000);
    } finally {
      setGeneratingPreview(false);
    }
  };

  const handleGeneratePDF = async () => {
    if (!memorialData) {
      setPdfError('No memorial data available');
      return;
    }

    setGeneratingPDF(true);
    setPdfError(null);
    setPdfSuccess(false);

    try {
      const validationErrors = validateMemorialData(memorialData);
      if (validationErrors.length > 0) {
        console.warn('Memorial data validation warnings:', validationErrors);
      }

      console.log('📤 Sending complete memorial data for PDF:', {
        name: memorialData.name,
        timeline: memorialData.timeline?.length || 0,
        favorites: memorialData.favorites?.length || 0,
        family: memorialData.familyTree?.length || 0,
        gallery: memorialData.gallery?.length || 0,
        memoryWall: memorialData.memoryWall?.length || 0
      });

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000);

      const response = await fetch('https://wings-of-memories-backend.onrender.com/api/memorials/generate-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          memorialId: memorialData.id,
          data: memorialData,
          timestamp: new Date().toISOString(),
          version: '1.0'
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`PDF generation failed: ${response.status} - ${errorData}`);
      }

      const blob = await response.blob();
      
      if (blob.size === 0) {
        throw new Error('Generated PDF is empty');
      }

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${memorialData.name.replace(/\s+/g, '-').toLowerCase()}-memorial.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      setPdfSuccess(true);
      setTimeout(() => setPdfSuccess(false), 5000);
      
    } catch (error: unknown) {
      console.error('PDF generation failed:', error);
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          setPdfError('PDF generation timed out. Please try again.');
        } else if (error.message.includes('Failed to fetch')) {
          setPdfError('Network error. Please check your connection and try again.');
        } else if (error.message.includes('401') || error.message.includes('403')) {
          setPdfError('Authentication failed. Please log in again.');
        } else {
          setPdfError(error.message || 'Failed to generate PDF. Please try again.');
        }
      } else {
        setPdfError('Failed to generate PDF. Please try again.');
      }
      
      setTimeout(() => setPdfError(null), 8000);
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
      const textArea = document.createElement('textarea');
      textArea.value = memorialUrl;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {
        setPdfError('Failed to copy link. Please copy it manually.');
      }
      document.body.removeChild(textArea);
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
      setPdfError('Failed to publish memorial. Please try again.');
      setTimeout(() => setPdfError(null), 5000);
    }
  };

  const validateMemorialData = (data: MemorialData): string[] => {
    const warnings: string[] = [];
    
    if (!data.name) warnings.push('Memorial name is missing');
    if (!data.obituary || data.obituary.trim().length === 0) warnings.push('Obituary is empty');
    if (data.gallery && data.gallery.length === 0) warnings.push('No photos in gallery');
    if (data.timeline && data.timeline.length === 0) warnings.push('No timeline events');
    
    return warnings;
  };

  const getQRCodeData = () => {
    return memorialUrl;
  };

  const downloadOptions: DownloadOption[] = [
    {
      icon: Eye,
      title: 'Preview Memorial',
      description: 'See how your memorial booklet will look with all your data - opens PDF in browser',
      action: handlePreviewPDF,
      color: 'from-amber-500 to-orange-500',
      buttonText: generatingPreview ? 'Opening Preview...' : 'Preview PDF',
      disabled: generatingPreview
    },
    {
      icon: FileText,
      title: 'Memorial Booklet (PDF)',
      description: 'Beautiful printable booklet with all memorial content - perfect for printing or digital sharing',
      action: handleGeneratePDF,
      color: 'from-blue-500 to-blue-600',
      buttonText: generatingPDF ? 'Generating...' : 'Download PDF',
      disabled: generatingPDF,
      status: pdfSuccess ? 'success' : pdfError ? 'error' : 'default'
    },
    {
      icon: QrCode,
      title: 'QR Code',
      description: 'Generate QR code that links to memorial page - scan to view and share the memorial',
      action: handleGenerateQRCode,
      color: 'from-green-500 to-green-600',
      buttonText: 'Create QR Code'
    },
    {
      icon: Share2,
      title: 'Shareable Link',
      description: 'Copy link to memorial page - share with family and friends to view the memorial',
      action: handleCopyLink,
      color: 'from-purple-500 to-purple-600',
      buttonText: copied ? 'Copied!' : 'Copy Link'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
      <div className="text-center">
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-gray-800 mb-3">Download & Share</h2>
        <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
          Your memorial is ready! Preview the design, download keepsakes, or share with loved ones.
        </p>
      </div>

      {pdfError && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
          <div>
            <p className="text-red-800 font-medium">PDF Generation Failed</p>
            <p className="text-red-600 text-sm">{pdfError}</p>
          </div>
        </div>
      )}

      {previewError && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
          <div>
            <p className="text-red-800 font-medium">Preview Failed</p>
            <p className="text-red-600 text-sm">{previewError}</p>
          </div>
        </div>
      )}

      {pdfSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
          <div>
            <p className="text-green-800 font-medium">PDF Downloaded Successfully!</p>
            <p className="text-green-600 text-sm">Your memorial booklet has been downloaded.</p>
          </div>
        </div>
      )}

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

      <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-amber-200 p-4 sm:p-6">
        <h3 className="text-lg sm:text-xl font-serif font-bold text-gray-800 mb-4 sm:mb-6">Ready to Share Your Memorial?</h3>
        <p className="text-gray-600 text-sm sm:text-base mb-6 text-center">
          Preview the design, download as PDF, generate QR code, or share the link
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {downloadOptions.map((option, index) => {
            const Icon = option.icon;
            const isError = option.status === 'error';
            const isSuccess = option.status === 'success';
            
            return (
              <div key={index} className="relative">
                <button
                  onClick={option.action}
                  disabled={option.disabled}
                  className={`bg-white rounded-xl sm:rounded-2xl shadow-lg border ${
                    isError ? 'border-red-200' : isSuccess ? 'border-green-200' : 'border-amber-200'
                  } p-4 sm:p-6 text-left hover:shadow-xl transition-all duration-300 group hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 w-full h-full flex flex-col`}
                >
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r ${
                    isError ? 'from-red-500 to-red-600' : 
                    isSuccess ? 'from-green-500 to-green-600' : 
                    option.color
                  } rounded-lg sm:rounded-xl flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-800 text-sm sm:text-base mb-2">{option.title}</h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-3 sm:mb-4 flex-grow">{option.description}</p>
                  <div className={`px-3 py-2 sm:px-4 sm:py-2 bg-gradient-to-r ${
                    isError ? 'from-red-500 to-red-600' : 
                    isSuccess ? 'from-green-500 to-green-600' : 
                    option.color
                  } text-white rounded-lg text-xs sm:text-sm font-medium text-center transition-all duration-300 group-hover:shadow-lg`}>
                    {option.buttonText}
                  </div>
                </button>
                
                {isError && (
                  <div className="absolute -top-2 -right-2">
                    <div className="bg-red-500 text-white rounded-full p-1">
                      <AlertCircle className="w-4 h-4" />
                    </div>
                  </div>
                )}
                
                {isSuccess && (
                  <div className="absolute -top-2 -right-2">
                    <div className="bg-green-500 text-white rounded-full p-1">
                      <CheckCircle className="w-4 h-4" />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

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

      {showQRCode && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl sm:rounded-2xl max-w-sm w-full p-4 sm:p-6 text-center">
            <div className="flex justify-between items-center mb-3 sm:mb-4">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800">Memorial QR Code</h3>
              <button
                onClick={() => setShowQRCode(false)}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="bg-gray-50 p-4 sm:p-6 rounded-xl mb-3 sm:mb-4">
              <QRCodeCanvas 
                value={getQRCodeData()}
                size={200}
                level="H"
                includeMargin
                style={{ height: "auto", maxWidth: "100%", width: "100%" }}
              />
            </div>
            
            <div className="text-left mb-4 p-3 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2 text-sm">Scan to:</h4>
              <ul className="text-xs text-blue-600 space-y-1">
                <li>• View memorial page</li>
                <li>• Download memorial booklet</li>
                <li>• Share with others</li>
                <li>• Access full memorial details</li>
              </ul>
            </div>
            
            <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4 break-words">
              Scan to view {memorialData.name}'s memorial
            </p>
            
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <button 
                onClick={() => {
                  const canvas = document.querySelector('canvas');
                  if (canvas) {
                    const url = canvas.toDataURL('image/png', 1.0);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `${memorialData.name.replace(/\s+/g, '-').toLowerCase()}-memorial-qr.png`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                  }
                }}
                className="flex-1 px-3 py-2 sm:px-4 sm:py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                <Download className="w-3 h-3 sm:w-4 sm:h-4" />
                Download QR
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