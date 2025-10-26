import React from 'react';
import { useMemorial } from '../../hooks/useMemorial';
import { Header } from '../../Components/Header';
import { ObituarySection } from '../../Components/ObituarySection';
import { TimelineSection } from '../../Components/TimelineSection';
import { FavoritesSection } from '../../Components/FavouriteSection';
import { FamilyTreeSection } from '../../Components/FamilyTreeSection';
import { GallerySection } from '../../Components/GallerySection';
import { ServiceSection } from '../../Components/ServicesSection';
import { MemoryWallDashboard} from '../../Components/MemoryWallSection';
import { useEffect } from 'react';

export const MemorialPreview: React.FC = () => {
  const { memorialData, loading } = useMemorial();

  // Add this debug log
  useEffect(() => {
    console.log('📊 Memorial Data:', memorialData);
    console.log('📝 Memory Wall Data:', memorialData?.memoryWall);
  }, [memorialData]);

  // Show loading state - CHANGED: Added || !memorialData condition
  if (loading || !memorialData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-amber-500 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading memorial preview...</p>
        </div>
      </div>
    );
  }


  // Transform dashboard data to match public component props - CHANGED: Added fallback values
  const headerData = {
    name: memorialData.name || 'Memorial',
    profileImage: memorialData.profileImage || null,
    birthDate: memorialData.birthDate || '',
    deathDate: memorialData.deathDate || '',
    location: memorialData.location || ''
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Pass the required props to each public display component */}
      <Header data={headerData} />
      <ObituarySection text={memorialData.obituary || ''} />
      <TimelineSection events={memorialData.timeline || []} />
      <FavoritesSection favorites={memorialData.favorites || []} />
      <FamilyTreeSection 
        members={memorialData.familyTree || []}
        deceasedName={memorialData.name || 'Loved One'}
        deceasedImage={memorialData.profileImage || ''}
      />
      <GallerySection images={memorialData.gallery || []} />
      <MemoryWallDashboard/>
     <ServiceSection 
        service={memorialData.service || {}}
        memorialName={memorialData.name || 'Loved One'}
      />
    </div>
  );
};