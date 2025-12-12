import React from 'react';
import { useMemorial } from '../../hooks/useMemorial';
import { Header } from '../../Components/Header'; 
import { ObituarySection } from '../../Components/ObituarySection';
import { TimelineSection } from '../../Components/TimelineSection';
import { FavoritesSection } from '../../Components/FavouriteSection';
import { FamilyTreeSection } from '../../Components/FamilyTreeSection';
import { GallerySection } from '../../Components/GallerySection';
import { ServiceSectionPublic } from '../../Components/ServiceSectionPublic';

import { MemoryWallPublic } from '../../Components/MemoryWallPublicDisplay';
import { useEffect } from 'react';

export const MemorialPreview: React.FC = () => {
  const { memorialData, loading } = useMemorial();

  useEffect(() => {
    console.log('📊 Memorial Data:', memorialData);
    console.log('📝 Memory Wall Data:', memorialData?.memoryWall);
  }, [memorialData]);

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

  const headerData = {
    name: memorialData.name || 'Memorial',
    profileImage: memorialData.profileImage || null,
    birthDate: memorialData.birthDate || '',
    deathDate: memorialData.deathDate || '',
    location: memorialData.location || ''
  };

  return (
    <div className="min-h-screen bg-white">
      <Header data={headerData} />
      <ObituarySection text={memorialData.obituary || ''} />
      <TimelineSection events={memorialData.timeline || []} />
      <FavoritesSection favorites={memorialData.favorites || []} />
      <FamilyTreeSection 
        members={memorialData.familyTree || []}
        deceasedName={memorialData.name || 'Loved One'}
        deceasedImage={memorialData.profileImage || ''}
      />
     <div data-gallery="true">
  <GallerySection images={memorialData.gallery || []} />
</div>
      

      <MemoryWallPublic 
  memories={memorialData.memoryWall || []}
  lovedOneName={memorialData.name || 'Loved One'}
/>
<div data-service="true">
   <ServiceSectionPublic 
  service={memorialData.service || {
    venue: '',
    address: '',
    date: '',
    time: '',
    virtualLink: '',
    virtualPlatform: 'zoom',
    additionalLinks: [] 
  }}
  memorialName={memorialData.name || 'Loved One'}
/>
</div>
    </div>
  );
};
