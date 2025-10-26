import React from 'react';
import { Eye, Download, Share2, QrCode, Settings } from 'lucide-react';

export const OverviewSection: React.FC = () => {
  const stats = [
    { label: 'Page Views', value: '1,234' },
    { label: 'Memories Shared', value: '56' },
    { label: 'RSVPs', value: '89' },
    { label: 'Days Published', value: '15' },
  ];

  const quickActions = [
    { icon: Eye, label: 'Preview Memorial', description: 'View how your memorial looks to visitors' },
    { icon: Download, label: 'Download PDF', description: 'Create a printable memorial booklet' },
    { icon: Share2, label: 'Share Link', description: 'Share the memorial with family and friends' },
    { icon: QrCode, label: 'Generate QR Code', description: 'Create QR code for memorial programs' },
    { icon: Settings, label: 'Customize Theme', description: 'Change colors and appearance' },
  ];

  return (
    <div className="space-y-8">
      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <div className="text-3xl font-bold text-gray-800 mb-2">{stat.value}</div>
            <div className="text-sm text-gray-600">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quickActions.map((action, index) => {
          const Icon = action.icon;
          return (
            <button
              key={index}
              className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition-all text-left group"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-400 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-800">{action.label}</h3>
              </div>
              <p className="text-sm text-gray-600">{action.description}</p>
            </button>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Activity</h2>
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-4 bg-amber-50 rounded-xl">
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold">+1</span>
            </div>
            <div>
              <p className="font-medium text-gray-800">New memory shared</p>
              <p className="text-sm text-gray-600">Sarah Johnson shared a memory 2 hours ago</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 bg-amber-50 rounded-xl">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold">RSVP</span>
            </div>
            <div>
              <p className="font-medium text-gray-800">New RSVP received</p>
              <p className="text-sm text-gray-600">Michael Brown confirmed attendance</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};