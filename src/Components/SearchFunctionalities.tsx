import React, { useState, useEffect } from 'react';
import { Search, Filter, Facebook, Twitter, Instagram, Mail, Loader, Eye } from 'lucide-react';

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

  const BACKEND_URL = 'https://wings-of-memories-backend.onrender.com/api';

  // Fetch memorials from backend
  const fetchMemorials = async (query: string = '', sortBy: string = 'recent') => {
    if (!showResults) return;

    setIsSearching(true);
    try {
      const params = new URLSearchParams({
        ...(query && { search: query }),
        sortBy,
        limit: '8',
        offset: '0'
      });

      const response = await fetch(`${BACKEND_URL}/memorials/public?${params}`);
      
      if (response.ok) {
        const data: SearchResults = await response.json();
        setSearchResults(data.memorials);
        setTotalResults(data.pagination.total);
        
        if (onResults) {
          onResults(data.memorials);
        }
      } else {
        console.error('Failed to fetch memorials:', response.status);
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Error fetching memorials:', error);
      setSearchResults([]);
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
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, selectedSort, showResults]);

  const handleSearch = () => {
    if (onSearch) {
      onSearch(searchQuery);
    }
    fetchMemorials(searchQuery, selectedSort);
    setShowResultsDropdown(true);
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
    fetchMemorials(searchQuery, sortBy);
  };

  const handleInputFocus = () => {
    if (searchResults.length > 0 || searchQuery.length >= 2) {
      setShowResultsDropdown(true);
    }
  };

  const handleInputBlur = () => {
    setTimeout(() => setShowResultsDropdown(false), 200);
  };

  // Direct PDF Preview - opens your existing PDF viewer
const viewMemorialPage = (memorial: PublicMemorial) => {
  const memorialSlug = memorial.customUrl || memorial.id;
  // Direct to the public memorial page (not PDF-only)
  const memorialUrl = `/memorial/${memorialSlug}`;
  window.location.href = memorialUrl;
  setShowResultsDropdown(false);
  setSearchQuery('');
};

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setShowResultsDropdown(false);
    if (onSearch) {
      onSearch('');
    }
    if (onResults) {
      onResults([]);
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
    <div className="bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 border-b border-amber-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        
        {/* Explanatory Text */}
        <div className="mb-4 text-center">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-1">
            Explore Our Memorial Garden
          </h2>
          <p className="text-sm text-gray-600">
            Search and browse through cherished memories. Find memorials by name, location, or filter by date.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          
          {/* Search Bar */}
          <div className="flex-1 max-w-2xl mx-auto lg:mx-0 relative">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                placeholder="Search memorials by name, location, or story..."
                className="block w-full pl-12 pr-24 py-3 border border-amber-300 rounded-xl 
                         bg-white/80 backdrop-blur-sm
                         focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent
                         placeholder-gray-400 text-gray-900 shadow-sm
                         transition-all duration-200"
              />
              
              {/* Search Actions */}
              <div className="absolute inset-y-0 right-0 flex items-center pr-1">
                {searchQuery && (
                  <button
                    onClick={clearSearch}
                    className="p-1 mr-2 text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label="Clear search"
                  >
                    ×
                  </button>
                )}
                <button
                  onClick={handleSearch}
                  disabled={isSearching}
                  className="flex items-center gap-2 px-4 py-1.5 bg-amber-500 hover:bg-amber-600 disabled:bg-amber-400 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  {isSearching ? (
                    <Loader className="w-4 h-4 animate-spin" />
                  ) : (
                    'Search'
                  )}
                </button>
              </div>
            </div>

            {/* Search Results Dropdown */}
            {showResults && showResultsDropdown && (searchResults.length > 0 || isSearching) && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-amber-200 rounded-xl shadow-xl z-50 max-h-96 overflow-y-auto">
                {isSearching ? (
                  <div className="p-6 text-center">
                    <Loader className="w-6 h-6 animate-spin mx-auto text-amber-500" />
                    <p className="text-sm text-gray-600 mt-2">Searching memorials...</p>
                  </div>
                ) : (
                  <>
                    <div className="p-3 border-b border-amber-100 bg-amber-50">
                      <p className="text-sm font-medium text-amber-800">
                        Found {totalResults} memorial{totalResults !== 1 ? 's' : ''}
                        {searchQuery && ` for "${searchQuery}"`}
                      </p>
                    </div>
                    
                    <div className="p-2 space-y-2">
                      {searchResults.map((memorial) => (
                        <div
                          key={memorial.id}
                          className="group rounded-lg border border-transparent hover:border-amber-200 transition-colors"
                        >
                          <div className="p-3">
                            <div className="flex items-start gap-3">
                              {memorial.profileImage ? (
                                <img
                                  src={memorial.profileImage}
                                  alt={memorial.name}
                                  className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                                />
                              ) : (
                                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center flex-shrink-0">
                                  <span className="text-2xl">💐</span>
                                </div>
                              )}
                              
                              <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-gray-800 group-hover:text-amber-700 transition-colors">
                                  {memorial.name}
                                </h3>
                                
                                {(memorial.birthDate || memorial.deathDate) && (
                                  <p className="text-xs text-gray-600 mt-1">
                                    {memorial.birthDate && `Born: ${formatDate(memorial.birthDate)}`}
                                    {memorial.birthDate && memorial.deathDate && ' • '}
                                    {memorial.deathDate && `Passed: ${formatDate(memorial.deathDate)}`}
                                  </p>
                                )}
                                
                                {memorial.location && (
                                  <p className="text-xs text-gray-600 flex items-center gap-1 mt-1">
                                    📍 {memorial.location}
                                  </p>
                                )}
                                
                                {memorial.obituary && (
                                  <p className="text-sm text-gray-700 mt-2 line-clamp-2">
                                    {memorial.obituary}
                                  </p>
                                )}
                              </div>
                            </div>
                            
                            {/* Single Action Button - Opens PDF Preview */}
                            <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
                            <button
  onClick={() => viewMemorialPage(memorial)}
  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-amber-500 text-white text-sm font-medium rounded-lg hover:bg-amber-600 transition-colors"
>
  <Eye className="w-4 h-4" />
  View Memorial Page
</button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {totalResults > searchResults.length && (
                      <div className="p-3 border-t border-amber-100 bg-gray-50">
                        <button
                          onClick={() => {
                            window.location.href = `/search?q=${encodeURIComponent(searchQuery)}&sort=${selectedSort}`;
                          }}
                          className="w-full text-center text-sm text-amber-600 hover:text-amber-700 font-medium py-2"
                        >
                          View all {totalResults} results →
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {/* No Results Message */}
            {showResults && showResultsDropdown && !isSearching && searchResults.length === 0 && searchQuery && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-amber-200 rounded-xl shadow-xl z-50 p-6 text-center">
                <div className="w-12 h-12 mx-auto mb-3 bg-amber-100 rounded-full flex items-center justify-center">
                  <Search className="w-6 h-6 text-amber-600" />
                </div>
                <p className="text-gray-600 font-medium">No memorials found</p>
                <p className="text-sm text-gray-500 mt-1">
                  Try different keywords or browse all memorials
                </p>
              </div>
            )}
          </div>

          {/* Filters & Social Links */}
          <div className="flex items-center justify-center lg:justify-start gap-3 lg:gap-4">
            
            {/* Filter Button */}
            <div className="relative">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2.5 bg-white border border-amber-300 
                         rounded-lg hover:bg-amber-50 transition-all shadow-sm"
              >
                <Filter className="w-4 h-4 text-amber-600" />
                <span className="text-sm font-medium text-gray-700 hidden sm:inline">
                  Sort: {selectedSort === 'recent' ? 'Recent' : selectedSort === 'oldest' ? 'Oldest' : 'Name'}
                </span>
              </button>
              
              {/* Filter Dropdown */}
              {showFilters && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setShowFilters(false)}
                  />
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-amber-200 
                                rounded-lg shadow-lg z-50">
                    <div className="p-2">
                      <button
                        onClick={() => handleSortChange('recent')}
                        className={`w-full text-left px-4 py-2 rounded-md transition-colors ${
                          selectedSort === 'recent'
                            ? 'bg-amber-100 text-amber-800 font-medium'
                            : 'hover:bg-gray-50 text-gray-700'
                        }`}
                      >
                        Most Recent
                      </button>
                      <button
                        onClick={() => handleSortChange('oldest')}
                        className={`w-full text-left px-4 py-2 rounded-md transition-colors ${
                          selectedSort === 'oldest'
                            ? 'bg-amber-100 text-amber-800 font-medium'
                            : 'hover:bg-gray-50 text-gray-700'
                        }`}
                      >
                        Oldest First
                      </button>
                      <button
                        onClick={() => handleSortChange('name')}
                        className={`w-full text-left px-4 py-2 rounded-md transition-colors ${
                          selectedSort === 'name'
                            ? 'bg-amber-100 text-amber-800 font-medium'
                            : 'hover:bg-gray-50 text-gray-700'
                        }`}
                      >
                        By Name (A-Z)
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-2 pl-3 border-l border-amber-300">
              <span className="text-xs font-medium text-gray-600 hidden lg:inline">
                Follow us:
              </span>
              <div className="flex items-center gap-1">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 
                           rounded-full transition-all"
                  aria-label="Follow us on Facebook"
                >
                  <Facebook className="w-4 h-4" />
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-gray-600 hover:text-blue-400 hover:bg-blue-50 
                           rounded-full transition-all"
                  aria-label="Follow us on Twitter"
                >
                  <Twitter className="w-4 h-4" />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-gray-600 hover:text-pink-600 hover:bg-pink-50 
                           rounded-full transition-all"
                  aria-label="Follow us on Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
                <a
                  href="mailto:contact@4revah.com"
                  className="p-2 text-gray-600 hover:text-amber-600 hover:bg-amber-50 
                           rounded-full transition-all"
                  aria-label="Email us"
                >
                  <Mail className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Active Search Info */}
        {searchQuery && (
          <div className="mt-4 text-center text-sm text-gray-600">
            Searching for: <span className="font-semibold text-amber-700">"{searchQuery}"</span>
            {totalResults > 0 && (
              <span className="ml-2 text-gray-500">
                • {totalResults} result{totalResults !== 1 ? 's' : ''} found
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}