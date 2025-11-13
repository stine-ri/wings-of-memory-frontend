import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Download, FileText, AlertCircle, Loader, Check, ZoomIn, ZoomOut } from 'lucide-react';

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

  useEffect(() => {
    const fetchMemorialData = async () => {
      if (!id) {
        setError('Memorial ID is missing');
        setLoading(false);
        return;
      }

      try {
        // Fetch memorial data first
        const response = await fetch(
          `https://wings-of-memories-backend.onrender.com/api/memorials/${id}/pdf-data`
        );

        if (!response.ok) {
          throw new Error('Memorial not found');
        }

        const data = await response.json();
        setMemorialData(data.memorial);

        // Set PDF URL for iframe
        const pdfPreviewUrl = `https://wings-of-memories-backend.onrender.com/api/memorials/${id}/preview-pdf`;
        setPdfUrl(pdfPreviewUrl);

        setLoading(false);
      } catch (err) {
        console.error('Error fetching memorial:', err);
        setError(err instanceof Error ? err.message : 'Failed to load memorial');
        setLoading(false);
      }
    };

    fetchMemorialData();
  }, [id]);

  // Handle PDF load
  const handlePdfLoad = () => {
    setTimeout(() => {
      setPdfLoading(false);
    }, 500);
  };

  const handleDownload = () => {
    if (!id) return;
    
    const downloadUrl = `https://wings-of-memories-backend.onrender.com/api/memorials/${id}/preview-pdf`;
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = `${memorialData?.name.replace(/\s+/g, '-').toLowerCase() || 'memorial'}-booklet.pdf`;
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
            Memorial Not Found
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <a
            href="/"
            className="inline-block px-6 py-3 bg-amber-500 text-white rounded-xl font-semibold hover:bg-amber-600 transition-colors"
          >
            Go to Home
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100">
      {/* Header */}
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
          {/* Info Banner */}
          <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 sm:px-6 py-3 sm:py-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <FileText className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" />
              <div>
                <h2 className="font-semibold text-base sm:text-lg">Memorial Booklet Preview</h2>
                <p className="text-xs sm:text-sm text-amber-100 hidden sm:block">
                  View the complete memorial booklet below or download it to save and share
                </p>
              </div>
            </div>
          </div>

          {/* Zoom Controls - Desktop only */}
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
            {/* Loading Overlay */}
            {pdfLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
                <div className="text-center p-8">
                  <Loader className="w-12 h-12 text-amber-500 mx-auto mb-4 animate-spin" />
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    Loading PDF...
                  </h3>
                  <p className="text-sm text-gray-600">
                    Please wait while we load the memorial booklet
                  </p>
                  <div className="mt-4 w-64 mx-auto bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div className="bg-amber-500 h-full rounded-full animate-pulse" style={{ width: '70%' }}></div>
                  </div>
                </div>
              </div>
            )}

            {/* Success Indicator */}
            {!pdfLoading && (
              <div className="absolute top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 z-10 animate-fade-in">
                <Check className="w-4 h-4" />
                <span className="text-sm font-medium">PDF Loaded</span>
              </div>
            )}

            {/* PDF Iframe with responsive zoom */}
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
                style={{ minHeight: window.innerWidth >= 640 ? `${100 / (zoom / 100)}%` : '100%' }}
              />
            </div>
            
            {/* Fallback for browsers that don't support PDF viewing */}
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

          {/* Mobile Download Button */}
          <div className="sm:hidden bg-gray-50 px-4 py-3 border-t border-gray-200">
            <button
              onClick={handleDownload}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg"
            >
              <Download className="w-5 h-5" />
              Download Memorial PDF
            </button>
          </div>
        </div>

        {/* Additional Info */}
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

      {/* Footer */}
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
      `}</style>
    </div>
  );
};