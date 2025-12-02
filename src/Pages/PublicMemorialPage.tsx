// frontend/pages/PublicMemorialPage.tsx - ENHANCED LOADING EXPERIENCE
import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  MessageCircle, Download, ArrowLeft, User, MapPin, Calendar, 
  FileText, Clock, Heart, Sparkles
} from 'lucide-react';
import TributeForm from '../Components/TributeForm';

// Define proper TypeScript interfaces
interface TimelineEvent {
  date: string;
  year: number;
  title: string;
  description: string;
  location?: string;
  icon: string;
}

interface GalleryImage {
  url: string;
  category: string;
}

interface FamilyMember {
  name: string;
  image: string;
  relation: string;
}

interface ServiceInfo {
  venue: string;
  address: string;
  date: string;
  time: string;
  virtualLink?: string;
  virtualPlatform?: string;
}

interface Favorite {
  category: string;
  icon: string;
  question: string;
  answer: string;
}

interface MemoryWallTribute {
  id: string;
  authorName: string;
  authorLocation: string;
  message: string;
  authorImage?: string;
  createdAt: string;
  isPublic: boolean;
  relativeTime?: string;
}

interface MemorialData {
  id: string;
  name: string;
  profileImage: string;
  birthDate: string;
  deathDate: string;
  location: string;
  obituary: string;
  timeline: TimelineEvent[];
  favorites: Favorite[];
  familyTree: FamilyMember[];
  gallery: GalleryImage[];
  memoryWall: MemoryWallTribute[];
  service: ServiceInfo;
  serviceInfo: ServiceInfo;
  customUrl: string;
  theme: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function PublicMemorialPage() {
  const { identifier } = useParams<{ identifier: string }>();
  const navigate = useNavigate();
  const [memorial, setMemorial] = useState<MemorialData | null>(null);
  const [loading, setLoading] = useState(true);
  const [pdfUrl, setPdfUrl] = useState<string>('');
  const [pdfLoading, setPdfLoading] = useState(true);
  const [pdfProgress, setPdfProgress] = useState(0);
  const [showPdf, setShowPdf] = useState(true);
  const [activeTab, setActiveTab] = useState<'pdf' | 'tributes'>('pdf');
  const [screenSize, setScreenSize] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const tipIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  const BACKEND_URL = 'https://wings-of-memories-backend.onrender.com/api';

  // Loading tips for PDF generation
  const pdfLoadingTips = [
    "Generating beautiful PDF layout...",
    "Processing memorial photos...",
    "Formatting timeline entries...",
    "Adding tribute messages...",
    "Preparing for print quality...",
    "Finalizing memorial booklet...",
    "Optimizing for mobile viewing...",
    "Almost ready...",
  ];

  const funFacts = [
    "Did you know? Each tribute becomes a permanent part of this memorial.",
    "Tip: PDFs preserve memories in print-friendly format for generations.",
    "This memorial includes photos, stories, and favorite memories.",
    "PDF generation ensures your memories are preserved forever.",
    "Each section is carefully formatted for the best reading experience.",
  ];

  // Detect screen size
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setScreenSize('mobile');
      } else if (width < 1024) {
        setScreenSize('tablet');
      } else {
        setScreenSize('desktop');
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Start loading animations
  useEffect(() => {
    if (pdfLoading) {
      // Progress simulation
      progressIntervalRef.current = setInterval(() => {
        setPdfProgress(prev => {
          if (prev >= 95) return 95; // Cap at 95% until actual load
          return prev + Math.random() * 5;
        });
      }, 1000);

      // Rotate through tips
      tipIntervalRef.current = setInterval(() => {
        setCurrentTipIndex(prev => (prev + 1) % pdfLoadingTips.length);
      }, 4000);

      return () => {
        if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
        if (tipIntervalRef.current) clearInterval(tipIntervalRef.current);
      };
    } else {
      setPdfProgress(100);
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      if (tipIntervalRef.current) clearInterval(tipIntervalRef.current);
    }
  }, [pdfLoading, pdfLoadingTips.length]); // Added missing dependency

  // Fetch memorial data
  useEffect(() => {
    const fetchMemorial = async () => {
      setLoading(true);
      try {
        console.log('📄 [PUBLIC] Fetching memorial for:', identifier);
        const response = await fetch(`${BACKEND_URL}/memorials/public/${identifier}`);
        
        if (response.ok) {
          const data = await response.json();
          console.log('✅ [PUBLIC] Memorial data loaded:', data.memorial.name);
          setMemorial(data.memorial);
          
          const timestamp = new Date().getTime();
          const pdfPreviewUrl = `${BACKEND_URL}/memorials/${identifier}/preview-pdf?t=${timestamp}`;
          console.log('📄 [PUBLIC] PDF URL set:', pdfPreviewUrl);
          
          setPdfUrl(pdfPreviewUrl);
          
        } else {
          console.error('❌ [PUBLIC] Memorial not found:', response.status);
          navigate('/404');
        }
      } catch (error) {
        console.error('❌ [PUBLIC] Error fetching memorial:', error);
      } finally {
        setLoading(false);
      }
    };

    if (identifier) {
      fetchMemorial();
    }
  }, [identifier, navigate]);

  // Handle PDF load
  const handlePdfLoad = () => {
    setPdfLoading(false);
    setPdfProgress(100);
    console.log('✅ PDF loaded in iframe');
    
    // Clear intervals
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    if (tipIntervalRef.current) clearInterval(tipIntervalRef.current);
  };

  const handlePdfError = () => {
    console.error('❌ PDF failed to load in iframe');
    setPdfLoading(false);
    
    // Clear intervals
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    if (tipIntervalRef.current) clearInterval(tipIntervalRef.current);
  };

  // Handle tribute submission
  const handleTributeSubmit = async (tributeData: {
    authorName: string;
    authorLocation: string;
    message: string;
    authorImage?: string;
  }) => {
    if (!memorial) return { success: false, error: 'No memorial data' };

    try {
      console.log('💐 [PUBLIC] Submitting tribute for:', identifier);
      const response = await fetch(`${BACKEND_URL}/memorials/public/${identifier}/tributes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tributeData)
      });

      if (response.ok) {
        console.log('✅ [PUBLIC] Tribute submitted successfully');
        
        const memorialResponse = await fetch(`${BACKEND_URL}/memorials/public/${identifier}`);
        if (memorialResponse.ok) {
          const data = await memorialResponse.json();
          setMemorial(data.memorial);
        }
        
        if (identifier) {
          const timestamp = new Date().getTime();
          const newPdfUrl = `${BACKEND_URL}/memorials/${identifier}/preview-pdf?t=${timestamp}`;
          setPdfUrl(newPdfUrl);
          setPdfLoading(true);
          setPdfProgress(0);
          console.log('🔄 [PUBLIC] PDF regenerated with new tribute');
        }
        
        return { success: true };
      } else {
        const errorData = await response.json();
        console.error('❌ [PUBLIC] Tribute submission failed:', errorData);
        return { success: false, error: errorData.error || 'Failed to submit tribute' };
      }
    } catch (error) {
      console.error('❌ [PUBLIC] Error submitting tribute:', error);
      return { success: false, error: 'Network error' };
    }
  };

  // Download PDF
  const handleDownloadPDF = async () => {
    if (!identifier || !memorial) return;
    
    try {
      console.log('⬇️ [PUBLIC] Downloading PDF for:', identifier);
      const timestamp = new Date().getTime();
      const downloadUrl = `${BACKEND_URL}/memorials/${identifier}/preview-pdf?download=true&t=${timestamp}`;
      
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `${memorial.name.replace(/\s+/g, '-').toLowerCase() || 'memorial'}.pdf`;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('❌ [PUBLIC] Error downloading PDF:', error);
    }
  };

  // Format date helper
  const formatDate = (dateString?: string): string => {
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

  // Get responsive PDF height
  const getPdfHeight = () => {
    switch (screenSize) {
      case 'mobile':
        return 'h-[calc(100vh-300px)] min-h-[400px]';
      case 'tablet':
        return 'h-[calc(100vh-350px)] min-h-[500px]';
      case 'desktop':
        return 'h-[calc(100vh-400px)] min-h-[600px]';
      default:
        return 'h-[800px]';
    }
  };

  // Get responsive image size
  const getProfileImageSize = () => {
    switch (screenSize) {
      case 'mobile':
        return 'w-24 h-24';
      case 'tablet':
        return 'w-28 h-28';
      case 'desktop':
        return 'w-32 h-32';
      default:
        return 'w-32 h-32';
    }
  };

  // Enhanced loading screen
  const LoadingScreen = () => (
    <div className="min-h-screen bg-linear-to-b from-amber-50 to-white flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="relative">
          <div className="w-16 h-16 md:w-20 md:h-20 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Heart className="w-8 h-8 md:w-10 md:h-10 text-amber-600 animate-pulse" />
          </div>
        </div>
        <h2 className="text-xl md:text-2xl font-bold text-gray-800 mt-6 mb-3">
          Loading Memorial
        </h2>
        <p className="text-gray-600 text-sm md:text-base mb-6">
          Gathering precious memories...
        </p>
        <div className="flex justify-center space-x-2">
          {[1, 2, 3].map((dot) => (
            <div
              key={dot}
              className="w-2 h-2 bg-amber-400 rounded-full animate-bounce"
              style={{ animationDelay: `${dot * 0.2}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );

  if (loading) {
    return <LoadingScreen />;
  }

  if (!memorial) {
    return (
      <div className="min-h-screen bg-linear-to-b from-amber-50 to-white flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">Memorial Not Found</h2>
          <p className="text-gray-600 text-sm md:text-base mb-6">The memorial you're looking for doesn't exist or is private.</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors text-sm md:text-base"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-amber-50 to-white">
      {/* Header */}
      <header className="bg-white border-b border-amber-200">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-gray-600 hover:text-amber-600 transition-colors text-sm sm:text-base w-full sm:w-auto"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="truncate">Back to Search</span>
            </button>
            
            <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto">
              <button
                onClick={handleDownloadPDF}
                className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors text-sm sm:text-base flex-1 sm:flex-initial"
              >
                <Download className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden xs:inline">Download</span>
                <span className="xs:hidden">PDF</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 md:py-8">
        {/* Memorial Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
            {memorial.profileImage ? (
              <img
                src={memorial.profileImage}
                alt={memorial.name}
                className={`${getProfileImageSize()} rounded-2xl object-cover border-4 border-white shadow-lg shrink-0 mx-auto sm:mx-0`}
              />
            ) : (
              <div className={`${getProfileImageSize()} rounded-2xl bg-linear-to-br from-amber-100 to-orange-100 flex items-center justify-center border-4 border-white shadow-lg shrink-0 mx-auto sm:mx-0`}>
                <span className="text-3xl sm:text-4xl md:text-5xl">💐</span>
              </div>
            )}
            
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
                {memorial.name}
              </h1>
              
              <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center sm:justify-start gap-2 sm:gap-4 mt-2 sm:mt-3 text-gray-600">
                {memorial.birthDate && memorial.deathDate && (
                  <div className="flex items-center gap-1 text-sm sm:text-base">
                    <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="whitespace-nowrap">
                      {formatDate(memorial.birthDate)} - {formatDate(memorial.deathDate)}
                    </span>
                  </div>
                )}
                
                {memorial.location && (
                  <div className="flex items-center gap-1 text-sm sm:text-base">
                    <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="truncate max-w-[200px] sm:max-w-none">{memorial.location}</span>
                  </div>
                )}
              </div>
              
              {memorial.obituary && (
                <p className="mt-3 sm:mt-4 text-gray-700 leading-relaxed text-sm sm:text-base line-clamp-2 sm:line-clamp-3 max-w-3xl">
                  {memorial.obituary}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-4 sm:mb-6 border-b border-gray-200">
          <nav className="flex space-x-4 sm:space-x-8 overflow-x-auto pb-1">
            <button
              onClick={() => setActiveTab('pdf')}
              className={`py-3 px-2 sm:py-4 sm:px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === 'pdf'
                  ? 'border-amber-500 text-amber-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Memorial PDF
            </button>
            <button
              onClick={() => setActiveTab('tributes')}
              className={`py-3 px-2 sm:py-4 sm:px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === 'tributes'
                  ? 'border-amber-500 text-amber-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Tributes ({memorial.memoryWall?.length || 0})
            </button>
          </nav>
        </div>

        {/* Content based on active tab */}
        {activeTab === 'pdf' ? (
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden">
            {/* PDF Header */}
            <div className="p-3 sm:p-4 border-b border-gray-200 bg-gray-50">
              <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-2">
                <h3 className="font-semibold text-gray-800 text-sm sm:text-base">
                  {memorial.name} - Memorial PDF
                </h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleDownloadPDF}
                    className="flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-2 bg-amber-500 text-white rounded text-xs sm:text-sm hover:bg-amber-600 transition-colors"
                  >
                    <Download className="w-3 h-3" />
                    <span className="hidden xs:inline">Download</span>
                  </button>
                  <button
                    onClick={() => setShowPdf(!showPdf)}
                    className="text-xs sm:text-sm text-amber-600 hover:text-amber-700 font-medium px-2 sm:px-3 py-1 sm:py-2 rounded hover:bg-amber-50"
                  >
                    {showPdf ? 'Hide' : 'Show'} PDF
                  </button>
                </div>
              </div>
            </div>
            
            {/* PDF Container */}
            {showPdf && pdfUrl && (
              <div className={`${getPdfHeight()} bg-gray-100 relative`}>
                {pdfLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white/95 z-10">
                    <div className="text-center p-4 sm:p-6 max-w-md w-full">
                      {/* Animated Loading */}
                      <div className="relative mb-4 sm:mb-6">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <FileText className="w-8 h-8 sm:w-10 sm:h-10 text-amber-600 animate-pulse" />
                        </div>
                      </div>
                      
                      <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">
                        {pdfLoadingTips[currentTipIndex]}
                      </h3>
                      
                      {/* Progress Bar */}
                      <div className="w-full bg-gray-200 rounded-full h-2 sm:h-3 overflow-hidden mb-3 sm:mb-4">
                        <div 
                          className="bg-linear-to-r from-amber-500 to-orange-500 h-full rounded-full transition-all duration-500 ease-out"
                          style={{ width: `${pdfProgress}%` }}
                        >
                          <div className="h-full w-full bg-white opacity-20 animate-shimmer"></div>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-xs sm:text-sm text-amber-600 font-medium">
                          {Math.round(pdfProgress)}% Complete
                        </span>
                        <span className="text-xs text-gray-500">
                          <Clock className="w-3 h-3 inline mr-1" />
                          ~30-60s
                        </span>
                      </div>
                      
                      {/* Loading Tips */}
                      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 sm:p-4 mb-4">
                        <div className="flex items-start gap-2">
                          <Sparkles className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                          <div className="text-left">
                            <p className="text-xs text-amber-800 font-medium mb-1">What's happening?</p>
                            <p className="text-xs text-amber-700">
                              {funFacts[currentTipIndex % funFacts.length]}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Quick Actions */}
                      <div className="flex flex-col sm:flex-row gap-2">
                        <button
                          onClick={() => setActiveTab('tributes')}
                          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 transition-colors text-xs sm:text-sm"
                        >
                          <MessageCircle className="w-3 h-3" />
                          Browse Tributes
                        </button>
                        <button
                          onClick={handleDownloadPDF}
                          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-xs sm:text-sm"
                        >
                          <Download className="w-3 h-3" />
                          Skip to Download
                        </button>
                      </div>
                      
                      {/* Mobile-specific tip */}
                      {screenSize === 'mobile' && (
                        <p className="text-xs text-gray-500 mt-4">
                          💡 Tip: You can browse tributes while waiting
                        </p>
                      )}
                    </div>
                  </div>
                )}
                
                {/* PDF Iframe */}
                <iframe
                  src={pdfUrl}
                  className="w-full h-full border-0"
                  title={`${memorial.name} Memorial PDF`}
                  onLoad={handlePdfLoad}
                  onError={handlePdfError}
                  style={{ display: pdfLoading ? 'none' : 'block' }}
                />
                
                {/* Mobile PDF Help */}
                {screenSize === 'mobile' && !pdfLoading && (
                  <div className="absolute bottom-4 left-4 right-4 bg-black/85 text-white text-xs rounded-lg p-3 z-10 animate-fade-in">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        Pinch to zoom • Rotate for better view
                      </span>
                      <button
                        onClick={handleDownloadPDF}
                        className="bg-white text-black px-2 py-1 rounded text-xs font-medium hover:bg-gray-100 transition-colors"
                      >
                        Download
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {/* Tribute Form Below PDF */}
            <div className="p-4 sm:p-6 border-t border-gray-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-linear-to-br from-amber-500 to-orange-500 rounded-lg flex items-center justify-center">
                  <Heart className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="text-base sm:text-lg font-semibold text-gray-800">
                    Share Your Tribute
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-600">
                    Add a tribute that will be permanently included in this memorial
                  </p>
                </div>
              </div>
              <TributeForm onSubmit={handleTributeSubmit} />
            </div>
          </div>
        ) : (
          /* Tributes Tab */
          <div className="space-y-4 sm:space-y-6">
            {/* Tribute Form */}
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-linear-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                  <Heart className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-800">
                    Leave a Tribute for {memorial.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600">
                    Your tribute will be saved and added to the memorial PDF
                  </p>
                </div>
              </div>
              <TributeForm onSubmit={handleTributeSubmit} />
            </div>

            {/* Existing Tributes */}
            {memorial.memoryWall && memorial.memoryWall.length > 0 ? (
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-800">
                    Tributes ({memorial.memoryWall.length})
                  </h3>
                  <span className="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded-full">
                    All tributes are included in the PDF
                  </span>
                </div>
                
                {memorial.memoryWall.map((tribute, index) => (
                  <div
                    key={tribute.id || index}
                    className="bg-white rounded-lg sm:rounded-xl shadow-md p-4 sm:p-6 hover:shadow-lg transition-all duration-300 border border-transparent hover:border-amber-200 group"
                  >
                    <div className="flex items-start gap-3 sm:gap-4">
                      {tribute.authorImage ? (
                        <img
                          src={tribute.authorImage}
                          alt={tribute.authorName}
                          className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover shrink-0 ring-2 ring-amber-100 group-hover:ring-amber-200 transition-all"
                        />
                      ) : (
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-linear-to-br from-amber-100 to-orange-100 flex items-center justify-center shrink-0 ring-2 ring-amber-100 group-hover:ring-amber-200 transition-all">
                          <User className="w-4 h-4 sm:w-6 sm:h-6 text-amber-600" />
                        </div>
                      )}
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-1 xs:gap-2">
                          <div className="min-w-0">
                            <h4 className="font-semibold text-gray-800 text-sm sm:text-base truncate group-hover:text-amber-700 transition-colors">
                              {tribute.authorName}
                            </h4>
                            {tribute.authorLocation && (
                              <p className="text-xs text-gray-600 flex items-center gap-1 truncate">
                                <MapPin className="w-2 h-2 sm:w-3 sm:h-3 shrink-0" />
                                <span className="truncate">{tribute.authorLocation}</span>
                              </p>
                            )}
                          </div>
                          <span className="text-xs text-gray-500 whitespace-nowrap bg-gray-50 px-2 py-1 rounded">
                            {tribute.relativeTime || 'Recently'}
                          </span>
                        </div>
                        
                        <p className="mt-3 text-gray-700 text-sm sm:text-base leading-relaxed whitespace-pre-wrap wrap-break-word bg-gray-50 p-3 rounded-lg">
                          {tribute.message}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-6 sm:p-8 text-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-8 h-8 sm:w-10 sm:h-10 text-amber-600" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">
                  No Tributes Yet
                </h3>
                <p className="text-gray-600 text-sm sm:text-base mb-4">
                  Be the first to share your memories of {memorial.name}
                </p>
                <div className="text-xs text-amber-600 bg-amber-50 inline-block px-3 py-1 rounded-full">
                  First tribute gets a special place in the memorial
                </div>
              </div>
            )}
          </div>
        )}

        {/* Footer Info */}
        <div className="mt-6 sm:mt-8">
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="flex-1 text-center sm:text-left">
                <h4 className="font-semibold text-amber-800 text-sm sm:text-base mb-1">
                  💎 Preserved Forever
                </h4>
                <p className="text-amber-700 text-xs sm:text-sm">
                  All content is preserved in a beautiful, printable PDF that can be shared and cherished for generations.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleDownloadPDF}
                  className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors text-sm"
                >
                  <Download className="w-4 h-4" />
                  Download PDF
                </button>
                <button
                  onClick={() => activeTab === 'pdf' ? setActiveTab('tributes') : setActiveTab('pdf')}
                  className="flex items-center gap-2 px-4 py-2 bg-white text-amber-600 border border-amber-300 rounded-lg hover:bg-amber-50 transition-colors text-sm"
                >
                  {activeTab === 'pdf' ? (
                    <>
                      <MessageCircle className="w-4 h-4" />
                      View Tributes
                    </>
                  ) : (
                    <>
                      <FileText className="w-4 h-4" />
                      View PDF
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <style >{`
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
}