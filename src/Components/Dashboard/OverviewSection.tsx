import React from 'react';
import { Heart, Users, Images, Clock, FileText, MapPin, Calendar } from 'lucide-react';
import { useMemorial } from '../../hooks/useMemorial';

export const OverviewSection: React.FC = () => {
  const { memorialData, loading } = useMemorial();
  
  // Get user data from localStorage
  const userData = localStorage.getItem('user');
  const user = userData ? JSON.parse(userData) : null;
  const userName = user?.name || 'there';

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-br from-amber-100 to-amber-50 rounded-2xl p-8 border border-amber-200 animate-pulse">
          <div className="h-8 bg-amber-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-amber-200 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  if (!memorialData) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-8">
          <p className="text-red-600">Unable to load memorial data</p>
        </div>
      </div>
    );
  }

  // Calculate completion based on actual data
  const memorialStats = {
    familyTree: memorialData.familyTree?.length || 0,
    timeline: memorialData.timeline?.length || 0,
    favorites: memorialData.favorites?.length || 0,
    gallery: memorialData.gallery?.length || 0,
    memoryWall: memorialData.memoryWall?.length || 0,
    obituary: memorialData.obituary?.length || 0,
    service: memorialData.service?.venue?.length || 0
  };

  const completionSteps = [
    { 
      icon: FileText, 
      label: 'Obituary', 
      description: 'Write a beautiful tribute and life story',
      completed: memorialStats.obituary > 0,
      count: memorialStats.obituary > 0 ? '✓' : '0'
    },
    { 
      icon: Users, 
      label: 'Family Tree', 
      description: 'Add family members and relationships',
      completed: memorialStats.familyTree > 0,
      count: memorialStats.familyTree
    },
    { 
      icon: Clock, 
      label: 'Timeline', 
      description: 'Create a life timeline with key events',
      completed: memorialStats.timeline > 0,
      count: memorialStats.timeline
    },
    { 
      icon: Heart, 
      label: 'Favorites', 
      description: 'Share their favorite things and memories',
      completed: memorialStats.favorites > 0,
      count: memorialStats.favorites
    },
    { 
      icon: Images, 
      label: 'Gallery', 
      description: 'Upload photos and create albums',
      completed: memorialStats.gallery > 0,
      count: memorialStats.gallery
    },
    { 
      icon: MapPin, 
      label: 'Service Info', 
      description: 'Add funeral or memorial service details',
      completed: memorialStats.service > 0,
      count: memorialStats.service > 0 ? '✓' : '0'
    },
  ];

  // Calculate overall progress
  const completedSteps = completionSteps.filter(step => step.completed).length;
  const totalSteps = completionSteps.length;
  const progressPercentage = Math.round((completedSteps / totalSteps) * 100);

  // Format dates for display
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

  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8">
      {/* Welcome Section with Memorial Info */}
      <div className="bg-gradient-to-br from-amber-100 to-amber-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 border border-amber-200">
        <div className="max-w-4xl">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-serif font-bold text-gray-800 mb-2 sm:mb-3">
            Welcome back, {userName}!
          </h1>
          <p className="text-gray-600 text-base sm:text-lg leading-relaxed mb-4">
            You're working on <strong className="text-amber-700">{memorialData.name}'s</strong> memorial. 
            Every memory you add helps preserve their legacy for generations to come.
          </p>
          
          {/* Memorial Quick Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            {memorialData.birthDate && (
              <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-amber-200">
                <Calendar className="w-5 h-5 text-amber-600" />
                <div>
                  <p className="text-xs text-gray-500">Birth Date</p>
                  <p className="text-sm font-medium text-gray-800">{formatDate(memorialData.birthDate)}</p>
                </div>
              </div>
            )}
            
            {memorialData.deathDate && (
              <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-amber-200">
                <Calendar className="w-5 h-5 text-amber-600" />
                <div>
                  <p className="text-xs text-gray-500">Death Date</p>
                  <p className="text-sm font-medium text-gray-800">{formatDate(memorialData.deathDate)}</p>
                </div>
              </div>
            )}
            
            {memorialData.location && (
              <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-amber-200">
                <MapPin className="w-5 h-5 text-amber-600" />
                <div>
                  <p className="text-xs text-gray-500">Location</p>
                  <p className="text-sm font-medium text-gray-800">{memorialData.location}</p>
                </div>
              </div>
            )}
          </div>
          
          <div className="mt-4 flex items-center gap-2 text-amber-600">
            <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
            <span className="text-xs sm:text-sm">4revah Memorial - Preserving precious memories</span>
          </div>
        </div>
      </div>

      {/* Memorial Completion Progress */}
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl font-serif font-bold text-gray-800">Memorial Completion</h2>
          <span className="text-sm font-medium text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
            {progressPercentage}% Complete
          </span>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {completionSteps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className={`flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg border transition-all ${
                step.completed 
                  ? 'border-green-200 bg-green-50' 
                  : 'border-amber-200 bg-amber-50'
              }`}>
                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center shrink-0 ${
                  step.completed 
                    ? 'bg-green-500 text-white' 
                    : 'bg-amber-400 text-white'
                }`}>
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-800 text-sm sm:text-base">{step.label}</h3>
                  <p className="text-gray-600 text-xs sm:text-sm mt-1">{step.description}</p>
                </div>
                <div className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                  step.completed 
                    ? 'bg-green-500 text-white' 
                    : 'bg-amber-100 text-amber-600 border border-amber-300'
                }`}>
                  {step.count}
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Progress Summary */}
        <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-amber-50 rounded-lg border border-amber-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs sm:text-sm font-medium text-amber-700">Overall Progress</span>
            <span className="text-xs sm:text-sm font-bold text-amber-600">
              {completedSteps} of {totalSteps} sections complete
            </span>
          </div>
          <div className="w-full bg-amber-200 rounded-full h-1.5 sm:h-2">
            <div 
              className="bg-amber-500 h-1.5 sm:h-2 rounded-full transition-all duration-500" 
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          <p className="text-xs text-amber-600 mt-2">
            {progressPercentage >= 80 ? 'Almost there! Your memorial is looking beautiful.' :
             progressPercentage >= 50 ? 'Great progress! Keep adding memories and details.' :
             'Getting started! Each section you complete makes the memorial more meaningful.'}
          </p>
        </div>
      </div>

      {/* Memorial Stats Summary */}
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-blue-200">
        <h2 className="text-lg sm:text-xl font-serif font-bold text-blue-800 mb-4 sm:mb-6">Memorial Summary</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-white rounded-lg border border-blue-200">
            <Images className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-700">{memorialStats.gallery}</div>
            <div className="text-xs text-blue-600">Photos</div>
          </div>
          <div className="text-center p-4 bg-white rounded-lg border border-blue-200">
            <Users className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-700">{memorialStats.familyTree}</div>
            <div className="text-xs text-blue-600">Family Members</div>
          </div>
          <div className="text-center p-4 bg-white rounded-lg border border-blue-200">
            <Clock className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-700">{memorialStats.timeline}</div>
            <div className="text-xs text-blue-600">Timeline Events</div>
          </div>
          <div className="text-center p-4 bg-white rounded-lg border border-blue-200">
            <Heart className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-700">{memorialStats.favorites}</div>
            <div className="text-xs text-blue-600">Favorites</div>
          </div>
        </div>
        
        {/* Memorial Tips */}
        <div className="mt-6 pt-6 border-t border-blue-200">
          <h3 className="font-semibold text-blue-800 mb-4">Tips for Enhancing Your Memorial</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-white text-xs font-bold">1</span>
              </div>
              <div>
                <h4 className="font-medium text-blue-800 text-sm">Add Personal Stories</h4>
                <p className="text-blue-700 text-xs mt-1">Share anecdotes that capture their personality and spirit.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-white text-xs font-bold">2</span>
              </div>
              <div>
                <h4 className="font-medium text-blue-800 text-sm">Invite Contributions</h4>
                <p className="text-blue-700 text-xs mt-1">Share the memorial link so others can add memories.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};