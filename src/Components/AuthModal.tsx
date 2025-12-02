import React, { useState } from 'react';
import { X, Eye, EyeOff } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'login' | 'register';
  onAuthSuccess?: () => void;
}

interface FormData {
  email: string;
  password: string;
  name: string;
}

export const AuthModal: React.FC<AuthModalProps> = ({ 
  isOpen, 
  onClose, 
  mode,
  onAuthSuccess 
}) => {
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    name: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [inputHistory, setInputHistory] = useState<Partial<FormData>[]>([]);

  const BACKEND_URL = 'https://wings-of-memories-backend.onrender.com/api';

  if (!isOpen) return null;

  // Track input changes for debugging/analytics
  const trackInputChange = (field: keyof FormData, value: string) => {
    setInputHistory(prev => [...prev, { [field]: value }]);
    
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Validate form data before submission
  const validateForm = (): boolean => {
    if (!formData.email || !formData.email.includes('@')) {
      setError('Please enter a valid email address');
      return false;
    }
    
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    
    if (mode === 'register' && formData.name.length < 2) {
      setError('Please enter your full name');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Log input tracking for debugging
    console.log('📊 Input history:', inputHistory);
    console.log('🔐 Final form data:', formData);

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      const endpoint = mode === 'login' ? '/auth/login' : '/auth/register';
      const url = `${BACKEND_URL}${endpoint}`;
      
      const requestBody = mode === 'login' 
        ? { email: formData.email, password: formData.password }
        : { name: formData.name, email: formData.email, password: formData.password };

      console.log(`🚀 Making ${mode} request to:`, url);
      console.log(`📦 Request body:`, requestBody);

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const responseData = await response.json();
      
      console.log(`📨 Response status: ${response.status}`, responseData);

      if (!response.ok) {
        throw new Error(responseData.message || responseData.error || `${mode} failed`);
      }

      // ✅ SUCCESS - User authenticated
      console.log('✅ Auth successful! Storing token and redirecting...');
      console.log('👤 User data:', responseData.user);
      console.log('🔑 Token received:', responseData.token ? 'Yes' : 'No');

      // Store authentication data
      localStorage.setItem('token', responseData.token);
      localStorage.setItem('user', JSON.stringify(responseData.user));
      
      // Track successful authentication
      console.log(`🎉 ${mode === 'login' ? 'Login' : 'Registration'} successful for:`, formData.email);

      // Reset form
      setFormData({ email: '', password: '', name: '' });
      setInputHistory([]);
      setError('');
      
      // Close modal first
      onClose();
      
      // Call success callback if provided
      if (onAuthSuccess) {
        onAuthSuccess();
      }
      
      // ✅ RELIABLE REDIRECT TO DASHBOARD
      console.log('🔄 Redirecting to /dashboard...');
      
      // Use setTimeout to ensure modal is closed before redirect
      setTimeout(() => {
        // Force navigation to dashboard
        window.location.href = '/dashboard';
        // Alternatively, you can use:
        // window.location.replace('/dashboard'); // This doesn't add to history
      }, 100);
      
    } catch (err) {
      console.error('❌ Auth error:', err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      
      // Track failed attempt
      console.log('❌ Failed auth attempt with data:', formData);
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleClose = () => {
    // Log form abandonment for analytics
    if (formData.email || formData.password || formData.name) {
      console.log('📝 Form abandoned with data:', formData);
    }
    
    setFormData({ email: '', password: '', name: '' });
    setInputHistory([]);
    setError('');
    setShowPassword(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-[60] flex items-center justify-center p-3 sm:p-4 animate-fade-in backdrop-blur-sm">
      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl max-w-md w-full p-4 sm:p-6 md:p-8 relative animate-slide-up mx-2">
        <button 
          onClick={handleClose} 
          className="absolute top-3 right-3 sm:top-4 sm:right-4 text-gray-400 hover:text-gray-600 transition-colors"
          disabled={loading}
        >
          <X className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
        
        <h2 className="text-2xl sm:text-3xl font-serif mb-4 sm:mb-6 text-gray-800">
          {mode === 'login' ? 'Welcome Back' : 'Create Account'}
        </h2>
        
        <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">
          {mode === 'login' 
            ? 'Sign in to access your memorial dashboard' 
            : 'Join to create beautiful memorials for your loved ones'
          }
        </p>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
            <strong className="block mb-1">Error:</strong>
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          {mode === 'register' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => trackInputChange('name', e.target.value)}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all text-sm sm:text-base"
                placeholder="John Doe"
                required
                disabled={loading}
                minLength={2}
              />
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => trackInputChange('email', e.target.value)}
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all text-sm sm:text-base"
              placeholder="you@example.com"
              required
              disabled={loading}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => trackInputChange('password', e.target.value)}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all text-sm sm:text-base pr-10"
                placeholder="••••••••"
                required
                disabled={loading}
                minLength={6}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                disabled={loading}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" />
                ) : (
                  <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                )}
              </button>
            </div>
            {mode === 'register' && (
              <p className="text-xs text-gray-500 mt-1">
                Password must be at least 6 characters long
              </p>
            )}
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-2.5 sm:py-3 rounded-lg sm:rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all transform hover:scale-105 font-medium shadow-lg text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                {mode === 'login' ? 'Signing In...' : 'Creating Account...'}
              </>
            ) : (
              mode === 'login' ? 'Sign In' : 'Create Account'
            )}
          </button>
        </form>

        <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200">
          <div className="text-center text-sm text-gray-600">
            {mode === 'login' ? (
              <p>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => window.location.reload()}
                  className="text-amber-600 hover:text-amber-700 font-medium underline"
                  disabled={loading}
                >
                  Register here
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => window.location.reload()}
                  className="text-amber-600 hover:text-amber-700 font-medium underline"
                  disabled={loading}
                >
                  Sign in here
                </button>
              </p>
            )}
          </div>
          
          <div className="mt-3 p-3 bg-amber-50 rounded-lg border border-amber-200">
            <p className="text-xs text-amber-700 text-center">
              <strong>After {mode === 'login' ? 'login' : 'registration'},</strong> you'll be redirected to your dashboard where you can create and manage memorials.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};