export interface MemorialData {
  id: string;
  name: string;
  profileImage: string;
  birthDate: string;
  deathDate: string;
  location: string;
  obituary: string;
  timeline: TimelineEvent[];
  favorites: Favorite[];
  familyTree: FamilyMember[];
  gallery: GalleryImage[];
   serviceInfo?: ServiceInfo; // From backend
  service?: ServiceInfo; // For frontend convenience
  memories: Memory[];
  memoryWall: Memory[];
  isPublished: boolean;
  customUrl: string;
  theme: string;
}

export interface TimelineEvent {
  id: string;
  year: number;
  date: string;
  title: string;
  description: string;
  location?: string;
  icon: string;
}

export interface Favorite {
  id: string;
  category: string;
  icon: string;
  question: string;
  answer: string;
}

export interface FamilyMember {
  id: string;
  name: string;
  image?: string;
  relation: string;
}

export interface GalleryImage {
  id: string;
  url: string;
  category: string;
  caption?: string;
  uploadedAt: string;
}


export interface ServiceInfo {
  venue: string;
  address: string;
  date: string;
  time: string;
  virtualLink?: string;
  virtualPlatform?: 'zoom' | 'meet' | 'teams' | 'youtube' | 'facebook' | 'instagram' | 'tiktok' | 'twitch' | 'other';
  additionalLinks?: Array<{
    platform: string;
    url: string;
  }>;
}

export interface Memory {
  id: string;
  text: string;
  author: string;
  date: string;
  images: string[];
  likes: number;
  isFeatured: boolean;
  createdAt: string;
}