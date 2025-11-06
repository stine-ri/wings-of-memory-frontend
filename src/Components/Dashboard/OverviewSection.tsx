import React from 'react';
import { Download, Share2, QrCode, Heart, Users, Images, Clock } from 'lucide-react';

export const OverviewSection: React.FC = () => {
  // Get user data from localStorage
  const userData = localStorage.getItem('user');
  const user = userData ? JSON.parse(userData) : null;
  const userName = user?.name || 'there';

  const completionSteps = [
    { icon: Users, label: 'Family Tree', description: 'Add family members and relationships', completed: true },
    { icon: Clock, label: 'Timeline', description: 'Create a life timeline with key events', completed: true },
    { icon: Heart, label: 'Favorites', description: 'Share their favorite things and memories', completed: false },
    { icon: Images, label: 'Gallery', description: 'Upload photos and create albums', completed: true },
  ];

  const quickActions = [
    { 
      icon: Download, 
      label: 'Download Memorial', 
      description: 'Create a beautiful PDF booklet to share or print',
      color: 'from-blue-500 to-blue-600'
    },
    { 
      icon: Share2, 
      label: 'Share Memorial', 
      description: 'Send the memorial link to family and friends',
      color: 'from-purple-500 to-purple-600'
    },
    { 
      icon: QrCode, 
      label: 'QR Code', 
      description: 'Generate QR code for service programs',
      color: 'from-green-500 to-green-600'
    },
  ];

  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-br from-amber-100 to-amber-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 border border-amber-200">
        <div className="max-w-2xl">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-serif font-bold text-gray-800 mb-2 sm:mb-3">
            Welcome back, {userName}!
          </h1>
          <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
            We're honored to help you create a beautiful and lasting tribute for your loved one. 
            Every memory you add helps preserve their legacy for generations to come.
          </p>
          <div className="mt-3 sm:mt-4 flex items-center gap-2 text-amber-600">
            <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
            <span className="text-xs sm:text-sm">4revah Memorial - Preserving precious memories</span>
          </div>
        </div>
      </div>

      {/* Memorial Completion Progress */}
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-serif font-bold text-gray-800 mb-4 sm:mb-6">Memorial Completion</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
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
                <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center shrink-0 ${
                  step.completed 
                    ? 'bg-green-500 text-white' 
                    : 'bg-amber-100 text-amber-500 border border-amber-300'
                }`}>
                  {step.completed ? '✓' : '⋯'}
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Progress Summary */}
        <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-amber-50 rounded-lg border border-amber-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs sm:text-sm font-medium text-amber-700">Overall Progress</span>
            <span className="text-xs sm:text-sm font-bold text-amber-600">75% Complete</span>
          </div>
          <div className="w-full bg-amber-200 rounded-full h-1.5 sm:h-2">
            <div className="bg-amber-500 h-1.5 sm:h-2 rounded-full" style={{ width: '75%' }}></div>
          </div>
          <p className="text-xs text-amber-600 mt-2">
            You're doing great! Just a few more sections to complete your memorial.
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-serif font-bold text-gray-800 mb-4 sm:mb-6">Share & Download</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <button
                key={index}
                className="bg-white p-4 sm:p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300 text-left group hover:scale-105 hover:border-gray-300"
              >
                <div className={`w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r ${action.color} rounded-lg flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-800 text-base sm:text-lg mb-1 sm:mb-2">{action.label}</h3>
                <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">{action.description}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Memorial Tips */}
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-blue-200">
        <h2 className="text-lg sm:text-xl font-serif font-bold text-blue-800 mb-3 sm:mb-4">Creating a Meaningful Memorial</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 sm:w-6 sm:h-6 bg-blue-500 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-white text-xs sm:text-sm font-bold">1</span>
              </div>
              <div>
                <h3 className="font-semibold text-blue-800 text-sm sm:text-base">Add Personal Stories</h3>
                <p className="text-blue-700 text-xs sm:text-sm mt-1">Share anecdotes and memories that capture their personality and spirit.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 sm:w-6 sm:h-6 bg-blue-500 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-white text-xs sm:text-sm font-bold">2</span>
              </div>
              <div>
                <h3 className="font-semibold text-blue-800 text-sm sm:text-base">Include Family Photos</h3>
                <p className="text-blue-700 text-xs sm:text-sm mt-1">Upload photos from different life stages to create a visual journey.</p>
              </div>
            </div>
          </div>
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 sm:w-6 sm:h-6 bg-blue-500 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-white text-xs sm:text-sm font-bold">3</span>
              </div>
              <div>
                <h3 className="font-semibold text-blue-800 text-sm sm:text-base">Invite Contributions</h3>
                <p className="text-blue-700 text-xs sm:text-sm mt-1">Share the memorial link so others can add their own memories and photos.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 sm:w-6 sm:h-6 bg-blue-500 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-white text-xs sm:text-sm font-bold">4</span>
              </div>
              <div>
                <h3 className="font-semibold text-blue-800 text-sm sm:text-base">Download for Keepsake</h3>
                <p className="text-blue-700 text-xs sm:text-sm mt-1">Create a PDF memorial book to cherish and share with family members.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};