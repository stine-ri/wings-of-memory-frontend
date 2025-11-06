import React from 'react';
import { Heart, MessageCircle } from 'lucide-react';

interface Memory {
  id: string;
  text: string;
  author: string;
  date: string;
  images: string[];
  likes: number;
  isFeatured: boolean;
  createdAt: string;
}

interface MemoryWallPublicProps {
  memories?: Memory[];
  lovedOneName?: string;
}

export const MemoryWallPublic: React.FC<MemoryWallPublicProps> = ({ 
  memories = [],
  lovedOneName = "Loved One"
}) => {
  if (memories.length === 0) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-3xl font-serif text-gray-800 mb-4">Memory Wall</h2>
          <p className="text-gray-600 text-lg">No memories have been shared yet.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-serif text-gray-800 mb-4">Memory Wall</h2>
          <p className="text-gray-600 text-lg">Shared memories and stories of {lovedOneName}</p>
        </div>

        <div className="space-y-6">
          {memories.map((memory) => (
            <div 
              key={memory.id} 
              className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-gray-800 text-lg">{memory.author}</h3>
                  <p className="text-sm text-gray-500 mt-1">{memory.date}</p>
                </div>
                {memory.isFeatured && (
                  <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm font-medium">
                    Featured
                  </span>
                )}
              </div>

              <p className="text-gray-700 leading-relaxed mb-4 whitespace-pre-line">
                {memory.text}
              </p>

              {memory.images && memory.images.length > 0 && (
                <div className="flex gap-3 mb-4 flex-wrap">
                  {memory.images.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`Memory from ${memory.author}`}
                      className="w-24 h-24 object-cover rounded-lg shadow-sm"
                    />
                  ))}
                </div>
              )}

              <div className="flex items-center gap-4 text-sm text-gray-500 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4" />
                  <span>{memory.likes} likes</span>
                </div>
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4" />
                  <span>Share your thoughts</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};