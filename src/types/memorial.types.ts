import type { Favorite } from '../Components/FavouriteSection';

export interface MemorialData {
  name: string;
  birthDate: string;
  deathDate: string;
  location: string;
  profileImage: string;
  quote: string;
  obituary: string;
  timeline: TimelineEvent[];
  gallery: GalleryImage[];
  memoryWall: Memory[];
  familyTree: FamilyMember[];
  service: ServiceInfo;
    favorites: Favorite[]; 
}

export interface TimelineEvent {
  date: string;
  year: number;
  title: string;
  description: string;
  location?: string;
  icon: string;
}

export interface GalleryImage {
  url: string;
  category: string;
}

export interface Memory {
  text: string;
  author?: string;
}

export interface FamilyMember {
  name: string;
  image: string;
  relation: string;
}

export interface ServiceInfo {
  venue: string;
  address: string;
  date: string;
  time: string;
}