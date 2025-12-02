// Components/Dashboard/DownloadSection.tsx - ENHANCED WITH PUBLISH AWARENESS
import React, { useState, useEffect } from 'react';
import { FileText, QrCode, Share2, Download, ExternalLink, AlertCircle, CheckCircle, X, Eye, Info, SquareArrowOutUpRight, Lock, Globe } from 'lucide-react';
import { useMemorial } from '../../hooks/useMemorial';
import { QRCodeCanvas } from 'qrcode.react';

interface DownloadOption {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>; 
  title: string;
  description: string;
  action: () => void;
  color: string;
  buttonText: string;
  disabled?: boolean;
  status?: 'default' | 'success' | 'error';
  popupWarning?: boolean;
  requiresPublish?: boolean;
}

export const DownloadSection: React.FC = () => {
  const { memorialData, loading, refreshMemorial } = useMemorial();
  const [generatingPDF, setGeneratingPDF] = useState(false);
  const [generatingPreview, setGeneratingPreview] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  const [copied, setCopied] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);
  const [pdfSuccess, setPdfSuccess] = useState(false);
  const [previewError, setPreviewError] = useState<string | null>(null);
  const [showPopupWarning, setShowPopupWarning] = useState(false);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [publishing, setPublishing] = useState(false);

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

  // ✅ FIXED: Use correct public route
  const memorialUrl = `${window.location.origin}/memorial/${memorialData.customUrl || memorialData.id}`;

  const memorialStats = {
    photos: memorialData.gallery?.length || 0,
    family: memorialData.familyTree?.length || 0,
    favorites: memorialData.favorites?.length || 0,
    timeline: memorialData.timeline?.length || 0,
    memoryWall: memorialData.memoryWall?.length || 0
  };

  // Enhanced publish function with better feedback
const handlePublish = async () => {
  if (!memorialData) return;
  
  setPublishing(true);
  try {
    const response = await fetch(`https://wings-of-memories-backend.onrender.com/api/memorials/${memorialData.id}/publish`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      setShowPublishModal(false);
      
      // Show success message
      setPdfSuccess(true);
      setTimeout(() => setPdfSuccess(false), 5000);
      
      // Refresh memorial data to reflect published status
      await refreshMemorial();
      
      console.log('✅ Memorial published successfully');
    } else {
      throw new Error(`Publication failed: ${response.status}`);
    }
  } catch (error) {
    console.error('Error publishing memorial:', error);
    setPdfError('Failed to publish memorial. Please try again.');
    setTimeout(() => setPdfError(null), 5000);
  } finally {
    setPublishing(false);
  }
};

  // Enhanced preview function with publish check
 const handlePreviewPDF = async () => {
  if (!memorialData) return;

  // Check if memorial is published (optional - you might want to allow preview even if not published)
  if (!memorialData.isPublished) {
    setShowPublishModal(true);
    return;
  }

  setGeneratingPreview(true);
  setPreviewError(null);

  try {
    // Show popup warning first
    setShowPopupWarning(true);

    // Wait a moment for user to see warning
    await new Promise(resolve => setTimeout(resolve, 500));

    // ✅ CORRECT: Open the PDF preview page (not the public memorial page)
    const previewUrl = `${window.location.origin}/memorial/pdf/${memorialData.id}`;
    const newWindow = window.open(previewUrl, '_blank', 'width=1200,height=800,scrollbars=yes,toolbar=yes,menubar=yes');
    
    if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
      throw new Error('Popup blocked. Please allow popups for this site.');
    }

    console.log('✅ PDF Preview opened successfully');

  } catch (error: unknown) {
    console.error('❌ Preview failed:', error);
    
    let errorMessage = 'Failed to open preview. Please try again.';
    if (error instanceof Error) {
      if (error.message.includes('Popup blocked')) {
        errorMessage = 'Popup was blocked. Please allow popups for this site, then try again.';
      } else {
        errorMessage = error.message || errorMessage;
      }
    }
    
    setPreviewError(errorMessage);
    setTimeout(() => setPreviewError(null), 8000);
  } finally {
    setGeneratingPreview(false);
    setShowPopupWarning(false);
  }
};

  // Enhanced QR code function with publish check
  const handleGenerateQRCode = () => {
    if (!memorialData.isPublished) {
      setShowPublishModal(true);
      return;
    }
    setShowQRCode(true);
  };

  // Enhanced share link function with publish check
  const handleCopyLink = async () => {
    if (!memorialData.isPublished) {
      setShowPublishModal(true);
      return;
    }

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

  // ✅ FIXED: Download uses authenticated endpoint
  const handleGeneratePDF = async () => {
    if (!memorialData) {
      setPdfError('No memorial data available');
      return;
    }

    setGeneratingPDF(true);
    setPdfError(null);
    setPdfSuccess(false);

    try {
      // Validate and prepare complete memorial data
      const completeMemorialData = {
        id: memorialData.id,
        name: memorialData.name || 'Memorial',
        profileImage: memorialData.profileImage || '',
        birthDate: memorialData.birthDate || '',
        deathDate: memorialData.deathDate || '',
        location: memorialData.location || '',
        obituary: memorialData.obituary || '',
        timeline: Array.isArray(memorialData.timeline) ? memorialData.timeline : [],
        favorites: Array.isArray(memorialData.favorites) ? memorialData.favorites : [],
        familyTree: Array.isArray(memorialData.familyTree) ? memorialData.familyTree : [],
        gallery: Array.isArray(memorialData.gallery) ? memorialData.gallery : [],
        memoryWall: Array.isArray(memorialData.memoryWall) ? memorialData.memoryWall : [],
        service: memorialData.service || {
          venue: '',
          address: '',
          date: '',
          time: '',
          virtualLink: '',
          virtualPlatform: 'zoom'
        },
        memories: Array.isArray(memorialData.memories) ? memorialData.memories : [],
        isPublished: Boolean(memorialData.isPublished),
        customUrl: memorialData.customUrl || '',
        theme: memorialData.theme || 'default'
      };

      console.log('📤 Sending validated memorial data for PDF:', {
        name: completeMemorialData.name,
        timeline: completeMemorialData.timeline.length,
        favorites: completeMemorialData.favorites.length,
        family: completeMemorialData.familyTree.length,
        gallery: completeMemorialData.gallery.length,
        memoryWall: completeMemorialData.memoryWall.length
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
          data: completeMemorialData,
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

  const downloadOptions: DownloadOption[] = [
    {
      icon: Eye,
      title: 'Preview PDF',
  description: memorialData.isPublished 
    ? 'Open PDF preview of your memorial - shows exact PDF layout' 
    : 'Preview PDF of your memorial (requires publishing first)',
  action: handlePreviewPDF,
  color: memorialData.isPublished ? 'from-amber-500 to-orange-500' : 'from-gray-400 to-gray-500',
  buttonText: generatingPreview ? 'Opening Preview...' : memorialData.isPublished ? 'Preview PDF' : 'Preview (Requires Publish)',
  disabled: generatingPreview || !memorialData.isPublished,
  popupWarning: true,
  requiresPublish: true
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
      description: memorialData.isPublished 
        ? 'Generate QR code that links to memorial page - scan to view and share' 
        : 'Create QR code to share your memorial (requires publishing first)',
      action: handleGenerateQRCode,
      color: memorialData.isPublished ? 'from-green-500 to-green-600' : 'from-gray-400 to-gray-500',
      buttonText: memorialData.isPublished ? 'Create QR Code' : 'QR Code (Requires Publish)',
      requiresPublish: true
    },
    {
      icon: Share2,
      title: 'Shareable Link',
      description: memorialData.isPublished 
        ? 'Copy link to memorial page - share with family and friends to view' 
        : 'Get shareable link for your memorial (requires publishing first)',
      action: handleCopyLink,
      color: memorialData.isPublished ? 'from-purple-500 to-purple-600' : 'from-gray-400 to-gray-500',
      buttonText: copied ? 'Copied!' : memorialData.isPublished ? 'Copy Link' : 'Share Link (Requires Publish)',
      requiresPublish: true
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
      <div className="text-center">
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-gray-800 mb-3">Download & Share</h2>
        <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
          {memorialData.isPublished 
            ? 'Your memorial is live! Preview, download keepsakes, or share with loved ones.'
            : 'Your memorial is ready! Publish it to share with family and friends.'
          }
        </p>
      </div>

      {/* Publication Status Banner */}
      {!memorialData.isPublished && (
        <div className="bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="bg-white bg-opacity-20 rounded-full p-2 sm:p-3">
              <Lock className="w-6 h-6 sm:w-8 sm:h-8" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg sm:text-xl mb-1">Memorial Not Published</h3>
              <p className="text-amber-100 text-sm sm:text-base">
                Your memorial is currently private. Publish it to generate QR codes, share links, and allow public access.
              </p>
            </div>
            <button
              onClick={() => setShowPublishModal(true)}
              className="bg-white text-amber-600 px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold hover:bg-amber-50 transition-colors whitespace-nowrap"
            >
              Publish Now
            </button>
          </div>
        </div>
      )}

      {memorialData.isPublished && (
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="bg-white bg-opacity-20 rounded-full p-2 sm:p-3">
              <Globe className="w-6 h-6 sm:w-8 sm:h-8" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg sm:text-xl mb-1">Memorial is Live! 🎉</h3>
              <p className="text-green-100 text-sm sm:text-base">
                Your memorial is now publicly accessible. Share the link or QR code with family and friends.
              </p>
            </div>
          </div>
        </div>
      )}

      {pdfError && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
          <div>
            <p className="text-red-800 font-medium">Error</p>
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
            <p className="text-green-800 font-medium">
              {memorialData.isPublished ? 'PDF Downloaded Successfully!' : 'Memorial Published Successfully!'}
            </p>
            <p className="text-green-600 text-sm">
              {memorialData.isPublished 
                ? 'Your memorial booklet has been downloaded.'
                : 'Your memorial is now live and accessible to the public.'
              }
            </p>
          </div>
        </div>
      )}

      {/* Publish Required Modal */}
      {showPublishModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl sm:rounded-2xl max-w-md w-full p-6 text-center">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-amber-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Publish Required</h3>
            <p className="text-gray-600 mb-4">
              To {memorialData.isPublished ? 'access this feature' : 'share your memorial'}, you need to publish it first. 
              This will make your memorial publicly accessible.
            </p>
            <div className="bg-amber-50 rounded-lg p-3 mb-4 text-left">
              <p className="text-sm text-amber-700 flex items-start gap-2">
                <Info className="w-4 h-4 mt-0.5 shrink-0" />
                <span>Once published, your memorial will be accessible to anyone with the link.</span>
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handlePublish}
                disabled={publishing}
                className="flex-1 px-4 py-3 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {publishing ? 'Publishing...' : 'Publish Memorial'}
              </button>
              <button
                onClick={() => setShowPublishModal(false)}
                className="flex-1 px-4 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pop-up Warning Modal */}
      {showPopupWarning && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl sm:rounded-2xl max-w-md w-full p-6 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <SquareArrowOutUpRight className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Opening Preview</h3>
            <p className="text-gray-600 mb-4">
              Your memorial preview will open in a new window. 
              <strong className="block mt-2 text-amber-600">
                Please allow pop-ups for this site if prompted.
              </strong>
            </p>
            <div className="bg-blue-50 rounded-lg p-3 mb-4 text-left">
              <p className="text-sm text-blue-700 flex items-start gap-2">
                <Info className="w-4 h-4 mt-0.5 shrink-0" />
                <span>If the preview doesn't open, check your browser's address bar for pop-up blocking icons.</span>
              </p>
            </div>
            <button
              onClick={() => setShowPopupWarning(false)}
              className="w-full px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-semibold"
            >
              Got it, continue
            </button>
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
        <h3 className="text-lg sm:text-xl font-serif font-bold text-gray-800 mb-4 sm:mb-6">
          {memorialData.isPublished ? 'Share Your Memorial' : 'Get Ready to Share'}
        </h3>
        <p className="text-gray-600 text-sm sm:text-base mb-6 text-center">
          {memorialData.isPublished 
            ? 'Preview the live memorial, download PDF, generate QR code, or share the link'
            : 'Complete these actions to share your memorial with family and friends'
          }
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {downloadOptions.map((option, index) => {
            const Icon = option.icon;
            const isError = option.status === 'error';
            const isSuccess = option.status === 'success';
            const isDisabled = option.disabled || (option.requiresPublish && !memorialData.isPublished);
            
            return (
              <div key={index} className="relative">
                <button
                  onClick={option.action}
                  disabled={isDisabled}
                  className={`bg-white rounded-xl sm:rounded-2xl shadow-lg border ${
                    isError ? 'border-red-200' : 
                    isSuccess ? 'border-green-200' : 
                    isDisabled ? 'border-gray-200' : 'border-amber-200'
                  } p-4 sm:p-6 text-left hover:shadow-xl transition-all duration-300 group ${
                    !isDisabled ? 'hover:scale-105' : ''
                  } disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 w-full h-full flex flex-col`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r ${
                      isError ? 'from-red-500 to-red-600' : 
                      isSuccess ? 'from-green-500 to-green-600' : 
                      isDisabled ? 'from-gray-400 to-gray-500' : option.color
                    } rounded-lg sm:rounded-xl flex items-center justify-center ${
                      !isDisabled ? 'group-hover:scale-110' : ''
                    } transition-transform duration-300`}>
                      <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    {option.popupWarning && !isDisabled && (
                      <SquareArrowOutUpRight className="w-4 h-4 text-amber-500 mt-1" />
                    )}
                    {option.requiresPublish && !memorialData.isPublished && (
                      <Lock className="w-4 h-4 text-gray-400 mt-1" />
                    )}
                  </div>
                  <h3 className="font-semibold text-gray-800 text-sm sm:text-base mb-2">{option.title}</h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-3 sm:mb-4 flex-grow">{option.description}</p>
                  {option.popupWarning && !isDisabled && (
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-2 mb-3">
                      <p className="text-xs text-amber-700 flex items-center gap-1">
                        <Info className="w-3 h-3" />
                        Opens in new window
                      </p>
                    </div>
                  )}
                  {option.requiresPublish && !memorialData.isPublished && (
                    <div className="bg-gray-100 border border-gray-200 rounded-lg p-2 mb-3">
                      <p className="text-xs text-gray-600 flex items-center gap-1">
                        <Lock className="w-3 h-3" />
                        Requires publishing
                      </p>
                    </div>
                  )}
                  <div className={`px-3 py-2 sm:px-4 sm:py-2 bg-gradient-to-r ${
                    isError ? 'from-red-500 to-red-600' : 
                    isSuccess ? 'from-green-500 to-green-600' : 
                    isDisabled ? 'from-gray-400 to-gray-500' : option.color
                  } text-white rounded-lg text-xs sm:text-sm font-medium text-center transition-all duration-300 ${
                    !isDisabled ? 'group-hover:shadow-lg' : ''
                  }`}>
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

      {/* Publish Section */}
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-amber-200 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="text-center sm:text-left">
            <h3 className="text-lg sm:text-xl font-serif font-bold text-gray-800 mb-2">
              {memorialData.isPublished ? 'Memorial is Live 🎉' : 'Make Memorial Public'}
            </h3>
            <p className="text-gray-600 text-sm sm:text-base">
              {memorialData.isPublished 
                ? 'Your memorial is live and accessible to visitors via the share link and QR code.'
                : 'Publish your memorial to generate shareable links and QR codes for family and friends.'
              }
            </p>
          </div>
          <div className="flex justify-center sm:justify-end">
            <button
              onClick={memorialData.isPublished ? () => {} : () => setShowPublishModal(true)}
              className={`flex items-center justify-center gap-2 px-6 py-3 ${
                memorialData.isPublished 
                  ? 'bg-green-500 hover:bg-green-600' 
                  : 'bg-amber-500 hover:bg-amber-600'
              } text-white rounded-xl transition-all duration-300 font-semibold text-sm sm:text-base`}
            >
              <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5" />
              {memorialData.isPublished ? 'Memorial Published' : 'Publish Memorial'}
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
                value={memorialUrl}
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