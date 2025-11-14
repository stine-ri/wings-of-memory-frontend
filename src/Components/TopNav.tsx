// TopNav.tsx - FIXED VERSION that accepts memorial props directly
import React, { useState, useEffect } from 'react';
import { Heart, Menu, X, LogIn, UserPlus, User, LogOut, ChevronDown, Plus } from 'lucide-react';

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

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'login' | 'register';
}

interface MemorialSelectorProps {
  memorials: Memorial[];
  currentMemorialId: string;
  onSelectMemorial: (id: string) => void;
  onCreateNew: () => void;
}

const MemorialSelector: React.FC<MemorialSelectorProps> = ({ 
  memorials, 
  currentMemorialId, 
  onSelectMemorial, 
  onCreateNew 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const currentMemorial = memorials.find(m => m.id === currentMemorialId);
  
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
                <button
                  key={memorial.id}
                  onClick={() => {
                    onSelectMemorial(memorial.id);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors text-sm ${
                    memorial.id === currentMemorialId
                      ? 'bg-amber-100 text-amber-800'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  <div className="font-medium">{memorial.name}</div>
                  <div className="text-xs text-gray-500">
                    Created: {new Date(memorial.createdAt).toLocaleDateString()}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, mode }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const BACKEND_URL = 'https://wings-of-memories-backend.onrender.com/api';

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const endpoint = mode === 'login' ? '/auth/login' : '/auth/register';
      const url = `${BACKEND_URL}${endpoint}`;
      
      const requestBody = mode === 'login' 
        ? { email, password }
        : { name, email, password };

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `${mode === 'login' ? 'Login' : 'Registration'} failed`);
      }

      const data = await response.json();
      
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      window.location.reload();
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-60 flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl max-w-md w-full p-4 sm:p-6 md:p-8 relative mx-2">
        <button 
          onClick={onClose} 
          className="absolute top-3 right-3 sm:top-4 sm:right-4 text-gray-400 hover:text-gray-600 transition-colors"
          disabled={loading}
        >
          <X className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
        
        <h2 className="text-2xl sm:text-3xl font-serif mb-4 sm:mb-6 text-gray-800">
          {mode === 'login' ? 'Welcome Back' : 'Create Account'}
        </h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
            {error}
          </div>
        )}
        
        <div className="space-y-3 sm:space-y-4">
          {mode === 'register' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all text-sm sm:text-base"
                placeholder="John Doe"
                disabled={loading}
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all text-sm sm:text-base"
              placeholder="you@example.com"
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all text-sm sm:text-base"
              placeholder="••••••••"
              disabled={loading}
            />
          </div>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-2.5 sm:py-3 rounded-lg sm:rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all transform hover:scale-105 font-medium shadow-lg text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Please wait...' : (mode === 'login' ? 'Sign In' : 'Create Account')}
          </button>
        </div>
      </div>
    </div>
  );
};

interface TopNavProps {
  memorials?: Memorial[];
  currentMemorialId?: string;
  onSelectMemorial?: (id: string) => void;
  onCreateNew?: () => void;
}

export default function TopNav({ 
  memorials = [],
  currentMemorialId = '',
  onSelectMemorial,
  onCreateNew
}: TopNavProps) {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        console.error('Error parsing user data');
      }
    }
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const openAuth = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setShowAuthModal(true);
    setMobileMenuOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('currentMemorialId');
    setUser(null);
    setShowUserMenu(false);
    setMobileMenuOpen(false);
    window.location.href = '/';
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <>
      <nav className={`sticky top-0 z-50 transition-all duration-500 ${
        scrolled 
          ? 'bg-white/95 backdrop-blur-xl shadow-xl border-b-2 border-amber-200/60' 
          : 'bg-gradient-to-r from-amber-50/90 via-white to-orange-50/90 shadow-md'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16 lg:h-17">
            
            {/* Logo Section */}
            <div className="flex items-center gap-2 sm:gap-3 group cursor-pointer select-none">
              <div className="relative flex items-center">
                <div className="absolute inset-0 bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500 blur-xl opacity-20 group-hover:opacity-40 transition-all duration-700 rounded-full scale-150"></div>
                
                <div className="relative p-1 sm:p-1.5">
                  <div className="relative">
                    <Heart className="w-7 h-7 sm:w-9 sm:h-9 lg:w-10 lg:h-10 text-amber-600 fill-amber-600 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 drop-shadow-lg filter" 
                      style={{ filter: 'drop-shadow(0 4px 12px rgba(217, 119, 6, 0.3))' }} 
                    />
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 opacity-0 group-hover:opacity-20 blur-sm transition-opacity duration-500"></div>
                  </div>
                  
                  <Heart className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 lg:w-4 lg:h-4 text-orange-500 fill-orange-500 absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300" />
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-0">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight leading-none">
                  <span className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 bg-clip-text text-transparent group-hover:from-amber-700 group-hover:via-orange-700 group-hover:to-amber-800 transition-all duration-500 drop-shadow-sm"
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
            </div>

            {/* Desktop Navigation & Auth */}
            <div className="hidden md:flex items-center gap-4 lg:gap-8">
              {/* Memorial Selector - Show when user is logged in and has memorials */}
              {user && memorials.length > 0 && onSelectMemorial && onCreateNew && (
                <MemorialSelector
                  memorials={memorials}
                  currentMemorialId={currentMemorialId}
                  onSelectMemorial={onSelectMemorial}
                  onCreateNew={onCreateNew}
                />
              )}

              <nav className="flex items-center gap-4 lg:gap-7">
                <a href="/about" className="relative text-sm lg:text-base text-gray-700 hover:text-amber-600 font-semibold transition-all duration-300 group whitespace-nowrap px-1 py-2">
                  <span className="relative z-10">About Us</span>
                  <span className="absolute bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-amber-500 to-orange-500 group-hover:w-full transition-all duration-400 rounded-full"></span>
                </a>
                <a href="/services" className="relative text-sm lg:text-base text-gray-700 hover:text-amber-600 font-semibold transition-all duration-300 group whitespace-nowrap px-1 py-2">
                  <span className="relative z-10">What We Offer</span>
                  <span className="absolute bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-amber-500 to-orange-500 group-hover:w-full transition-all duration-400 rounded-full"></span>
                </a>
                <a href="/contact" className="relative text-sm lg:text-base text-gray-700 hover:text-amber-600 font-semibold transition-all duration-300 group whitespace-nowrap px-1 py-2">
                  <span className="relative z-10">Contact Us</span>
                  <span className="absolute bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-amber-500 to-orange-500 group-hover:w-full transition-all duration-400 rounded-full"></span>
                </a>
              </nav>
              
              <div className="flex items-center gap-2 lg:gap-3 pl-4 lg:pl-6 border-l-2 border-amber-300/60">
                {user ? (
                  <div className="relative">
                    <button
                      onClick={() => setShowUserMenu(!showUserMenu)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-amber-50 transition-all"
                    >
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center text-white font-bold text-sm shadow-md">
                        {getInitials(user.name)}
                      </div>
                      <span className="text-sm font-semibold text-gray-700">{user.name}</span>
                    </button>
                    
                    {showUserMenu && (
                      <>
                        <div 
                          className="fixed inset-0 z-40" 
                          onClick={() => setShowUserMenu(false)}
                        />
                        <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-amber-100 py-2 z-50">
                          <div className="px-4 py-3 border-b border-gray-100">
                            <p className="text-sm font-semibold text-gray-800">{user.name}</p>
                            <p className="text-xs text-gray-500 mt-1">{user.email}</p>
                          </div>
                          <a href="/dashboard" className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-amber-50 transition-colors">
                            <User className="w-4 h-4" />
                            Dashboard
                          </a>
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
                  <>
                    <button
                      onClick={() => openAuth('login')}
                      className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-amber-600 transition-colors rounded-xl hover:bg-amber-50 text-sm lg:text-base"
                    >
                      <LogIn className="w-4 h-4 lg:w-5 lg:h-5" />
                      <span>Login</span>
                    </button>
                    <button
                      onClick={() => openAuth('register')}
                      className="flex items-center gap-2 px-4 lg:px-6 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full hover:from-amber-600 hover:to-orange-600 transition-all transform hover:scale-105 shadow-md text-sm lg:text-base"
                    >
                      <UserPlus className="w-4 h-4 lg:w-5 lg:h-5" />
                      <span>Register</span>
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden relative w-11 h-11 flex items-center justify-center text-gray-700 hover:text-amber-600 transition-all duration-300 rounded-xl hover:bg-gradient-to-br hover:from-amber-50 hover:to-orange-50 active:scale-95 shadow-sm hover:shadow-md"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 transition-all duration-300 rotate-90" />
              ) : (
                <Menu className="w-6 h-6 transition-all duration-300" />
              )}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden pb-5 border-t-2 border-amber-200/60 mt-1 bg-gradient-to-b from-amber-50/50 via-orange-50/30 to-transparent rounded-b-2xl backdrop-blur-sm">
              <div className="flex flex-col gap-1.5 pt-4 px-2">
                {/* Memorial Selector in Mobile Menu */}
                {user && memorials.length > 0 && onSelectMemorial && onCreateNew && (
                  <div className="px-2 mb-2">
                    <MemorialSelector
                      memorials={memorials}
                      currentMemorialId={currentMemorialId}
                      onSelectMemorial={onSelectMemorial}
                      onCreateNew={onCreateNew}
                    />
                  </div>
                )}

                {user && (
                  <div className="px-5 py-3 mb-2 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200/50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center text-white font-bold shadow-md">
                        {getInitials(user.name)}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-800">{user.name}</p>
                        <p className="text-xs text-gray-600">{user.email}</p>
                      </div>
                    </div>
                  </div>
                )}
                
                <a 
                  href="/about"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-5 py-3.5 text-gray-700 hover:text-amber-600 hover:bg-gradient-to-r hover:from-amber-50 hover:to-orange-50 rounded-xl font-semibold transition-all duration-300"
                >
                  About Us
                </a>
                <a 
                  href="/services"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-5 py-3.5 text-gray-700 hover:text-amber-600 hover:bg-gradient-to-r hover:from-amber-50 hover:to-orange-50 rounded-xl font-semibold transition-all duration-300"
                >
                  What We Offer
                </a>
                <a 
                  href="/contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-5 py-3.5 text-gray-700 hover:text-amber-600 hover:bg-gradient-to-r hover:from-amber-50 hover:to-orange-50 rounded-xl font-semibold transition-all duration-300"
                >
                  Contact Us
                </a>
                
                <div className="relative my-3">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t-2 border-amber-300/40"></div>
                  </div>
                  <div className="relative flex justify-center">
                    <span className="bg-gradient-to-r from-amber-50 via-white to-orange-50 px-3 text-xs text-gray-500 font-medium">
                      {user ? 'Account' : 'Get Started'}
                    </span>
                  </div>
                </div>
                
                {user ? (
                  <>
                    <a
                      href="/dashboard"
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-gray-700 hover:bg-amber-50 transition-colors rounded-lg text-sm sm:text-base"
                    >
                      <User className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span>Dashboard</span>
                    </a>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-red-600 hover:bg-red-50 transition-colors rounded-lg text-sm sm:text-base"
                    >
                      <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span>Logout</span>
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => openAuth('login')}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-gray-700 hover:bg-amber-50 transition-colors rounded-lg text-sm sm:text-base justify-center"
                    >
                      <LogIn className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span>Login</span>
                    </button>
                    <button
                      onClick={() => openAuth('register')}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-white bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 transition-all rounded-lg text-sm sm:text-base justify-center"
                    >
                      <UserPlus className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span>Register</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>
      
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
        mode={authMode} 
      />
    </>
  );
}

export { MemorialSelector };