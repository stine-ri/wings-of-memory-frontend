import type { MemorialData } from '../types/memorial.types';
import type { Favorite } from '../Components/FavouriteSection'; 

export const mockMemorialData: MemorialData = {
  name: "Your Loved One",
  birthDate: "January 1, 1950",
  deathDate: "December 31, 2023",
  location: "Your City, State",
  profileImage: "https://images.unsplash.com/photo-1490730141103-6cac27aaab94?w=400&h=400&fit=crop",
  quote: "Every life is a story worth telling. Every memory is a treasure worth keeping.",
  obituary: "This is where you can share the beautiful story of your loved one's life.\n\nWrite about their early years, their passions, their accomplishments, and the love they shared with family and friends.\n\nDescribe the values they held dear, the impact they made on their community, and the special moments that defined their journey.\n\nShare memories of their hobbies, their sense of humor, and the little things that made them unique.\n\nInclude information about their family, their career, and the legacy they leave behind.\n\nThis space is yours to honor their memory in your own words, celebrating a life well-lived and deeply cherished.",
  timeline: [
    { date: "January 1st", year: 1950, title: "Birth", description: "The beginning of a beautiful life", location: "Your City", icon: "baby" },
    { date: "June 1st", year: 1972, title: "Graduation", description: "Academic achievement", location: "University Name", icon: "graduation" },
    { date: "February 14th", year: 1974, title: "Met Soulmate", description: "A life-changing encounter", icon: "heart" },
    { date: "June 9th", year: 1975, title: "Wedding Day", description: "The start of a beautiful journey together", location: "Your Location", icon: "heart" },
    { date: "Month Day", year: 1978, title: "First Child Born", description: "Welcome to the family", icon: "baby" },
    { date: "Month Day", year: 1981, title: "Second Child Born", description: "The family grows", icon: "baby" }
  ],
  gallery: [
    { url: "https://images.unsplash.com/photo-1511895426328-dc8714191300?w=400&h=300&fit=crop", category: "portraits" },
    { url: "https://images.unsplash.com/photo-1609220136736-443140cffec6?w=400&h=300&fit=crop", category: "loving-couple" },
    { url: "https://images.unsplash.com/photo-1476234251651-f353703a034d?w=400&h=300&fit=crop", category: "family-activities" },
    { url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=300&fit=crop", category: "loving-couple" },
    { url: "https://images.unsplash.com/photo-1581579186913-45ac3e6efe93?w=400&h=300&fit=crop", category: "family-activities" },
    { url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=300&fit=crop", category: "portraits" },
    { url: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400&h=300&fit=crop", category: "portraits" },
    { url: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=400&h=300&fit=crop", category: "loving-couple" },
    { url: "https://images.unsplash.com/photo-1609220136736-443140cffec6?w=400&h=300&fit=crop", category: "family-activities" },
    { url: "https://images.unsplash.com/photo-1542596768-5d1d21f1cf98?w=400&h=300&fit=crop", category: "family-activities" },
    { url: "https://images.unsplash.com/photo-1581579186913-45ac3e6efe93?w=400&h=300&fit=crop", category: "loving-couple" },
    { url: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=400&h=300&fit=crop", category: "portraits" },
    { url: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=400&h=300&fit=crop", category: "loving-couple" },
    { url: "https://images.unsplash.com/photo-1542596768-5d1d21f1cf98?w=400&h=300&fit=crop", category: "family-activities" }
  ],
  memoryWall: [
    { text: "Share your favorite memories and stories here. Let everyone know what made your loved one special and how they touched your life.", author: "Family Friend" },
    { text: "This is a space for friends and family to come together, share their thoughts, and celebrate the beautiful life that was lived.", author: "Close Friend" }
  ],
  familyTree: [
    { name: "Parent Name", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop", relation: "Father" },
    { name: "Parent Name", image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop", relation: "Mother" },
    { name: "Spouse Name", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop", relation: "Spouse" },
    { name: "Child Name", image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop", relation: "Daughter" },
    { name: "Child Name", image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop", relation: "Son" },
    { name: "Sibling Name", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop", relation: "Brother" }
  ],
  service: {
    venue: "Memorial Service Venue",
    address: "Address of Service Location",
    date: "Service Date",
    time: "Service Time"
  },
  favorites: [
    {
      category: "Saying",
      icon: "💬",
      question: "What was their favorite saying?",
      answer: "Add their favorite quotes or phrases that they loved to share"
    },
    {
      category: "Book",
      icon: "📖",
      question: "What was their favorite book?",
      answer: "Share the books that meant the most to them"
    },
    {
      category: "Movie",
      icon: "🎬",
      question: "What was their favorite movie?",
      answer: "List the films they loved to watch"
    },
    {
      category: "Travel",
      icon: "✈️",
      question: "What was their favorite travel destination?",
      answer: "Share the places they loved to visit or dreamed of seeing"
    },
    {
      category: "Color",
      icon: "🎨",
      question: "What was their favorite color?",
      answer: "The colors that brought them joy"
    },
    {
      category: "Fun Fact",
      icon: "😊",
      question: "Fun fact about them:",
      answer: "Share something unique or special that made them who they were"
    }
  ] as Favorite[]
};