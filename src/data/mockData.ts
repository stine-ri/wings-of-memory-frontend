import type { MemorialData } from '../types/memorial.types';
import type { Favorite } from '../Components/FavouriteSection'; 

export const mockMemorialData: MemorialData = {
  name: "Joanne J. Davis",
  birthDate: "March 10, 1950",
  deathDate: "March 25, 2023",
  location: "Cleveland, Ohio",
  profileImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
  quote: "The comfort of having a friend may be taken away, but not that of having had one.",
  obituary: "Joanne J. Davis, a beloved wife, mother, and dedicated community member, peacefully passed away on March 25, 2023 - at the age of 73.\n\nBorn on March 10, 1950, Joanne grew up with strong family values and a deep sense of community.\n\nShe excelled academically and athletically in high school, eventually earning a Bachelor's degree in Business Administration.\n\nIn 1975, Joanne married her love, Anthony, and they shared 48 years of a loving marriage, raising two children, Emily and Michael, and becoming adoring grandparents to Grace, Ethan, and Lily.\n\nProfessionally, Joanne had a distinguished career in finance, marked by her integrity and mentorship of young professionals. She also dedicated her time to various charitable causes, leaving a positive impact on her community.\n\nJoanne had a passion for the outdoors, often spending weekends camping, fishing, and hiking with her family, instilling a love for nature in her loved ones.\n\nJoanne is survived by her wife, children, grandchildren, and siblings, Robert Jr. and Susan. A memorial service will be held on October 2, 2023, at St. Mary's Community Church at 2:00 PM.\n\nIn lieu of flowers, the family requests donations to the Joanne J. Davis Memorial Scholarship Fund, supporting underprivileged youth's education in the community. Joanne's legacy lives on through the countless lives he touched, the values he upheld, and the love she shared. She will be deeply missed but forever cherished.",
  timeline: [
    { date: "March 10th", year: 1950, title: "Birth in Cleveland", description: "", location: "Cleveland, Ohio", icon: "baby" },
    { date: "June 1st", year: 1972, title: "Graduate from University", description: "", location: "Ohio State University", icon: "graduation" },
    { date: "February 14th", year: 1974, title: "Met with Anthony", description: "Anthony and Joanne met at a mutual friend's gathering. A few years later, they would get married.", icon: "heart" },
    { date: "June 9th", year: 1975, title: "Wedding", description: "Anthony and Joanne got married in a beautiful yet intimate wedding.", location: "Ohio", icon: "heart" },
    { date: "October 18th", year: 1978, title: "Birth of Emily", description: "Birth of Emily, their first child.", icon: "baby" },
    { date: "August 6th", year: 1981, title: "Birth of Michael", description: "Birth of Michael, their second child.", icon: "baby" }
  ],
  gallery: [
   { url: "https://images.unsplash.com/photo-1511895426328-dc8714191300?w=400&h=300&fit=crop", category: "portraits" },
    { url: "https://images.unsplash.com/photo-1609220136736-443140cffec6?w=400&h=300&fit=crop", category: "loving-couple" },
    { url: "https://images.unsplash.com/photo-1476234251651-f353703a034d?w=400&h=300&fit=crop", category: "family-activities" },
    { url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=300&fit=crop", category: "loving-couple" },
    { url: "https://images.unsplash.com/photo-1581579186913-45ac3e6efe93?w=400&h=300&fit=crop", category: "family-activities" },
    { url: "https://images.unsplash.com/photo-1511895426328-dc8714191300?w=400&h=300&fit=crop", category: "portraits" },
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
    { text: "Her warmth, humor, and love for adventure made every moment together truly memorable. She brought laughter and joy to all our lives. While we'll miss her presence, let's remember the good times and continue to share the laughter and love she gave us. Cheers to you, Joanne!", author: "Sarah Mitchell" },
    { text: "As we remember Joanne, let's honor her memory by embodying her grace, love, and generosity. She lives on in our hearts, guiding us to be the best versions of ourselves. Rest peacefully, dear Joanne. You are dearly missed.", author: "David Thompson" }
  ],
  familyTree: [
    { name: "Robert Davis Sr.", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop", relation: "Father" },
    { name: "Margaret Davis", image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop", relation: "Mother" },
    { name: "Anthony Davis", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop", relation: "Spouse" },
    { name: "Emily Davis", image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop", relation: "Daughter" },
    { name: "Michael Davis", image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop", relation: "Son" },
    { name: "Robert Davis Jr.", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop", relation: "Brother" }
  ],
  service: {
    venue: "St. Mary's Community Church",
    address: "1234 Church Street, Cleveland, Ohio 44115",
    date: "October 2, 2023",
    time: "2:00 PM"
  },
favorites: [
  {
    category: "Saying",
    icon: "💬",
    question: "What was Joanne's favorite Saying?",
    answer: '"Live and let live"\n"You\'re never too old to learn"'
  },
  {
    category: "Book",
    icon: "📖",
    question: "What was Joanne's favorite Book?",
    answer: "To Kill a Mockingbird by Harper Lee - a timeless classic"
  },
  {
    category: "Movie",
    icon: "🎬",
    question: "What was Joanne's favorite Movie?",
    answer: "Forrest Gump, The Godfather"
  },
  {
    category: "Travel",
    icon: "✈️",
    question: "What was Joanne's favorite Travel destination?",
    answer: "Italy - especially Florence and Tuscany."
  },
  {
    category: "Color",
    icon: "🎨",
    question: "What was Joanne's favorite Color?",
    answer: "Pale green, pale blue... anything pale or pastel."
  },
  {
    category: "Fun Fact",
    icon: "😊",
    question: "Fun fact about Joanne:",
    answer: "Joanne was great at juggling 🤹"
  }
] as Favorite[]
};