import React, { useState, useEffect, useRef } from 'react';
import { Search, Filter, Facebook, Twitter, Instagram, Mail, Loader, Eye, ChevronDown, ChevronUp, X } from 'lucide-react';

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
  onFilterChange?: (sortBy: string) => void;
  onResults?: (results: PublicMemorial[]) => void;
  showResults?: boolean;
}

export default function SearchNavbar({ 
  onSearch, 
  onFilterChange, 
  onResults,
  showResults = true
}: SearchNavbarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedSort, setSelectedSort] = useState('recent');
  const [searchResults, setSearchResults] = useState<PublicMemorial[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResultsDropdown, setShowResultsDropdown] = useState(false);
  const [totalResults, setTotalResults] = useState(0);
  const [searchAttempted, setSearchAttempted] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  const resultsRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const filterButtonRef = useRef<HTMLButtonElement>(null);
  const filterDropdownRef = useRef<HTMLDivElement>(null);

  const BACKEND_URL = 'https://wings-of-memories-backend.onrender.com/api';

  // Check for small screens
  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth < 768);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Close results dropdown if clicking outside
      if (resultsRef.current && !resultsRef.current.contains(event.target as Node)) {
        setShowResultsDropdown(false);
      }
      
      // Close filter dropdown if clicking outside
      if (showFilters && 
          filterButtonRef.current && !filterButtonRef.current.contains(event.target as Node) &&
          filterDropdownRef.current && !filterDropdownRef.current.contains(event.target as Node)) {
        setShowFilters(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showFilters]);

  const fetchMemorials = async (query: string = '', sortBy: string = 'recent') => {
    if (!showResults) return;

    setIsSearching(true);
    setSearchAttempted(true);
    
    try {
      const params = new URLSearchParams({
        ...(query && { search: query.trim() }),
        sortBy,
        limit: isSmallScreen ? '4' : '8',
        offset: '0'
      });

      console.log('🔍 Searching with params:', params.toString());

      const response = await fetch(`${BACKEND_URL}/memorials/public?${params}`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data: SearchResults = await response.json();
      
      console.log('✅ Search successful:', {
        query,
        found: data.memorials.length,
        total: data.pagination.total
      });

      setSearchResults(data.memorials);
      setTotalResults(data.pagination.total);
      
      if (onResults) {
        onResults(data.memorials);
      }

    } catch (error) {
      console.error('❌ Search error:', error);
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
        fetchMemorials(searchQuery, selectedSort);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, selectedSort, showResults]);

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      return;
    }

    if (onSearch) {
      onSearch(searchQuery);
    }
    
    fetchMemorials(searchQuery, selectedSort);
    setShowResultsDropdown(true);
    setSearchAttempted(true);
    
    // Hide keyboard on mobile after search
    if (isSmallScreen && inputRef.current) {
      inputRef.current.blur();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleSortChange = (sortBy: string) => {
    setSelectedSort(sortBy);
    if (onFilterChange) {
      onFilterChange(sortBy);
    }
    setShowFilters(false);
    
    if (searchQuery.trim().length >= 2 || searchQuery.trim().length === 0) {
      fetchMemorials(searchQuery, sortBy);
    }
  };

  const handleInputFocus = () => {
    if (searchResults.length > 0 || searchQuery.length >= 2) {
      setShowResultsDropdown(true);
    }
  };

  const viewMemorialPage = (memorial: PublicMemorial) => {
    const memorialSlug = memorial.customUrl || memorial.id;
    const memorialUrl = `/memorial/${memorialSlug}`;
    window.location.href = memorialUrl;
    setShowResultsDropdown(false);
    setSearchQuery('');
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

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
    if (!isExpanded && inputRef.current) {
      inputRef.current.focus();
    }
  };

  const getSortLabel = (sortBy: string) => {
    switch(sortBy) {
      case 'recent': return isSmallScreen ? 'Recent' : 'Recent';
      case 'oldest': return isSmallScreen ? 'Oldest' : 'Oldest';
      case 'name': return isSmallScreen ? 'Name' : 'Name A-Z';
      default: return 'Sort';
    }
  };

  return (
    <div className="bg-linear-to-r from-amber-50 to-orange-50 border-b border-amber-200 shadow-sm sticky top-0 z-40">
      <div className={`max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 transition-all duration-300 ${
        isExpanded ? 'py-3 md:py-5' : 'py-2 md:py-4'
      }`}>
        
        {/* Compact Header */}
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          {/* Logo/Site Name */}
          <div className="shrink-0">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-linear-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white text-sm sm:text-lg font-bold">4R</span>
              </div>
              <div className="hidden sm:block">
                <span className="text-sm sm:text-lg font-bold text-gray-900 block">Memorial Garden</span>
                <span className="text-xs sm:text-sm text-gray-600">Honoring cherished memories</span>
              </div>
            </div>
          </div>

          {/* Search Bar - Responsive */}
          <div className="flex-1 max-w-2xl mx-2 sm:mx-4 relative">
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
                placeholder={isSmallScreen ? "Search memorials..." : "Search memorials by name, location, or story..."}
                className="block w-full pl-10 sm:pl-12 pr-24 sm:pr-28 py-2 sm:py-3 border-2 border-amber-300 
                         bg-white focus:outline-none focus:ring-2 sm:focus:ring-3 focus:ring-amber-400 
                         focus:border-transparent placeholder-gray-500 text-gray-900 
                         text-sm sm:text-base rounded-lg sm:rounded-xl shadow-sm transition-all duration-200"
              />
              
              {/* Search Actions */}
              <div className="absolute inset-y-0 right-0 flex items-center pr-1 sm:pr-1.5">
                {searchQuery && (
                  <button
                    onClick={clearSearch}
                    className="p-1.5 mr-1 sm:mr-2 text-gray-500 hover:text-gray-700 transition-colors"
                    aria-label="Clear search"
                  >
                    <X className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                )}
                <button
                  onClick={handleSearch}
                  disabled={isSearching || !searchQuery.trim()}
                  className="flex items-center gap-1 sm:gap-2 px-3 sm:px-5 py-1.5 sm:py-2 bg-amber-500 hover:bg-amber-600 
                           disabled:bg-amber-300 text-white text-sm sm:text-base font-semibold rounded-lg 
                           transition-colors disabled:cursor-not-allowed shadow hover:shadow-md sm:shadow-md sm:hover:shadow-lg"
                >
                  {isSearching ? (
                    <Loader className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" />
                  ) : (
                    isSmallScreen ? 'Go' : 'Search'
                  )}
                </button>
              </div>
            </div>

            {/* Search Results Dropdown - Responsive */}
            {showResults && showResultsDropdown && (
              <div 
                ref={resultsRef}
                className={`absolute top-full left-0 right-0 mt-2 bg-white border-2 border-amber-300 
                         rounded-xl shadow-2xl z-50 max-h-96 overflow-y-auto animate-fade-in
                         ${isSmallScreen ? 'fixed inset-x-0 top-16 mx-0 rounded-none border-x-0 max-h-[calc(100vh-64px)]' : ''}`}
              >
                {isSearching ? (
                  <div className="p-6 sm:p-8 text-center">
                    <Loader className="w-6 h-6 sm:w-8 sm:h-8 animate-spin mx-auto text-amber-500" />
                    <p className="text-sm sm:text-lg text-gray-700 mt-3 sm:mt-4 font-medium">Searching memorials...</p>
                  </div>
                ) : searchResults.length > 0 ? (
                  <>
                    <div className="p-3 sm:p-4 border-b border-amber-100 bg-amber-50">
                      <div className="flex items-center justify-between">
                        <p className="text-sm sm:text-lg font-bold text-gray-900 truncate">
                          {totalResults} memorial{totalResults !== 1 ? 's' : ''}
                          {searchQuery && !isSmallScreen && (
                            <span className="text-gray-700"> for "<span className="text-amber-800">{searchQuery}</span>"</span>
                          )}
                        </p>
                        <button
                          onClick={() => setShowResultsDropdown(false)}
                          className="p-1 sm:p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                          aria-label="Close results"
                        >
                          <X className="w-5 h-5 sm:w-6 sm:h-6" />
                        </button>
                      </div>
                      {searchQuery && isSmallScreen && (
                        <p className="text-xs text-gray-600 mt-1 truncate">
                          for "<span className="text-amber-800">{searchQuery}</span>"
                        </p>
                      )}
                    </div>
                    
                    <div className="p-2 sm:p-4 space-y-2 sm:space-y-4">
                      {searchResults.slice(0, isSmallScreen ? 4 : 8).map((memorial) => (
                        <div
                          key={memorial.id}
                          className="group p-3 sm:p-4 hover:bg-amber-50 rounded-lg sm:rounded-xl transition-all cursor-pointer border-2 border-gray-200 hover:border-amber-300 hover:shadow-md"
                          onClick={() => viewMemorialPage(memorial)}
                        >
                          <div className="flex items-start gap-2 sm:gap-4">
                            {/* Memorial Image */}
                            <div className="shrink-0">
                              {memorial.profileImage ? (
                                <img
                                  src={memorial.profileImage}
                                  alt={memorial.name}
                                  className="w-10 h-10 sm:w-14 sm:h-14 rounded-lg sm:rounded-xl object-cover border-2 border-amber-200"
                                  onError={(e) => {
                                    e.currentTarget.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 24 24" fill="%23f59e0b"><path d="M12 12q-1.65 0-2.825-1.175T8 8q0-1.65 1.175-2.825T12 4q1.65 0 2.825 1.175T16 8q0 1.65-1.175 2.825T12 12Zm-8 8v-2.8q0-.85.438-1.563T5.6 14.55q1.55-.775 3.15-1.163T12 13q1.65 0 3.25.388t3.15 1.162q.725.375 1.163 1.088T20 17.2V20H4Z"/></svg>';
                                  }}
                                />
                              ) : (
                                <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-lg sm:rounded-xl bg-linear-to-br from-amber-100 to-orange-100 flex items-center justify-center border-2 border-amber-200">
                                  <span className="text-xl sm:text-3xl">💐</span>
                                </div>
                              )}
                            </div>
                            
                            {/* Memorial Details */}
                            <div className="flex-1 min-w-0">
                              <h3 className="font-bold text-gray-900 text-sm sm:text-lg mb-1 sm:mb-2 group-hover:text-amber-800 transition-colors truncate">
                                {memorial.name}
                              </h3>
                              
                              <div className="flex flex-wrap items-center gap-1 sm:gap-2 mb-2 sm:mb-3">
                                {memorial.birthDate && (
                                  <span className="text-xs sm:text-sm text-gray-700 bg-gray-100 px-2 py-1 rounded-lg font-medium">
                                    Born: {formatDate(memorial.birthDate)}
                                  </span>
                                )}
                                
                                {memorial.deathDate && (
                                  <span className="text-xs sm:text-sm text-gray-700 bg-gray-100 px-2 py-1 rounded-lg font-medium">
                                    Passed: {formatDate(memorial.deathDate)}
                                  </span>
                                )}
                                
                                {memorial.location && (
                                  <span className="text-xs sm:text-sm text-gray-700 flex items-center gap-1.5 px-2 py-1 bg-gray-100 rounded-lg truncate max-w-[120px] sm:max-w-none">
                                    <span className="text-amber-600 text-xs">📍</span> 
                                    <span className="truncate">{memorial.location}</span>
                                  </span>
                                )}
                              </div>
                              
                              {memorial.obituary && (
                                <p className="text-xs sm:text-base text-gray-800 line-clamp-2 leading-relaxed">
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
                              className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2.5 bg-amber-500 text-white text-xs sm:text-base font-bold rounded-lg hover:bg-amber-600 transition-colors shadow-md hover:shadow-lg"
                            >
                              <Eye className="w-3 h-3 sm:w-5 sm:h-5" />
                              {isSmallScreen ? '' : 'View'}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {totalResults > (isSmallScreen ? 4 : 8) && (
                      <div className="p-3 sm:p-4 border-t border-amber-100 bg-gray-50">
                        <button
                          onClick={() => {
                            window.location.href = `/search?q=${encodeURIComponent(searchQuery)}&sort=${selectedSort}`;
                          }}
                          className="w-full text-center text-sm sm:text-lg text-amber-700 hover:text-amber-800 font-bold py-2 sm:py-3 hover:underline"
                        >
                          View all {totalResults} results →
                        </button>
                      </div>
                    )}
                  </>
                ) : searchQuery && searchAttempted ? (
                  <div className="p-4 sm:p-8 text-center">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 bg-amber-100 rounded-full flex items-center justify-center">
                      <Search className="w-6 h-6 sm:w-8 sm:h-8 text-amber-600" />
                    </div>
                    <p className="text-base sm:text-xl text-gray-900 font-bold mb-2">No memorials found</p>
                    <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
                      Try different keywords or check your spelling
                    </p>
                    <div className="text-sm sm:text-base text-gray-600 bg-amber-50 p-3 sm:p-5 rounded-lg sm:rounded-xl">
                      <p className="font-bold text-gray-900 mb-2 sm:mb-3">Search tips:</p>
                      <ul className="space-y-1 sm:space-y-2 text-left">
                        <li className="flex items-center gap-2">
                          <span className="text-amber-600 text-lg">•</span> Try first name only
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="text-amber-600 text-lg">•</span> Try last name only
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="text-amber-600 text-lg">•</span> Try location names
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="text-amber-600 text-lg">•</span> Use partial names
                        </li>
                      </ul>
                    </div>
                  </div>
                ) : null}
              </div>
            )}
          </div>

          {/* Filter & Expand Buttons - Responsive */}
          <div className="flex items-center gap-2">
            {/* Filter Dropdown */}
            <div className="relative">
              <button
                ref={filterButtonRef}
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-1 sm:gap-2 px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base text-gray-700 hover:text-gray-900 
                         hover:bg-amber-100 rounded-lg transition-all border-2 border-amber-300 bg-white"
              >
                <Filter className="w-3 h-3 sm:w-4 sm:h-4 text-amber-600" />
                <span className="font-medium">{getSortLabel(selectedSort)}</span>
                <ChevronDown className={`w-3 h-3 sm:w-4 sm:h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>
              
              {/* Filter Menu - Responsive */}
              {showFilters && (
                <div 
                  ref={filterDropdownRef}
                  className={`absolute right-0 mt-2 w-48 bg-white border-2 border-amber-300 
                            rounded-xl shadow-2xl z-50 py-2 animate-fade-in
                            ${isSmallScreen ? 'fixed inset-x-0 bottom-0 mx-0 rounded-none border-x-0 border-b-0 max-h-48' : ''}`}
                  style={isSmallScreen ? { top: 'auto', bottom: '64px' } : {}}
                >
                  <div className="px-2">
                    <button
                      onClick={() => handleSortChange('recent')}
                      className={`w-full text-left px-4 py-3 rounded-lg transition-colors text-sm sm:text-base ${
                        selectedSort === 'recent'
                          ? 'bg-amber-100 text-amber-900 font-semibold'
                          : 'hover:bg-amber-50 text-gray-800'
                      }`}
                    >
                      Most Recent
                    </button>
                    <button
                      onClick={() => handleSortChange('oldest')}
                      className={`w-full text-left px-4 py-3 rounded-lg transition-colors text-sm sm:text-base ${
                        selectedSort === 'oldest'
                          ? 'bg-amber-100 text-amber-900 font-semibold'
                          : 'hover:bg-amber-50 text-gray-800'
                      }`}
                    >
                      Oldest First
                    </button>
                    <button
                      onClick={() => handleSortChange('name')}
                      className={`w-full text-left px-4 py-3 rounded-lg transition-colors text-sm sm:text-base ${
                        selectedSort === 'name'
                          ? 'bg-amber-100 text-amber-900 font-semibold'
                          : 'hover:bg-amber-50 text-gray-800'
                      }`}
                    >
                      By Name (A-Z)
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Expand/Collapse Button - Hide on mobile when expanded */}
            {(!isSmallScreen || !isExpanded) && (
              <button
                onClick={toggleExpand}
                className="p-2 sm:p-3 text-gray-600 hover:text-gray-900 hover:bg-amber-100 rounded-lg transition-colors border-2 border-amber-300"
                aria-label={isExpanded ? "Collapse search" : "Expand search"}
              >
                {isExpanded ? (
                  <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5" />
                ) : (
                  <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5" />
                )}
              </button>
            )}
          </div>
        </div>

        {/* Expanded Section - Hidden on mobile */}
        {isExpanded && !isSmallScreen && (
          <div className="mt-4 sm:mt-5 pt-4 sm:pt-5 border-t border-amber-300 animate-slide-down">
            {/* Search Tips */}
            <div className="mb-4">
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-sm sm:text-base text-gray-700">
                <span className="font-bold text-gray-900">Search by:</span>
                <button
                  onClick={() => setSearchQuery('John')}
                  className="px-3 py-2 sm:px-4 sm:py-2 bg-amber-100 hover:bg-amber-200 rounded-lg text-gray-800 font-medium transition-colors"
                >
                  Name
                </button>
                <button
                  onClick={() => setSearchQuery('New York')}
                  className="px-3 py-2 sm:px-4 sm:py-2 bg-amber-100 hover:bg-amber-200 rounded-lg text-gray-800 font-medium transition-colors"
                >
                  Location
                </button>
                <button
                  onClick={() => setSearchQuery('2023')}
                  className="px-3 py-2 sm:px-4 sm:py-2 bg-amber-100 hover:bg-amber-200 rounded-lg text-gray-800 font-medium transition-colors"
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

            {/* Follow Us Section */}
            <div className="flex items-center justify-between bg-amber-100/50 p-3 sm:p-4 rounded-xl border border-amber-200">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1">Follow Us</h3>
                <p className="text-xs sm:text-sm text-gray-700">Stay connected with our memorial community</p>
              </div>
              <div className="flex items-center gap-1 sm:gap-2">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" 
                   className="p-2 sm:p-3 bg-white text-blue-600 hover:text-white hover:bg-blue-600 rounded-lg sm:rounded-xl transition-all shadow-sm hover:shadow-md">
                  <Facebook className="w-4 h-4 sm:w-5 sm:h-5" />
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" 
                   className="p-2 sm:p-3 bg-white text-blue-400 hover:text-white hover:bg-blue-400 rounded-lg sm:rounded-xl transition-all shadow-sm hover:shadow-md">
                  <Twitter className="w-4 h-4 sm:w-5 sm:h-5" />
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" 
                   className="p-2 sm:p-3 bg-white text-pink-600 hover:text-white hover:bg-pink-600 rounded-lg sm:rounded-xl transition-all shadow-sm hover:shadow-md">
                  <Instagram className="w-4 h-4 sm:w-5 sm:h-5" />
                </a>
                <a href="mailto:contact@4revah.com" 
                   className="p-2 sm:p-3 bg-white text-amber-600 hover:text-white hover:bg-amber-500 rounded-lg sm:rounded-xl transition-all shadow-sm hover:shadow-md">
                  <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
                </a>
              </div>
            </div>

            {/* Active Search Info */}
            {searchQuery && searchAttempted && (
              <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-amber-200">
                <div className="flex items-center justify-between text-sm sm:text-base text-gray-700">
                  <div>
                    <span className="font-bold text-gray-900">Searching:</span>
                    <span className="ml-2 text-amber-800 font-bold">"{searchQuery}"</span>
                    {isSearching ? (
                      <span className="ml-3 text-gray-600">
                        <Loader className="w-4 h-4 inline animate-spin mr-2" /> Searching...
                      </span>
                    ) : totalResults > 0 ? (
                      <span className="ml-3 text-gray-600">
                        • Found {totalResults} memorial{totalResults !== 1 ? 's' : ''}
                      </span>
                    ) : (
                      <span className="ml-3 text-gray-600">• No results</span>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}