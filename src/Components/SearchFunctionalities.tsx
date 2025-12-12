import React, { useState, useEffect, useRef } from 'react';
import { Search, Eye, ChevronDown, X, Loader2, Facebook, Twitter, Instagram, Mail } from 'lucide-react';

interface PublicMemorial {
  id: string;
  name: string;
  profileImage: string;
  birthDate: string;
  deathDate: string;
  location: string;
  obituary: string;
  customUrl: string;
  createdAt: string;
  theme: string;
}

interface SearchResults {
  memorials: PublicMemorial[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}

interface SearchNavbarProps {
  onSearch?: (query: string) => void;
  onResults?: (results: PublicMemorial[]) => void;
  showResults?: boolean;
}

export default function SearchNavbar({ 
  onSearch, 
  onResults,
  showResults = true
}: SearchNavbarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<PublicMemorial[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResultsDropdown, setShowResultsDropdown] = useState(false);
  const [totalResults, setTotalResults] = useState(0);
  const [searchAttempted, setSearchAttempted] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const resultsRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const BACKEND_URL = 'https://wings-of-memories-backend.onrender.com/api';

  // Check for mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (resultsRef.current && !resultsRef.current.contains(event.target as Node)) {
        setShowResultsDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchMemorials = async (query: string = '') => {
    if (!showResults) return;

    setIsSearching(true);
    setSearchAttempted(true);
    
    try {
      const params = new URLSearchParams({
        sortBy: 'recent',
        limit: '6',
        offset: '0'
      });
      
      // Only add search param if query exists
      if (query.trim()) {
        params.append('search', query.trim());
      }

      const response = await fetch(`${BACKEND_URL}/memorials/public?${params}`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data: SearchResults = await response.json();
      
      setSearchResults(data.memorials);
      setTotalResults(data.pagination.total);
      
      if (onResults) {
        onResults(data.memorials);
      }

    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
      setTotalResults(0);
      
      if (onResults) {
        onResults([]);
      }
    } finally {
      setIsSearching(false);
    }
  };

  // Debounced search effect
  useEffect(() => {
    if (!showResults) return;

    const timeoutId = setTimeout(() => {
      if (searchQuery.trim().length >= 2 || searchQuery.trim().length === 0) {
        fetchMemorials(searchQuery);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, showResults]);

  const handleSearch = () => {
    if (onSearch) {
      onSearch(searchQuery);
    }
    
    fetchMemorials(searchQuery);
    setShowResultsDropdown(true);
    setSearchAttempted(true);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleInputFocus = () => {
    // Show dropdown when input is focused (empty search shows all memorials)
    if (searchResults.length > 0) {
      setShowResultsDropdown(true);
    } else if (searchQuery.length === 0) {
      // Fetch all memorials when clicking into empty search
      fetchMemorials('');
      setShowResultsDropdown(true);
    }
  };

  const viewMemorialPage = (memorial: PublicMemorial) => {
  const memorialSlug = memorial.customUrl || memorial.id;
  const memorialUrl = `/memorial/${memorialSlug}`;
  
  // Close all UI elements first
  setShowResultsDropdown(false);
  setSearchQuery('');
  setIsExpanded(false);
  
  // On mobile, ensure we start at the top of the memorial page
  if (isMobile) {
    // Force scroll to top before navigation
    window.scrollTo({ top: 0, behavior: 'instant' });
    
    // Small delay to ensure scroll happens before navigation
    setTimeout(() => {
      window.location.href = memorialUrl;
    }, 50);
  } else {
    // Desktop - normal behavior
    window.location.href = memorialUrl;
  }
};
  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setShowResultsDropdown(false);
    setSearchAttempted(false);
    if (onSearch) {
      onSearch('');
    }
    if (onResults) {
      onResults([]);
    }
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
    if (!isExpanded && inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Format date for display
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-200 shadow-sm sticky top-0 z-50">
      <div className={`max-w-7xl mx-auto px-3 sm:px-4 transition-all duration-300 ${isExpanded ? 'py-3' : 'py-3 sm:py-4'}`}>
        
        {/* Compact Header */}
        <div className="flex items-center justify-between gap-3 sm:gap-4">
          
          {/* Logo/Site Name */}
          <div className="shrink-0">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white text-sm sm:text-lg font-bold">4R</span>
              </div>
              <div className="hidden sm:block">
                <span className="text-lg font-bold text-gray-900 block">Memorial Garden</span>
                <span className="text-sm text-gray-600">Honoring cherished memories</span>
              </div>
              <div className="sm:hidden">
                <span className="text-base font-bold text-gray-900 block">Memorial Garden</span>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl relative">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                <Search className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
              </div>
              <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                onFocus={handleInputFocus}
                placeholder="Search memorials by name, location, or story..."
                className="block w-full pl-10 sm:pl-12 pr-20 sm:pr-28 py-2.5 sm:py-3 border-2 border-amber-300 
                         bg-white focus:outline-none focus:ring-2 focus:ring-amber-400 
                         focus:border-transparent placeholder-gray-400 text-gray-900 
                         text-sm sm:text-base font-medium rounded-xl shadow-sm transition-all duration-200"
              />
              
              {/* Search Actions */}
              <div className="absolute inset-y-0 right-0 flex items-center pr-1 sm:pr-2">
                {searchQuery && (
                  <button
                    onClick={clearSearch}
                    className="p-1.5 sm:p-2 mr-1 sm:mr-2 text-gray-500 hover:text-gray-700 transition-colors"
                    aria-label="Clear search"
                  >
                    <X className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                )}
                <button
                  onClick={handleSearch}
                  disabled={isSearching}
                  className="flex items-center gap-1 sm:gap-2 px-3 sm:px-5 py-1.5 sm:py-2 bg-amber-500 hover:bg-amber-600 
                           disabled:bg-amber-300 text-white text-sm sm:text-base font-semibold rounded-lg 
                           transition-colors disabled:cursor-not-allowed shadow hover:shadow-lg min-w-[70px] sm:min-w-[80px] justify-center"
                >
                  {isSearching ? (
                    <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" />
                  ) : (
                    'Search'
                  )}
                </button>
              </div>
            </div>

            {/* Search Results Dropdown */}
            {showResults && showResultsDropdown && (
              <div 
                ref={resultsRef}
                className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-amber-300 
                         rounded-xl shadow-2xl z-50 overflow-y-auto max-h-[500px] animate-fade-in"
              >
                {isSearching ? (
                  <div className="p-6 sm:p-8 text-center">
                    <Loader2 className="w-6 h-6 sm:w-8 sm:h-8 animate-spin mx-auto text-amber-500" />
                    <p className="text-base sm:text-lg text-gray-700 mt-3 sm:mt-4 font-medium">Searching memorials...</p>
                  </div>
                ) : searchResults.length > 0 ? (
                  <>
                    <div className="p-3 sm:p-4 border-b border-amber-100 bg-amber-50 sticky top-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm sm:text-lg font-bold text-gray-900 truncate">
                          {totalResults} memorial{totalResults !== 1 ? 's' : ''}
                          {searchQuery && (
                            <span className="text-gray-700"> for "<span className="text-amber-800">{searchQuery}</span>"</span>
                          )}
                        </p>
                        <button
                          onClick={() => setShowResultsDropdown(false)}
                          className="p-1.5 sm:p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors shrink-0"
                          aria-label="Close results"
                        >
                          <X className="w-5 h-5 sm:w-6 sm:h-6" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="p-3 sm:p-4 space-y-3 sm:space-y-4">
                      {searchResults.slice(0, 6).map((memorial) => (
                        <div
                          key={memorial.id}
                          className="group p-3 sm:p-4 hover:bg-amber-50 rounded-lg transition-all cursor-pointer border border-gray-200 hover:border-amber-300 hover:shadow-sm"
                          onClick={() => viewMemorialPage(memorial)}
                        >
                          <div className="flex items-start gap-3 sm:gap-4">
                            {/* Memorial Image */}
                            <div className="shrink-0">
                              {memorial.profileImage ? (
                                <img
                                  src={memorial.profileImage}
                                  alt={memorial.name}
                                  className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl object-cover border-2 border-amber-200"
                                  onError={(e) => {
                                    e.currentTarget.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 24 24" fill="%23f59e0b"><path d="M12 12q-1.65 0-2.825-1.175T8 8q0-1.65 1.175-2.825T12 4q1.65 0 2.825 1.175T16 8q0 1.65-1.175 2.825T12 12Zm-8 8v-2.8q0-.85.438-1.563T5.6 14.55q1.55-.775 3.15-1.163T12 13q1.65 0 3.25.388t3.15 1.162q.725.375 1.163 1.088T20 17.2V20H4Z"/></svg>';
                                  }}
                                />
                              ) : (
                                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center border-2 border-amber-200">
                                  <span className="text-2xl sm:text-3xl">💐</span>
                                </div>
                              )}
                            </div>
                            
                            {/* Memorial Details */}
                            <div className="flex-1 min-w-0">
                              <h3 className="font-bold text-gray-900 text-base sm:text-lg mb-1 sm:mb-2 group-hover:text-amber-800 transition-colors truncate">
                                {memorial.name}
                              </h3>
                              
                              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
                                {memorial.birthDate && (
                                  <span className="text-xs sm:text-sm text-gray-700 bg-gray-100 px-2 sm:px-3 py-1 rounded-lg font-medium truncate">
                                    Born: {formatDate(memorial.birthDate)}
                                  </span>
                                )}
                                
                                {memorial.deathDate && (
                                  <span className="text-xs sm:text-sm text-gray-700 bg-gray-100 px-2 sm:px-3 py-1 rounded-lg font-medium truncate">
                                    Passed: {formatDate(memorial.deathDate)}
                                  </span>
                                )}
                                
                                {memorial.location && (
                                  <span className="text-xs sm:text-sm text-gray-700 flex items-center gap-1 px-2 sm:px-3 py-1 bg-gray-100 rounded-lg truncate">
                                    <span className="text-amber-600 text-xs">📍</span> 
                                    <span className="truncate">{memorial.location}</span>
                                  </span>
                                )}
                              </div>
                              
                              {memorial.obituary && (
                                <p className="text-sm sm:text-base text-gray-800 line-clamp-2 leading-relaxed">
                                  {memorial.obituary}
                                </p>
                              )}
                            </div>
                            
                            {/* View Button */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                viewMemorialPage(memorial);
                              }}
                              className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2.5 bg-amber-500 text-white text-sm sm:text-base font-bold rounded-lg hover:bg-amber-600 transition-colors shadow-md hover:shadow-lg shrink-0"
                            >
                              <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                              <span className="hidden sm:inline">View</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {totalResults > 6 && (
                      <div className="p-3 sm:p-4 border-t border-amber-100 bg-gray-50 sticky bottom-0">
                        <button
                          onClick={() => {
                            window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
                          }}
                          className="w-full text-center text-sm sm:text-lg text-amber-700 hover:text-amber-800 font-bold py-2 sm:py-3 hover:underline"
                        >
                          View all {totalResults} results →
                        </button>
                      </div>
                    )}
                  </>
                ) : searchAttempted ? (
                  <div className="p-6 sm:p-8 text-center">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 bg-amber-100 rounded-full flex items-center justify-center">
                      <Search className="w-6 h-6 sm:w-8 sm:h-8 text-amber-600" />
                    </div>
                    <p className="text-base sm:text-xl text-gray-900 font-bold mb-2">No memorials found</p>
                    <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
                      {searchQuery ? "Try different keywords or check your spelling" : "No memorials available"}
                    </p>
                    <div className="text-sm sm:text-base text-gray-600 bg-amber-50 p-4 sm:p-5 rounded-xl">
                      <p className="font-bold text-gray-900 mb-2 sm:mb-3">Search tips:</p>
                      <ul className="space-y-1.5 sm:space-y-2 text-left">
                        <li className="flex items-center gap-2">
                          <span className="text-amber-600 text-sm sm:text-lg">•</span> Try first name only
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="text-amber-600 text-sm sm:text-lg">•</span> Try last name only
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="text-amber-600 text-sm sm:text-lg">•</span> Try location names
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="text-amber-600 text-sm sm:text-lg">•</span> Use partial names
                        </li>
                      </ul>
                    </div>
                  </div>
                ) : null}
              </div>
            )}
          </div>

          {/* Expand Button (Desktop Only) */}
          {!isMobile && (
            <button
              onClick={toggleExpand}
              className="p-2.5 text-gray-600 hover:text-gray-900 hover:bg-amber-100 rounded-lg transition-colors border-2 border-amber-300 shrink-0"
              aria-label={isExpanded ? "Collapse search" : "Expand search"}
            >
              {isExpanded ? (
                <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 rotate-180 transition-transform" />
              ) : (
                <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 transition-transform" />
              )}
            </button>
          )}
        </div>

        {/* Expanded Section - Always includes Follow Us */}
        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-amber-300 animate-slide-down">
            {/* Search Tips */}
            <div className="mb-4">
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-sm sm:text-base text-gray-700">
                <span className="font-bold text-gray-900">Search by:</span>
                <button
                  onClick={() => setSearchQuery('John')}
                  className="px-3 sm:px-4 py-1.5 sm:py-2 bg-amber-100 hover:bg-amber-200 rounded-lg text-gray-800 font-medium transition-colors text-sm sm:text-base"
                >
                  Name
                </button>
                <button
                  onClick={() => setSearchQuery('New York')}
                  className="px-3 sm:px-4 py-1.5 sm:py-2 bg-amber-100 hover:bg-amber-200 rounded-lg text-gray-800 font-medium transition-colors text-sm sm:text-base"
                >
                  Location
                </button>
                <button
                  onClick={() => setSearchQuery('2023')}
                  className="px-3 sm:px-4 py-1.5 sm:py-2 bg-amber-100 hover:bg-amber-200 rounded-lg text-gray-800 font-medium transition-colors text-sm sm:text-base"
                >
                  Year
                </button>
                <button
                  onClick={clearSearch}
                  className="ml-auto text-sm sm:text-base text-amber-700 hover:text-amber-800 font-bold"
                >
                  Clear all
                </button>
              </div>
            </div>

            {/* Follow Us Section - Always visible when expanded */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-amber-100/50 p-3 sm:p-4 rounded-xl border border-amber-200 gap-3 sm:gap-0">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1">Follow Us</h3>
                <p className="text-xs sm:text-sm text-gray-700">Stay connected with our memorial community</p>
              </div>
              <div className="flex items-center gap-1 sm:gap-2">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" 
                   className="p-2 sm:p-3 bg-white text-blue-600 hover:text-white hover:bg-blue-600 rounded-xl transition-all shadow-sm hover:shadow-md">
                  <Facebook className="w-4 h-4 sm:w-5 sm:h-5" />
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" 
                   className="p-2 sm:p-3 bg-white text-blue-400 hover:text-white hover:bg-blue-400 rounded-xl transition-all shadow-sm hover:shadow-md">
                  <Twitter className="w-4 h-4 sm:w-5 sm:h-5" />
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" 
                   className="p-2 sm:p-3 bg-white text-pink-600 hover:text-white hover:bg-pink-600 rounded-xl transition-all shadow-sm hover:shadow-md">
                  <Instagram className="w-4 h-4 sm:w-5 sm:h-5" />
                </a>
                <a href="mailto:contact@4revah.com" 
                   className="p-2 sm:p-3 bg-white text-amber-600 hover:text-white hover:bg-amber-500 rounded-xl transition-all shadow-sm hover:shadow-md">
                  <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
                </a>
              </div>
            </div>

            {/* Active Search Info */}
            {searchAttempted && (
              <div className="mt-4 pt-4 border-t border-amber-200">
                <div className="flex items-center justify-between text-sm sm:text-base text-gray-700">
                  <div className="truncate">
                    <span className="font-bold text-gray-900">Searching:</span>
                    <span className="ml-2 text-amber-800 font-bold truncate">
                      {searchQuery ? `"${searchQuery}"` : "All memorials"}
                    </span>
                    {isSearching ? (
                      <span className="ml-2 sm:ml-3 text-gray-600">
                        <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 inline animate-spin mr-1 sm:mr-2" /> 
                        <span className="hidden sm:inline">Searching...</span>
                      </span>
                    ) : totalResults > 0 ? (
                      <span className="ml-2 sm:ml-3 text-gray-600">
                        • Found {totalResults} memorial{totalResults !== 1 ? 's' : ''}
                      </span>
                    ) : (
                      <span className="ml-2 sm:ml-3 text-gray-600">• No results</span>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Follow Us Section (Desktop Only - Always visible when not expanded) */}
        {!isMobile && !isExpanded && (
          <div className="mt-3 pt-3 border-t border-amber-200">
            <div className="flex items-center justify-between bg-amber-100/50 p-3 rounded-xl border border-amber-200">
              <div>
                <h3 className="text-sm font-bold text-gray-900">Follow Our Memorial Community</h3>
                <p className="text-xs text-gray-700">Stay connected for updates and support</p>
              </div>
              <div className="flex items-center gap-1">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" 
                   className="p-2 bg-white text-blue-600 hover:text-white hover:bg-blue-600 rounded-xl transition-all shadow-sm hover:shadow-md">
                  <Facebook className="w-4 h-4" />
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" 
                   className="p-2 bg-white text-blue-400 hover:text-white hover:bg-blue-400 rounded-xl transition-all shadow-sm hover:shadow-md">
                  <Twitter className="w-4 h-4" />
                </a>
                <a href="mailto:contact@4revah.com" 
                   className="p-2 bg-white text-amber-600 hover:text-white hover:bg-amber-500 rounded-xl transition-all shadow-sm hover:shadow-md">
                  <Mail className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mobile responsive styles to prevent horizontal scrolling */}
      <style >{`
        @media (max-width: 640px) {
          /* Ensure content doesn't overflow horizontally */
          * {
            max-width: 100vw;
            overflow-x: hidden;
          }
          
          /* Specific fixes for mobile */
          .flex.items-center.justify-between.gap-3 {
            flex-wrap: nowrap;
            overflow-x: visible;
          }
          
          .flex-1.max-w-2xl.relative {
            max-width: 100%;
            overflow: visible;
          }
          
          /* Ensure input text is visible */
          input[type="text"] {
            font-size: 16px !important;
          }
          
          /* Prevent horizontal scroll on body */
          body {
            overflow-x: hidden;
            position: relative;
          }
          
          /* Better line clamping */
          .line-clamp-2 {
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
        }
        
        /* Custom animations */
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
        
        @keyframes slide-down {
          from {
            opacity: 0;
            max-height: 0;
          }
          to {
            opacity: 1;
            max-height: 1000px;
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
        
        .animate-slide-down {
          animation: slide-down 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}