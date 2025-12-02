// Pages/PDFPreviewPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Download, FileText, AlertCircle, Loader, Check, ZoomIn, ZoomOut, RefreshCw } from 'lucide-react';

interface MemorialData {
  id: string;
  name: string;
  profileImage?: string;
  birthDate?: string;
  deathDate?: string;
  location?: string;
}

export const PDFPreviewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [pdfLoading, setPdfLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [memorialData, setMemorialData] = useState<MemorialData | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string>('');
  const [zoom, setZoom] = useState(100);
  const [retryCount, setRetryCount] = useState(0);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingMessage, setLoadingMessage] = useState('Initializing...');
const [pdfLoadTimeout, setPdfLoadTimeout] = useState<number | null>(null);
  const MAX_RETRIES = 3;

  // ✅ FIX 1: Faster progress updates for mobile
  useEffect(() => {
    if (pdfLoading && !loading) {
      const messages = [
        { progress: 0, message: 'Connecting to server...' },
        { progress: 20, message: 'Loading memorial data...' },
        { progress: 40, message: 'Rendering PDF layout...' },
        { progress: 60, message: 'Processing images...' },
        { progress: 80, message: 'Finalizing document...' },
        { progress: 95, message: 'Almost ready...' }
      ];

      let currentStep = 0;
      const interval = setInterval(() => {
        if (currentStep < messages.length) {
          setLoadingProgress(messages[currentStep].progress);
          setLoadingMessage(messages[currentStep].message);
          currentStep++;
        } else {
          clearInterval(interval);
        }
      }, 6000); // ✅ Reduced from 8s to 6s for mobile

      return () => clearInterval(interval);
    }
  }, [pdfLoading, loading]);

  useEffect(() => {
    const fetchMemorialData = async () => {
      if (!id) {
        setError('Memorial ID is missing');
        setLoading(false);
        return;
      }

      try {
        console.log('🔍 Fetching memorial data for:', id);
        
        // ✅ FIX 2: Add timeout for mobile requests
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000);

        const response = await fetch(
          `https://wings-of-memories-backend.onrender.com/api/memorials/public/${id}`,
          {
            headers: {
              'Content-Type': 'application/json'
            },
            signal: controller.signal
          }
        );

        clearTimeout(timeoutId);

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Memorial not found. Please check the link and try again.');
          }
          if (response.status === 403) {
            throw new Error('This memorial is not published yet.');
          }
          throw new Error(`Failed to load memorial (${response.status})`);
        }

        const data = await response.json();
        
        if (!data.memorial) {
          throw new Error('Memorial data is missing');
        }

        console.log('✅ Memorial data loaded:', data.memorial.name);
        setMemorialData(data.memorial);

        // ✅ FIX 3: Cache busting for mobile PDF
        const timestamp = new Date().getTime();
        const pdfPreviewUrl = `https://wings-of-memories-backend.onrender.com/api/memorials/${id}/preview-pdf?t=${timestamp}`;
        setPdfUrl(pdfPreviewUrl);
        
        console.log('📄 PDF URL set:', pdfPreviewUrl);

        setLoading(false);

        // ✅ FIX 4: Set PDF timeout only for mobile
// ✅ FIX 4: Set PDF timeout only for mobile
if (window.innerWidth < 768) {
  const pdfTimeout = window.setTimeout(() => {
    if (pdfLoading) {
      console.warn('📱 Mobile PDF load timeout');
      setPdfLoading(false);
      setError('PDF loading timed out on mobile. Try downloading instead.');
    }
  }, 30000); // 30s timeout for mobile only

  setPdfLoadTimeout(pdfTimeout);
}

     } catch (err: unknown) {
  console.error('❌ Error fetching memorial:', err);

  // First narrow the error to Error type
  if (err instanceof Error) {
    // AbortError handling
    if (err.name === 'AbortError') {
      setError('Request timed out. Please check your connection and try again.');
      setLoading(false);
      return;
    }

    // Retry logic for network errors
    if (
      retryCount < MAX_RETRIES &&
      (err.message.includes('Failed to load') || err.message.includes('Failed to fetch'))
    ) {
      console.log(`🔄 Retrying... (${retryCount + 1}/${MAX_RETRIES})`);
      setRetryCount(prev => prev + 1);

      setTimeout(() => {
        fetchMemorialData();
      }, 2000 * (retryCount + 1));

      return;
    }

    // Generic error message
    setError(err.message);
  } else {
    // If it's not an Error object
    setError('Failed to load memorial');
  }

  setLoading(false);
}

    };

    // Reset retry count when ID changes
    setRetryCount(0);
    fetchMemorialData();

    return () => {
      if (pdfLoadTimeout) {
        clearTimeout(pdfLoadTimeout);
      }
    };
  }, [id]);

  // Handle PDF load
  const handlePdfLoad = () => {
    // ✅ FIX 6: Clear mobile timeout on success
    if (pdfLoadTimeout) {
      clearTimeout(pdfLoadTimeout);
      setPdfLoadTimeout(null);
    }

    setTimeout(() => {
      setPdfLoading(false);
      setLoadingProgress(100);
      setLoadingMessage('PDF loaded successfully!');
      console.log('✅ PDF loaded successfully');
    }, 500);
  };

  // Handle PDF load error

const handlePdfError = () => {
  console.error('❌ PDF failed to load');
  
  // ✅ FIX 7: Clear timeout on error
  if (pdfLoadTimeout) {
    clearTimeout(pdfLoadTimeout);
    setPdfLoadTimeout(null);
  }

  setPdfLoading(false);
  setError('Failed to load PDF. Please try downloading instead.');
};

  
  // ✅ FIX 8: Mobile-only reload function
  const handleMobileReload = () => {
    if (!id) return;
    
    console.log('📱 Mobile reloading PDF...');
    setPdfLoading(true);
    setError(null);
    setLoadingProgress(0);
    setLoadingMessage('Reloading PDF...');

    // Reset PDF URL with cache busting
    const timestamp = new Date().getTime();
    const newPdfUrl = `https://wings-of-memories-backend.onrender.com/api/memorials/${id}/preview-pdf?t=${timestamp}`;
    setPdfUrl(newPdfUrl);
  };

  const handleDownload = () => {
    if (!id) return;
    
    console.log('⬇️ Downloading PDF for:', id);
    
    // ✅ FIX 9: Cache busting for mobile download
    const timestamp = new Date().getTime();
    const downloadUrl = `https://wings-of-memories-backend.onrender.com/api/memorials/${id}/preview-pdf?download=true&t=${timestamp}`;
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = `${memorialData?.name.replace(/\s+/g, '-').toLowerCase() || 'memorial'}-booklet.pdf`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 25, 200));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 25, 50));
  };

  const handleZoomReset = () => {
    setZoom(100);
  };

  // Format date helper
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  // ✅ FIX 10: Mobile detection
  const isMobile = window.innerWidth < 768;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 text-center max-w-md">
          <Loader className="w-16 h-16 text-amber-500 mx-auto mb-4 animate-spin" />
          <h2 className="text-2xl font-serif font-bold text-gray-800 mb-2">
            Loading Memorial
          </h2>
          <p className="text-gray-600">
            Please wait while we prepare the memorial booklet...
          </p>
          {retryCount > 0 && (
            <p className="text-sm text-amber-600 mt-2">
              Retry attempt {retryCount} of {MAX_RETRIES}
            </p>
          )}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-serif font-bold text-gray-800 mb-2">
            Unable to Load Memorial
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          
          {/* ✅ FIX 11: Mobile-specific error advice */}
          {isMobile && error.includes('timed out') && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
              <p className="text-sm text-amber-800">
                <strong>Mobile Tip:</strong> Try downloading the PDF instead for better reliability.
              </p>
            </div>
          )}
          
          <div className="space-y-3">
            <button
              onClick={() => window.location.reload()}
              className="w-full px-6 py-3 bg-amber-500 text-white rounded-xl font-semibold hover:bg-amber-600 transition-colors"
            >
              Try Again
            </button>
            <a
              href="/"
              className="block w-full px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
            >
              Go to Home
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100">
      {/* Header - UNCHANGED */}
      <div className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-center md:text-left w-full md:w-auto">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-serif font-bold text-gray-800 mb-2">
                {memorialData?.name}
              </h1>
              {(memorialData?.birthDate || memorialData?.deathDate) && (
                <p className="text-base sm:text-lg text-gray-600 font-serif italic">
                  {formatDate(memorialData.birthDate)} 
                  {memorialData.birthDate && memorialData.deathDate && ' — '} 
                  {formatDate(memorialData.deathDate)}
                </p>
              )}
              {memorialData?.location && (
                <p className="text-sm sm:text-base text-gray-600 mt-1">{memorialData.location}</p>
              )}
            </div>
            
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 text-sm sm:text-base w-full md:w-auto justify-center"
            >
              <Download className="w-4 h-4 sm:w-5 sm:h-5" />
              Download PDF
            </button>
          </div>
        </div>
      </div>

      {/* PDF Preview */}
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-4 sm:py-8">
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden">
          {/* Info Banner - UNCHANGED */}
          <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 sm:px-6 py-3 sm:py-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <FileText className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" />
              <div>
                <h2 className="font-semibold text-base sm:text-lg">Memorial Booklet Preview</h2>
                <p className="text-xs sm:text-sm text-amber-100 hidden sm:block">
                  View the complete memorial booklet below or download it to save and share
                </p>
                {/* ✅ FIX 12: Mobile-specific banner text */}
                <p className="text-xs sm:text-sm text-amber-100 sm:hidden">
                  {pdfLoading ? 'Loading...' : 'Tap download if preview fails'}
                </p>
              </div>
            </div>
          </div>

          {/* Zoom Controls - Desktop only (UNCHANGED) */}
          <div className="hidden sm:flex items-center justify-end gap-2 px-4 py-2 bg-gray-50 border-b border-gray-200">
            <button
              onClick={handleZoomOut}
              disabled={zoom <= 50}
              className="p-2 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4 text-gray-700" />
            </button>
            <button
              onClick={handleZoomReset}
              className="px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
            >
              {zoom}%
            </button>
            <button
              onClick={handleZoomIn}
              disabled={zoom >= 200}
              className="p-2 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4 text-gray-700" />
            </button>
          </div>

          {/* PDF Container */}
          <div className="relative bg-gray-100" style={{ height: 'calc(100vh - 280px)', minHeight: '400px' }}>
            {/* Enhanced Loading Overlay with Progress - UNCHANGED */}
            {pdfLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
                <div className="text-center p-8 max-w-md w-full">
                  <div className="relative mb-6">
                    <Loader className="w-16 h-16 text-amber-500 mx-auto animate-spin" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <FileText className="w-8 h-8 text-amber-600 animate-pulse" />
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    Loading Memorial PDF
                  </h3>
                  
                  <p className="text-sm text-gray-600 mb-1">
                    {loadingMessage}
                  </p>
                  
                  <p className="text-xs text-gray-500 mb-6">
                    This may take 30-60 seconds for the first load
                  </p>
                  
                  {/* Progress Bar */}
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden mb-2">
                    <div 
                      className="bg-gradient-to-r from-amber-500 to-orange-500 h-full rounded-full transition-all duration-500 ease-out"
                      style={{ width: `${loadingProgress}%` }}
                    >
                      <div className="h-full w-full bg-white opacity-20 animate-shimmer"></div>
                    </div>
                  </div>
                  
                  <p className="text-xs text-amber-600 font-medium">
                    {loadingProgress}% Complete
                  </p>
                  
                  {/* ✅ FIX 13: Mobile download suggestion during loading */}
                  {isMobile && loadingProgress > 50 && (
                    <button
                      onClick={handleDownload}
                      className="mt-4 text-sm text-blue-600 hover:text-blue-700 underline"
                    >
                      Taking too long? Download directly
                    </button>
                  )}
                  
                  {/* Tips while loading */}
                  <div className="mt-6 bg-amber-50 rounded-lg p-4 text-left">
                    <p className="text-xs text-amber-800 font-medium mb-2">💡 Did you know?</p>
                    <p className="text-xs text-amber-700">
                      The PDF includes all photos, memories, timeline events, and family information in a beautiful printable format.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Success Indicator - UNCHANGED */}
            {!pdfLoading && !error && (
              <div className="absolute top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 z-10 animate-fade-in">
                <Check className="w-4 h-4" />
                <span className="text-sm font-medium">PDF Loaded</span>
              </div>
            )}

            {/* PDF Iframe with responsive zoom - UNCHANGED */}
            <div 
              className="w-full h-full overflow-auto"
              style={{ 
                transform: window.innerWidth >= 640 ? `scale(${zoom / 100})` : 'scale(1)',
                transformOrigin: 'top center',
                transition: 'transform 0.3s ease'
              }}
            >
              <iframe
                src={pdfUrl}
                className="w-full h-full border-0"
                title={`${memorialData?.name} Memorial Booklet`}
                loading="lazy"
                onLoad={handlePdfLoad}
                onError={handlePdfError}
                style={{ minHeight: window.innerWidth >= 640 ? `${100 / (zoom / 100)}%` : '100%' }}
              />
            </div>
            
            {/* Fallback for browsers that don't support PDF viewing - UNCHANGED */}
            <noscript>
              <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
                <div className="text-center p-8">
                  <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    PDF Preview Not Available
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Your browser doesn't support inline PDF viewing.
                  </p>
                  <button
                    onClick={handleDownload}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 transition-colors"
                  >
                    <Download className="w-5 h-5" />
                    Download PDF Instead
                  </button>
                </div>
              </div>
            </noscript>
          </div>

          {/* ✅ FIX 14: Mobile-only reload button */}
          <div className="sm:hidden bg-gray-50 px-4 py-3 border-t border-gray-200 space-y-2">
            <button
              onClick={handleDownload}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg"
            >
              <Download className="w-5 h-5" />
              Download Memorial PDF
            </button>
            <button
              onClick={handleMobileReload}
              disabled={pdfLoading}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-amber-500 text-white rounded-xl font-semibold hover:bg-amber-600 transition-all duration-300 shadow-lg disabled:opacity-50"
            >
              <RefreshCw className="w-5 h-5" />
              Reload Preview
            </button>
          </div>
        </div>

        {/* ✅ FIX 15: Mobile help text */}
        {isMobile && (
          <div className="mt-4 bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
            <p className="text-sm text-blue-800">
              <strong>Mobile Tip:</strong> If preview fails, use the download button. Some mobile browsers have trouble displaying PDFs.
            </p>
          </div>
        )}

        {/* Additional Info - UNCHANGED */}
        <div className="mt-4 sm:mt-8 bg-white rounded-xl shadow-lg p-4 sm:p-6 text-center">
          <p className="text-sm sm:text-base text-gray-600 mb-4">
            This memorial booklet contains the complete story, photos, and memories of {memorialData?.name}.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-500">
            <span className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              PDF Format
            </span>
            <span className="hidden sm:inline">•</span>
            <span>High Quality Print Ready</span>
            <span className="hidden sm:inline">•</span>
            <span className="hidden sm:inline">Shareable with Family & Friends</span>
          </div>
        </div>
      </div>

      {/* Footer - UNCHANGED */}
      <div className="bg-white border-t border-gray-200 mt-8 sm:mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 text-center">
          <p className="text-gray-600 text-xs sm:text-sm">
            Created with love using Wings of Memories
          </p>
          <p className="text-gray-500 text-xs mt-2">
            {new Date().getFullYear()} • Preserving Precious Memories
          </p>
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
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
          animation: fade-in 0.5s ease-out;
        }
        
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
  );
};