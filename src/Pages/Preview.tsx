// Pages/Preview.tsx
import React from 'react';
import { useParams } from 'react-router-dom';
import { MemorialPreview } from '../Components/Dashboard/MemorialPreview';
import { MemorialProvider } from '../Contexts/MemorialContext';

export const PreviewPage: React.FC = () => {
  const { memorialId } = useParams<{ memorialId: string }>();

  if (!memorialId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Memorial not found.</p>
      </div>
    );
  }

  return (
    <MemorialProvider memorialId={memorialId}>
      <div className="min-h-screen bg-white">
        <div className="bg-amber-500 text-white p-4 text-center">
          <p className="text-sm">Preview Mode - This is how your memorial will look to visitors</p>
        </div>
        <MemorialPreview />
      </div>
    </MemorialProvider>
  );
};