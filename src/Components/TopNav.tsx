import React, { useState, useEffect, useRef } from 'react';
import { Heart, Menu, X, LogIn, UserPlus, Trash2, User, LogOut, ChevronDown, Plus, ChevronRight, Home } from 'lucide-react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

interface User {
  name: string;
  email: string;
}

interface Memorial {
  id: string;
  name: string;
  createdAt: string;
  isPublished: boolean;
}

interface MemorialSelectorProps {
  memorials: Memorial[];
  currentMemorialId: string;
  onSelectMemorial: (id: string) => void;
  onCreateNew: () => void;
  onDeleteMemorial?: (id: string) => Promise<void>; 
}

const MemorialSelector: React.FC<MemorialSelectorProps> = ({ 
  memorials, 
  currentMemorialId, 
  onSelectMemorial, 
  onCreateNew,
  onDeleteMemorial  
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null); 
  const currentMemorial = memorials.find(m => m.id === currentMemorialId);
  
  const handleDelete = async (memorialId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!onDeleteMemorial) return;
    
    const confirmDelete = window.confirm('Are you sure you want to delete this memorial? This action cannot be undone.');
    if (!confirmDelete) return;
    
    try {
      setDeletingId(memorialId);
      await onDeleteMemorial(memorialId);
      setIsOpen(false);
    } catch (error) {
      console.error('Error deleting memorial:', error);
      alert('Failed to delete memorial. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };
  
  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
      >
        <span className="font-medium text-sm">{currentMemorial?.name || 'Select Memorial'}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-gray-300 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
            <div className="p-2">
              <button
                onClick={() => {
                  onCreateNew();
                  setIsOpen(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-amber-50 rounded-lg transition-colors text-amber-600 font-medium text-sm"
              >
                <Plus className="w-4 h-4" />
                Create New Memorial
              </button>
            </div>
            
            <div className="border-t border-gray-200" />
            
            <div className="p-2">
              {memorials.map((memorial) => (
                <div
                  key={memorial.id}
                  className="group relative px-3 py-2 rounded-lg transition-colors hover:bg-gray-50 flex items-center justify-between"
                >
                  <button
                    onClick={() => {
                      onSelectMemorial(memorial.id);
                      setIsOpen(false);
                    }}
                    className="flex-1 text-left pr-2"
                  >
                    <div className={`font-medium text-sm ${
                      memorial.id === currentMemorialId ? 'text-amber-800' : 'text-gray-700'
                    }`}>
                      {memorial.name}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Created: {new Date(memorial.createdAt).toLocaleDateString()}
                    </div>
                  </button>
                  
                  {onDeleteMemorial && (
  <button
    onClick={(e) => handleDelete(memorial.id, e)}
    disabled={deletingId === memorial.id}
    className="p-1.5 text-gray-400 hover:text-red-600 transition-colors disabled:opacity-50 ml-2"
    title="Delete memorial"
  >
    {deletingId === memorial.id ? (
      <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
    ) : (
      <Trash2 className="w-4 h-4" />
    )}
  </button>
)}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

interface TopNavProps {
  memorials?: Memorial[];
  currentMemorialId?: string;
  onSelectMemorial?: (id: string) => void;
  onCreateNew?: () => void;
  onDeleteMemorial?: (id: string) => Promise<void>;
  onOpenSection?: (sectionId: string) => void;
  onSectionHover?: (sectionId: string) => void;
}

// Memorial Guide Item Component - moved outside of the main function
const MemorialGuideItem: React.FC<{
  item: { id: string; label: string; sectionId: string };
  onClick: (sectionId: string) => void;
  onHover?: (sectionId: string) => void;
}> = ({ item, onClick, onHover }) => {
  const [isPreloading, setIsPreloading] = useState(false);

  const handleMouseEnter = () => {
    if (onHover) {
      setIsPreloading(true);
      onHover(item.sectionId);
      setTimeout(() => setIsPreloading(false), 300);
    }
  };

  return (
    <button
      onMouseEnter={handleMouseEnter}
      onClick={() => onClick(item.sectionId)}
      className="w-full flex items-center justify-between px-4 py-3 text-sm text-gray-700 hover:bg-amber-50 transition-colors group text-left relative"
    >
      <span>{item.label}</span>
      <div className="flex items-center gap-2">
        {isPreloading && (
          <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
        )}
        <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-amber-600 transition-colors" />
      </div>
    </button>
  );
};

export default function TopNav({ 
  memorials = [],
  currentMemorialId = '',
  onSelectMemorial,
  onCreateNew,
  onDeleteMemorial,
  onOpenSection,
  onSectionHover
}: TopNavProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showAboutMenu, setShowAboutMenu] = useState(false);
  const [showServicesMenu, setShowServicesMenu] = useState(false);
  const [showMemorialGuideMenu, setShowMemorialGuideMenu] = useState(false);
  const [showAuthDropdown, setShowAuthDropdown] = useState(false);

  const navigate = useNavigate();
  const aboutMenuTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const servicesMenuTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const memorialGuideTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const authDropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Navigation items
  const aboutSubItems = [
    { id: 'about-4revah', label: 'About 4revah', href: '/about#about-4revah' },
    { id: 'mission', label: 'Our Mission', href: '/about#mission' },
    { id: 'values', label: 'Our Values', href: '/about#values' },
    { id: 'features', label: 'What We Offer', href: '/about#features' },
    { id: 'journey', label: 'Our Journey', href: '/about#journey' }
  ];

  const servicesSubItems = [
    { id: 'how-it-works', label: 'How It Works', href: '/services#how-it-works' },
    { id: 'services', label: 'Our Services', href: '/services#services' },
    { id: 'pricing', label: 'Simple & Free', href: '/services#pricing' }
  ];

  // Memorial Guide submenus - these will OPEN components directly
  const memorialGuideSubItems = [
    { id: 'life-story', label: 'Obituary', sectionId: 'life-story' },
    { id: 'favorites', label: 'Favorite', sectionId: 'favorites' },
    { id: 'timeline', label: 'Timeline', sectionId: 'timeline' },
    { id: 'gallery', label: 'Gallery', sectionId: 'gallery' },
    { id: 'memory-wall', label: 'Memory Wall', sectionId: 'memory-wall' },
    { id: 'family-tree', label: 'Family Tree', sectionId: 'family-tree' },
    { id: 'services-guide', label: 'Services', sectionId: 'services' }
  ];

  // Cleanup timeouts
  useEffect(() => {
    return () => {
      if (aboutMenuTimeoutRef.current) clearTimeout(aboutMenuTimeoutRef.current);
      if (servicesMenuTimeoutRef.current) clearTimeout(servicesMenuTimeoutRef.current);
      if (memorialGuideTimeoutRef.current) clearTimeout(memorialGuideTimeoutRef.current);
      if (authDropdownTimeoutRef.current) clearTimeout(authDropdownTimeoutRef.current);
    };
  }, []);

  // Clear old auth data on component mount
  useEffect(() => {
    const cleanupOldAuthData = () => {
      const userData = localStorage.getItem('user');
      if (userData) {
        try {
          const parsed = JSON.parse(userData);
          if (!parsed.name || !parsed.email) {
            console.log('🔄 Cleaning up invalid user data');
            localStorage.removeItem('user');
            localStorage.removeItem('token');
          }
        } catch (err) {
          console.log('🔄 Cleaning up corrupted user data', err);
          localStorage.removeItem('user');
          localStorage.removeItem('token');
        }
      }
    };

    cleanupOldAuthData();
    updateUserState();
  }, []);

  // Update user state from localStorage
  const updateUserState = () => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        if (userData && userData.name && userData.email) {
          setUser(userData);
        } else {
          localStorage.removeItem('user');
          localStorage.removeItem('token');
          setUser(null);
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setUser(null);
      }
    } else {
      setUser(null);
    }
  };

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle storage changes
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'user' || e.key === 'token') {
        updateUserState();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('currentMemorialId');
    sessionStorage.clear();
    
    setUser(null);
    setShowUserMenu(false);
    setMobileMenuOpen(false);
    setShowAuthDropdown(false);
    
    navigate('/');
  };

  const getInitials = (name: string | undefined | null): string => {
    if (!name || typeof name !== 'string') {
      return 'U';
    }
    
    const trimmedName = name.trim();
    if (trimmedName.length === 0) {
      return 'U';
    }
    
    try {
      return trimmedName
        .split(' ')
        .filter(part => part.length > 0)
        .map(part => part[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    } catch (error) {
      console.error('Error generating initials:', error);
      return 'U';
    }
  };

  // Navigation handlers
  const handleLogoClick = () => {
    navigate('/');
  };

  // Menu handlers
  const handleAboutMenuEnter = () => {
    if (aboutMenuTimeoutRef.current) clearTimeout(aboutMenuTimeoutRef.current);
    setShowAboutMenu(true);
  };

  const handleAboutMenuLeave = () => {
    aboutMenuTimeoutRef.current = setTimeout(() => {
      setShowAboutMenu(false);
    }, 500);
  };

  const handleServicesMenuEnter = () => {
    if (servicesMenuTimeoutRef.current) clearTimeout(servicesMenuTimeoutRef.current);
    setShowServicesMenu(true);
  };

  const handleServicesMenuLeave = () => {
    servicesMenuTimeoutRef.current = setTimeout(() => {
      setShowServicesMenu(false);
    }, 500);
  };

  const handleMemorialGuideMenuEnter = () => {
    if (memorialGuideTimeoutRef.current) clearTimeout(memorialGuideTimeoutRef.current);
    setShowMemorialGuideMenu(true);
  };

  const handleMemorialGuideMenuLeave = () => {
    memorialGuideTimeoutRef.current = setTimeout(() => {
      setShowMemorialGuideMenu(false);
    }, 500);
  };

  const handleAuthDropdownEnter = () => {
    if (authDropdownTimeoutRef.current) clearTimeout(authDropdownTimeoutRef.current);
    setShowAuthDropdown(true);
  };

  const handleAuthDropdownLeave = () => {
    authDropdownTimeoutRef.current = setTimeout(() => {
      setShowAuthDropdown(false);
    }, 500);
  };

  // Handle Memorial Guide navigation - OPENS DIRECTLY
  const handleMemorialGuideNavigation = (sectionId: string) => {
    // Store in localStorage for Home component to read
    localStorage.setItem('memorialGuideSection', sectionId);
    
    // If we're already on home page
    if (window.location.pathname === '/') {
      // Open the section directly
      if (onOpenSection) {
        onOpenSection(sectionId);
      }
      
      // Also dispatch event for Home component
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'memorialGuideSection',
        newValue: sectionId
      }));
    } else {
      // Navigate to home page first
      navigate('/');
      
      // The Home component will handle opening when it mounts
      setTimeout(() => {
        if (onOpenSection) {
          onOpenSection(sectionId);
        }
      }, 100);
    }
    
    // Close menus
    setShowMemorialGuideMenu(false);
    setMobileMenuOpen(false);
  };

  // Handle section navigation for other sections (About Us, What We Offer)
  const handleSectionNavigation = (href: string) => {
    if (href.includes('#')) {
      const [path, hash] = href.split('#');
      if (window.location.pathname === path || (window.location.pathname === '/' && path === '')) {
        setTimeout(() => {
          const element = document.getElementById(hash);
          if (element) {
            const navHeight = 100;
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.scrollY - navHeight;
            
            window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth'
            });
          }
        }, 100);
      } else {
        sessionStorage.setItem('targetScrollSection', hash);
        navigate(path || '/');
      }
    } else {
      navigate(href);
    }
    
    setShowAboutMenu(false);
    setShowServicesMenu(false);
    setMobileMenuOpen(false);
  };

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-white/95 backdrop-blur-xl shadow-xl border-b-2 border-amber-200/60' 
        : 'bg-linear-to-r from-amber-50/90 via-white to-orange-50/90 shadow-md'
    }`}>
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        {/* Enhanced Mobile Header with Better Spacing */}
        <div className="flex justify-between items-center h-14 sm:h-16 lg:h-17">
          
          {/* Logo Section - Improved for Mobile */}
          <button 
            onClick={handleLogoClick}
            className="flex items-center gap-1.5 sm:gap-3 group cursor-pointer select-none focus:outline-none flex-shrink-0"
          >
            <div className="relative flex items-center">
              <div className="absolute inset-0 bg-linear-to-r from-amber-400 via-orange-500 to-amber-500 blur-xl opacity-20 group-hover:opacity-40 transition-all duration-500 rounded-full scale-150"></div>
              
              <div className="relative p-1 sm:p-1.5">
                <div className="relative">
                  <Heart className="w-6 h-6 sm:w-9 sm:h-9 lg:w-10 lg:h-10 text-amber-600 fill-amber-600 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 drop-shadow-lg filter" 
                    style={{ filter: 'drop-shadow(0 4px 12px rgba(217, 119, 6, 0.3))' }} 
                  />
                  <div className="absolute inset-0 rounded-full bg-linear-to-br from-amber-400 to-orange-500 opacity-0 group-hover:opacity-20 blur-sm transition-opacity duration-500"></div>
                </div>
                
                <Heart className="w-2 h-2 sm:w-3.5 sm:h-3.5 lg:w-4 lg:h-4 text-orange-500 fill-orange-500 absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300" />
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-0">
              <h1 className="text-xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight leading-none">
                <span className="bg-linear-to-r from-amber-600 via-orange-600 to-amber-700 bg-clip-text text-transparent group-hover:from-amber-700 group-hover:via-orange-700 group-hover:to-amber-800 transition-all duration-500 drop-shadow-sm"
                  style={{ 
                    textShadow: '0 2px 8px rgba(217, 119, 6, 0.15)',
                    fontFamily: 'system-ui, -apple-system, sans-serif',
                    letterSpacing: '-0.02em'
                  }}>
                  4revah
                </span>
              </h1>
              
              <span className="hidden md:block lg:ml-3 md:ml-2 text-[10px] md:text-xs text-gray-600 font-semibold md:border-l-2 border-amber-400/50 md:pl-2 lg:pl-3 leading-tight uppercase tracking-wider">
                Forever in Memory
              </span>
            </div>
          </button>

          {/* Desktop Navigation - Hidden on Mobile */}
          <div className="hidden md:flex items-center gap-3 lg:gap-6 flex-1 justify-end">
            {/* Home Link */}
            <RouterLink
              to="/"
              className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:text-amber-600 hover:bg-amber-50 rounded-xl transition-all duration-300 font-semibold text-sm lg:text-base"
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </RouterLink>

            {/* Memorial Selector - Improved spacing */}
            {user && memorials.length > 0 && onSelectMemorial && onCreateNew && (
              <div className="flex-shrink-0">
                <MemorialSelector
                  memorials={memorials}
                  currentMemorialId={currentMemorialId}
                  onSelectMemorial={onSelectMemorial}
                  onCreateNew={onCreateNew}
                  onDeleteMemorial={onDeleteMemorial}  
                />
              </div>
            )}

            {/* Memorial Guide Dropdown */}
            <div className="relative">
              <button
                onMouseEnter={handleMemorialGuideMenuEnter}
                onMouseLeave={handleMemorialGuideMenuLeave}
                className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:text-amber-600 hover:bg-amber-50 rounded-xl transition-all duration-300 font-semibold text-sm lg:text-base"
              >
                <span>Memorial Guide</span>
                <ChevronDown className={`w-3 h-3 lg:w-4 lg:h-4 transition-transform duration-300 ${showMemorialGuideMenu ? 'rotate-180' : ''}`} />
              </button>
              
              {showMemorialGuideMenu && (
                <div 
                  className="absolute left-0 mt-2 w-56 lg:w-64 bg-white rounded-xl shadow-xl border border-amber-100 py-2 z-50 animate-slide-down"
                  onMouseEnter={handleMemorialGuideMenuEnter}
                  onMouseLeave={handleMemorialGuideMenuLeave}
                >
                  <div className="px-4 py-3 border-b border-gray-100">
                    <h3 className="font-semibold text-gray-800 text-sm lg:text-base">Memorial Features</h3>
                    <p className="text-xs text-gray-500 mt-1">Click to preview any section</p>
                  </div>
                  {memorialGuideSubItems.map((item) => (
                    <MemorialGuideItem
                      key={item.id}
                      item={item}
                      onClick={handleMemorialGuideNavigation}
                      onHover={onSectionHover}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* About Us Dropdown */}
            <div className="relative">
              <button
                onMouseEnter={handleAboutMenuEnter}
                onMouseLeave={handleAboutMenuLeave}
                onClick={() => navigate('/about')}
                className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:text-amber-600 hover:bg-amber-50 rounded-xl transition-all duration-300 font-semibold text-sm lg:text-base"
              >
                <span>About Us</span>
                <ChevronDown className={`w-3 h-3 lg:w-4 lg:h-4 transition-transform duration-300 ${showAboutMenu ? 'rotate-180' : ''}`} />
              </button>
              
              {showAboutMenu && (
                <div 
                  className="absolute left-0 mt-2 w-56 lg:w-64 bg-white rounded-xl shadow-xl border border-amber-100 py-2 z-50 animate-slide-down"
                  onMouseEnter={handleAboutMenuEnter}
                  onMouseLeave={handleAboutMenuLeave}
                >
                  <div className="px-4 py-3 border-b border-gray-100">
                    <h3 className="font-semibold text-gray-800 text-sm lg:text-base">About 4revah</h3>
                    <p className="text-xs text-gray-500 mt-1">Our mission and values</p>
                  </div>
                  {aboutSubItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleSectionNavigation(item.href)}
                      className="w-full flex items-center justify-between px-4 py-3 text-sm text-gray-700 hover:bg-amber-50 transition-colors group text-left"
                    >
                      <span>{item.label}</span>
                      <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-amber-600 transition-colors" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* What We Offer Dropdown */}
            <div className="relative">
              <button
                onMouseEnter={handleServicesMenuEnter}
                onMouseLeave={handleServicesMenuLeave}
                onClick={() => navigate('/services')}
                className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:text-amber-600 hover:bg-amber-50 rounded-xl transition-all duration-300 font-semibold text-sm lg:text-base"
              >
                <span>What We Offer</span>
                <ChevronDown className={`w-3 h-3 lg:w-4 lg:h-4 transition-transform duration-300 ${showServicesMenu ? 'rotate-180' : ''}`} />
              </button>
              
              {showServicesMenu && (
                <div 
                  className="absolute left-0 mt-2 w-56 lg:w-64 bg-white rounded-xl shadow-xl border border-amber-100 py-2 z-50 animate-slide-down"
                  onMouseEnter={handleServicesMenuEnter}
                  onMouseLeave={handleServicesMenuLeave}
                >
                  <div className="px-4 py-3 border-b border-gray-100">
                    <h3 className="font-semibold text-gray-800 text-sm lg:text-base">Our Services</h3>
                    <p className="text-xs text-gray-500 mt-1">Features and tools</p>
                  </div>
                  {servicesSubItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleSectionNavigation(item.href)}
                      className="w-full flex items-center justify-between px-4 py-3 text-sm text-gray-700 hover:bg-amber-50 transition-colors group text-left"
                    >
                      <span>{item.label}</span>
                      <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-amber-600 transition-colors" />
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            {/* Auth Section */}
            <div className="flex items-center gap-2 lg:gap-3 pl-4 lg:pl-6 border-l-2 border-amber-300/60">
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-amber-50 transition-all"
                  >
                    <div className="w-8 h-8 rounded-full bg-linear-to-r from-amber-500 to-orange-500 flex items-center justify-center text-white font-bold text-sm shadow-md">
                      {getInitials(user?.name)}
                    </div>
                    <span className="text-sm font-semibold text-gray-700 hidden lg:inline">
                      {user?.name || 'User'}
                    </span>
                  </button>
                  
                  {showUserMenu && (
                    <>
                      <div 
                        className="fixed inset-0 z-40" 
                        onClick={() => setShowUserMenu(false)}
                      />
                      <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-amber-100 py-2 z-50">
                        <div className="px-4 py-3 border-b border-gray-100">
                          <p className="text-sm font-semibold text-gray-800">{user?.name || 'User'}</p>
                          <p className="text-xs text-gray-500 mt-1">{user?.email || ''}</p>
                        </div>
                        <RouterLink 
                          to="/dashboard" 
                          className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-amber-50 transition-colors"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <User className="w-4 h-4" />
                          Dashboard
                        </RouterLink>
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          Logout
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div className="relative">
                  <button
                    onMouseEnter={handleAuthDropdownEnter}
                    onMouseLeave={handleAuthDropdownLeave}
                    className="flex items-center gap-2 px-4 py-2 bg-linear-to-r from-amber-500 to-orange-500 text-white rounded-full hover:from-amber-600 hover:to-orange-600 transition-all transform hover:scale-105 shadow-md text-sm"
                  >
                    <Plus className="w-4 h-4" />
                    <span className="hidden sm:inline">Create Memorial</span>
                    <span className="sm:hidden">Create</span>
                  </button>
                  
                  {showAuthDropdown && (
                    <div 
                      className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-amber-100 py-2 z-50"
                      onMouseEnter={handleAuthDropdownEnter}
                      onMouseLeave={handleAuthDropdownLeave}
                    >
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-xs text-gray-500">Sign in to create a memorial</p>
                      </div>
                      <RouterLink 
                        to="/login"
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-amber-50 transition-colors"
                        onClick={() => setShowAuthDropdown(false)}
                      >
                        <LogIn className="w-4 h-4" />
                        <span>Login</span>
                      </RouterLink>
                      <RouterLink 
                        to="/register"
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-amber-600 hover:bg-amber-50 transition-colors"
                        onClick={() => setShowAuthDropdown(false)}
                      >
                        <UserPlus className="w-4 h-4" />
                        <span>Register</span>
                      </RouterLink>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Enhanced Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden relative w-10 h-10 flex items-center justify-center text-gray-700 hover:text-amber-600 transition-all duration-300 rounded-xl hover:bg-linear-to-br hover:from-amber-50 hover:to-orange-50 active:scale-95 shadow-sm hover:shadow-md"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5 transition-all duration-300 rotate-90" />
            ) : (
              <Menu className="w-5 h-5 transition-all duration-300" />
            )}
          </button>
        </div>

        {/* Enhanced Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-5 border-t-2 border-amber-200/60 mt-1 bg-linear-to-b from-amber-50/50 via-orange-50/30 to-transparent rounded-b-2xl backdrop-blur-sm">
            <div className="flex flex-col gap-1.5 pt-4 px-2">
              {/* Home Link in Mobile */}
              <RouterLink
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center gap-2 px-4 py-3 text-gray-700 hover:bg-amber-50 rounded-xl transition-all duration-300 group mb-2"
              >
                <Home className="w-5 h-5" />
                <span className="font-semibold text-lg">Home</span>
              </RouterLink>

              {/* Memorial Selector with better spacing */}
              {user && memorials.length > 0 && onSelectMemorial && onCreateNew && (
                <div className="px-2 mb-2">
                  <MemorialSelector
                    memorials={memorials}
                    currentMemorialId={currentMemorialId}
                    onSelectMemorial={onSelectMemorial}
                    onCreateNew={onCreateNew}
                    onDeleteMemorial={onDeleteMemorial} 
                  />
                </div>
              )}

              {/* User Info Card - More compact */}
              {user && (
                <div className="px-3 py-2 mb-2 bg-linear-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200/50">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-linear-to-r from-amber-500 to-orange-500 flex items-center justify-center text-white font-bold text-xs shadow-md">
                      {getInitials(user?.name)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-800 truncate">{user?.name || 'User'}</p>
                      <p className="text-xs text-gray-600 truncate">{user?.email || ''}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Memorial Guide in Mobile - Improved layout */}
              <div className="mb-2">
                <button
                  onClick={() => setShowMemorialGuideMenu(!showMemorialGuideMenu)}
                  className="w-full flex items-center justify-between px-4 py-3 text-gray-700 hover:bg-amber-50 rounded-xl transition-all duration-300 group"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-base">Memorial Guide</span>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-gray-400 group-hover:text-amber-600 transition-colors ${showMemorialGuideMenu ? 'rotate-180' : ''}`} />
                </button>
                {showMemorialGuideMenu && (
                  <div className="mt-1 space-y-1 pl-2 border-l-2 border-amber-200 ml-2">
                    {memorialGuideSubItems.map((item) => (
                      <MemorialGuideItem
                        key={item.id}
                        item={item}
                        onClick={handleMemorialGuideNavigation}
                        onHover={onSectionHover}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* About Us in Mobile - More compact */}
              <div className="mb-2">
                <RouterLink 
                  to="/about"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-between px-4 py-3 text-gray-700 hover:bg-amber-50 rounded-xl transition-all duration-300 group"
                >
                  <span className="font-semibold text-base">About Us</span>
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-amber-600 transition-colors" />
                </RouterLink>
                <div className="mt-1 space-y-1 pl-2 border-l-2 border-amber-200 ml-2">
                  {aboutSubItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleSectionNavigation(item.href)}
                      className="w-full flex items-center justify-between px-3 py-2 text-gray-700 hover:bg-amber-50 rounded-lg transition-all duration-300 group text-left"
                    >
                      <span className="text-sm">{item.label}</span>
                      <ChevronRight className="w-3 h-3 text-gray-400 group-hover:text-amber-600 transition-colors" />
                    </button>
                  ))}
                </div>
              </div>

              {/* What We Offer in Mobile - More compact */}
              <div className="mb-2">
                <RouterLink 
                  to="/services"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-between px-4 py-3 text-gray-700 hover:bg-amber-50 rounded-xl transition-all duration-300 group"
                >
                  <span className="font-semibold text-base">What We Offer</span>
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-amber-600 transition-colors" />
                </RouterLink>
                <div className="mt-1 space-y-1 pl-2 border-l-2 border-amber-200 ml-2">
                  {servicesSubItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleSectionNavigation(item.href)}
                      className="w-full flex items-center justify-between px-3 py-2 text-gray-700 hover:bg-amber-50 rounded-lg transition-all duration-300 group text-left"
                    >
                      <span className="text-sm">{item.label}</span>
                      <ChevronRight className="w-3 h-3 text-gray-400 group-hover:text-amber-600 transition-colors" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Divider */}
              <div className="relative my-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-amber-300/40"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-linear-to-r from-amber-50 via-white to-orange-50 px-3 text-xs text-gray-500 font-medium">
                    {user ? 'Account' : 'Create Memorial'}
                  </span>
                </div>
              </div>
              
              {/* Account Actions - Better spacing */}
              {user ? (
                <>
                  <RouterLink
                    to="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-gray-700 hover:bg-amber-50 transition-colors rounded-lg text-sm"
                  >
                    <User className="w-4 h-4" />
                    <span>Dashboard</span>
                  </RouterLink>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-red-600 hover:bg-red-50 transition-colors rounded-lg text-sm"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <>
                  {/* Simplified Auth on Mobile - No dropdown */}
                  <RouterLink 
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-gray-700 hover:bg-amber-50 transition-colors rounded-lg text-sm"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Login</span>
                  </RouterLink>
                  <RouterLink 
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-linear-to-r from-amber-500 to-orange-500 text-white rounded-lg hover:from-amber-600 hover:to-orange-600 transition-all text-sm"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Create Memorial</span>
                  </RouterLink>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export { MemorialSelector };