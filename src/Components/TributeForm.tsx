// frontend/components/TributeForm.tsx
import React, { useState } from 'react';
import { Send, User, MapPin, MessageSquare } from 'lucide-react';

interface TributeFormProps {
  onSubmit: (data: {
    authorName: string;
    authorLocation: string;
    message: string;
    authorImage?: string;
  }) => Promise<{ success: boolean; error?: string }>;
}

export default function TributeForm({ onSubmit }: TributeFormProps) {
  const [formData, setFormData] = useState({
    authorName: '',
    authorLocation: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.authorName.trim() || !formData.message.trim()) {
      setSubmitStatus({
        type: 'error',
        message: 'Please provide your name and tribute message'
      });
      return;
    }

    setSubmitting(true);
    setSubmitStatus({ type: null, message: '' });

    try {
      const result = await onSubmit(formData);
      
      if (result.success) {
        setSubmitStatus({
          type: 'success',
          message: 'Tribute submitted successfully! The memorial PDF will update shortly.'
        });
        setFormData({
          authorName: '',
          authorLocation: '',
          message: '',
        });
      } else {
        setSubmitStatus({
          type: 'error',
          message: result.error || 'Failed to submit tribute'
        });
      }
    } catch {
      setSubmitStatus({
        type: 'error',
        message: 'Network error. Please try again.'
      });
    } finally {
      setSubmitting(false);
      
      // Clear success message after 5 seconds
      if (submitStatus.type === 'success') {
        setTimeout(() => {
          setSubmitStatus({ type: null, message: '' });
        }, 5000);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {submitStatus.type && (
        <div
          className={`p-4 rounded-lg ${
            submitStatus.type === 'success'
              ? 'bg-green-50 text-green-800 border border-green-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          {submitStatus.message}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Your Name *
            </div>
          </label>
          <input
            type="text"
            name="authorName"
            value={formData.authorName}
            onChange={handleChange}
            placeholder="Enter your name"
            className="w-full px-4 py-3 border border-amber-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent placeholder-gray-400"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Your Location (e.g., Nairobi, Kenya)
            </div>
          </label>
          <input
            type="text"
            name="authorLocation"
            value={formData.authorLocation}
            onChange={handleChange}
            placeholder="City, Country"
            className="w-full px-4 py-3 border border-amber-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent placeholder-gray-400"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            Your Tribute Message *
          </div>
        </label>
        <textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          placeholder="Share your memories, thoughts, or condolences..."
          rows={5}
          className="w-full px-4 py-3 border border-amber-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent placeholder-gray-400 resize-none"
          required
        />
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={submitting}
          className="flex items-center gap-2 px-8 py-3 bg-amber-500 text-white font-medium rounded-xl hover:bg-amber-600 disabled:bg-amber-400 disabled:cursor-not-allowed transition-colors"
        >
          {submitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Submitting...
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              Share Tribute
            </>
          )}
        </button>
      </div>

      <p className="text-sm text-gray-500 text-center">
        Your tribute will be visible to everyone viewing this memorial and will be included in the memorial PDF.
      </p>
    </form>
  );
}