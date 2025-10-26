import React, { useState, useEffect } from 'react';
import { Heart, Search, ArrowUpDown, Plus, Edit2, Trash2, X } from 'lucide-react';

interface Memory {
  id?: string;
  text: string;
  author?: string;
  date?: string;
  images?: string[];
  userId?: string;
  timestamp?: number;
}

interface MemoryWallSectionProps {
  memories?: Memory[];
}

export const MemoryWallDashboard: React.FC<MemoryWallSectionProps> = ({ memories: initialMemories = [] }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortNewest, setSortNewest] = useState(true);
  const [showContributeModal, setShowContributeModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingMemory, setEditingMemory] = useState<Memory | null>(null);
  const [newMemory, setNewMemory] = useState({ text: '', author: '', images: [] as string[] });
  const [likedMemories, setLikedMemories] = useState<Set<string>>(new Set());
  const [memories, setMemories] = useState<Memory[]>([]);
  const [currentUserId, setCurrentUserId] = useState('');
  const [uploadingImages, setUploadingImages] = useState(false);

  useEffect(() => {
    loadOrCreateUserId();
    loadMemories();
    loadLikes();
    cleanupExpiredImages();
  }, []);

  // Convert initial memories to proper format
  useEffect(() => {
    const storedMemories = localStorage.getItem('memories-list');
    if (!storedMemories && initialMemories.length > 0) {
      const convertedMemories = initialMemories.map((m, index) => ({
        ...m,
        id: m.id || 'initial-' + index,
        author: m.author || 'Anonymous',
        date: m.date || new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
        userId: m.userId || 'system',
        timestamp: m.timestamp || Date.now() - (index * 86400000)
      }));
      setMemories(convertedMemories);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadOrCreateUserId = () => {
    try {
      let userId = localStorage.getItem('current-user-id');
      if (!userId) {
        userId = 'user-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('current-user-id', userId);
      }
      setCurrentUserId(userId);
    } catch {
      const userId = 'user-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
      setCurrentUserId(userId);
    }
  };

  const loadMemories = () => {
    try {
      const stored = localStorage.getItem('memories-list');
      if (stored) {
        const loadedMemories = JSON.parse(stored);
        setMemories(loadedMemories);
      }
    } catch {
      console.log('No memories in storage yet');
    }
  };

  const loadLikes = () => {
    try {
      const stored = localStorage.getItem('user-likes');
      if (stored) {
        setLikedMemories(new Set(JSON.parse(stored)));
      }
    } catch {
      console.log('No likes found');
    }
  };

  const saveMemories = (updatedMemories: Memory[]) => {
    try {
      localStorage.setItem('memories-list', JSON.stringify(updatedMemories));
      setMemories(updatedMemories);
    } catch (error) {
      console.error('Failed to save memories:', error);
    }
  };

  const saveLikes = (likes: Set<string>) => {
    try {
      localStorage.setItem('user-likes', JSON.stringify([...likes]));
    } catch (error) {
      console.error('Failed to save likes:', error);
    }
  };

  const cleanupExpiredImages = () => {
    const now = Date.now();
    const twentyFourHours = 24 * 60 * 60 * 1000;
    
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith('image:')) {
          try {
            const imgData = JSON.parse(localStorage.getItem(key) || '{}');
            if (imgData.timestamp && now - imgData.timestamp > twentyFourHours) {
              localStorage.removeItem(key);
            }
          } catch {
            console.log('Error checking image:', key);
          }
        }
      });
    } catch {
      console.log('No images to cleanup');
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, isEdit: boolean = false) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingImages(true);
    const imageUrls: string[] = [];

    for (let i = 0; i < Math.min(files.length, 3); i++) {
      const file = files[i];
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        continue;
      }

      try {
        const reader = new FileReader();
        const base64 = await new Promise<string>((resolve) => {
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });

        const imageId = 'image:' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
        const imageData = {
          data: base64,
          timestamp: Date.now()
        };

        localStorage.setItem(imageId, JSON.stringify(imageData));
        imageUrls.push(imageId);
      } catch (error) {
        console.error('Failed to upload image:', error);
      }
    }

    if (isEdit && editingMemory) {
      setEditingMemory({
        ...editingMemory,
        images: [...(editingMemory.images || []), ...imageUrls]
      });
    } else {
      setNewMemory({
        ...newMemory,
        images: [...newMemory.images, ...imageUrls]
      });
    }
    
    setUploadingImages(false);
  };

  const getImageUrl = (imageId: string): string => {
    try {
      const stored = localStorage.getItem(imageId);
      if (stored) {
        const imageData = JSON.parse(stored);
        return imageData.data;
      }
    } catch (error) {
      console.error('Failed to load image:', error);
    }
    return '';
  };

  const toggleLike = (memoryId: string) => {
    const newLiked = new Set(likedMemories);
    if (newLiked.has(memoryId)) {
      newLiked.delete(memoryId);
    } else {
      newLiked.add(memoryId);
    }
    setLikedMemories(newLiked);
    saveLikes(newLiked);
  };

  const handleContribute = () => {
    if (newMemory.text.trim() && newMemory.author.trim()) {
      const memory: Memory = {
        id: 'memory-' + Date.now(),
        text: newMemory.text,
        author: newMemory.author,
        date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
        images: newMemory.images,
        userId: currentUserId,
        timestamp: Date.now()
      };

      const updatedMemories = [memory, ...memories];
      saveMemories(updatedMemories);
      setShowContributeModal(false);
      setNewMemory({ text: '', author: '', images: [] });
    }
  };

  const handleEdit = (memory: Memory) => {
    setEditingMemory({ ...memory });
    setShowEditModal(true);
  };

  const handleUpdate = () => {
    if (editingMemory && editingMemory.text.trim() && (editingMemory.author?.trim() || true)) {
      const updatedMemories = memories.map(m => 
        m.id === editingMemory.id ? editingMemory : m
      );
      saveMemories(updatedMemories);
      setShowEditModal(false);
      setEditingMemory(null);
    }
  };

  const handleDelete = (memoryId: string) => {
    if (window.confirm('Are you sure you want to delete this memory?')) {
      const memory = memories.find(m => m.id === memoryId);
      if (memory?.images) {
        for (const imageId of memory.images) {
          try {
            localStorage.removeItem(imageId);
          } catch {
            console.log('Error deleting image:', imageId);
          }
        }
      }
      
      const updatedMemories = memories.filter(m => m.id !== memoryId);
      saveMemories(updatedMemories);
    }
  };

  const removeImage = (index: number, isEdit: boolean = false) => {
    if (isEdit && editingMemory) {
      const newImages = [...(editingMemory.images || [])];
      newImages.splice(index, 1);
      setEditingMemory({ ...editingMemory, images: newImages });
    } else {
      const newImages = [...newMemory.images];
      newImages.splice(index, 1);
      setNewMemory({ ...newMemory, images: newImages });
    }
  };

  const filteredMemories = memories
    .filter(memory => 
      memory.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      memory.author?.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      const aTime = a.timestamp || 0;
      const bTime = b.timestamp || 0;
      return sortNewest ? bTime - aTime : aTime - bTime;
    });

  const ImageDisplay = ({ imageId }: { imageId: string }) => {
    const [imageUrl, setImageUrl] = useState('');

    useEffect(() => {
      setImageUrl(getImageUrl(imageId));
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [imageId]);

    if (!imageUrl) return null;

    return (
      <img
        src={imageUrl}
        alt=""
        className="w-16 h-16 object-cover rounded"
      />
    );
  };

  return (
    <section id="memory" className="py-16 sm:py-20 px-3 sm:px-4 bg-white">
      <div className="max-w-4xl mx-auto">
        {/* Left-aligned Title with Half Underline - Same as other sections */}
        <div className="mb-8 sm:mb-12 sm:-ml-32">
          <h2 className="text-4xl sm:text-5xl font-serif text-gray-800 inline-block relative">
            Memory Wall
            <div className="absolute -bottom-2 left-0 w-1/2 h-1 bg-amber-500"></div>
          </h2>
        </div>
        
        <p className="text-gray-600 mb-6 sm:mb-8 text-base sm:text-lg leading-relaxed sm:-ml-32">
          "To live in the hearts we leave behind is not to die."<br/>
          Please share your Photos and Memories about Joanne.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mb-6 sm:mb-8 items-stretch sm:items-center justify-between">
          <button 
            onClick={() => setShowContributeModal(true)}
            className="bg-orange-400 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg hover:bg-orange-500 transition-colors flex items-center gap-2 text-sm sm:text-base font-medium justify-center"
          >
            Contribute →
          </button>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center">
            <button 
              onClick={() => setSortNewest(!sortNewest)}
              className="flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-base text-gray-700 justify-center"
            >
              <ArrowUpDown size={14} className="sm:size-[16px]" />
              Date ({sortNewest ? 'newest first' : 'oldest first'})
            </button>

            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-gray-400 text-sm sm:text-base w-full sm:w-64"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4 sm:space-y-6">
          {filteredMemories.map((memory) => (
            <div 
              key={memory.id || Math.random()} 
              className="bg-gray-50 p-4 sm:p-6 rounded-lg border border-gray-200 hover:shadow-sm transition-shadow duration-200"
            >
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 sm:gap-0 mb-3 sm:mb-4">
                <p className="text-gray-500 text-xs sm:text-sm italic">{memory.date || 'No date'}</p>
                
                <div className="flex items-center gap-3 justify-end sm:justify-start">
                  <button
                    onClick={() => toggleLike(memory.id || '')}
                    className="flex items-center gap-2 text-gray-500 hover:text-orange-500 transition-colors text-xs sm:text-sm"
                  >
                    <Heart 
                      size={16} 
                      className={likedMemories.has(memory.id || '') ? 'fill-orange-500 text-orange-500' : ''} 
                    />
                    Like
                  </button>

                  {memory.userId === currentUserId && (
                    <>
                      <button
                        onClick={() => handleEdit(memory)}
                        className="p-1 text-gray-500 hover:text-orange-500 transition-colors"
                        title="Edit memory"
                      >
                        <Edit2 size={14} className="sm:size-[16px]" />
                      </button>
                      <button
                        onClick={() => handleDelete(memory.id || '')}
                        className="p-1 text-gray-500 hover:text-red-500 transition-colors"
                        title="Delete memory"
                      >
                        <Trash2 size={14} className="sm:size-[16px]" />
                      </button>
                    </>
                  )}
                </div>
              </div>

              <p className="text-gray-700 leading-relaxed mb-4 sm:mb-5 text-sm sm:text-base whitespace-pre-line">{memory.text}</p>

              {memory.images && memory.images.length > 0 && (
                <div className="flex gap-2 sm:gap-3 mb-4 sm:mb-5 flex-wrap">
                  {memory.images.map((imageId, imgIndex) => (
                    <ImageDisplay key={imgIndex} imageId={imageId} />
                  ))}
                </div>
              )}

              <p className="text-gray-500 text-right font-serif italic text-sm sm:text-base">
                {memory.author || 'Anonymous'}
              </p>
            </div>
          ))}
        </div>

        {/* Contribute Modal */}
        {showContributeModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3 sm:p-4">
            <div className="bg-white rounded-lg p-4 sm:p-6 md:p-8 max-w-xl w-full max-h-[90vh] overflow-y-auto">
              <h3 className="text-2xl sm:text-3xl font-serif mb-4 sm:mb-6 text-gray-800">Share a Memory</h3>
              
              <div className="space-y-4 sm:space-y-5">
                <div>
                  <label className="block text-gray-700 mb-2 text-sm sm:text-base font-medium">Your Name</label>
                  <input
                    type="text"
                    value={newMemory.author}
                    onChange={(e) => setNewMemory({...newMemory, author: e.target.value})}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-400 text-sm sm:text-base"
                    placeholder="Enter your name"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-2 text-sm sm:text-base font-medium">Your Memory</label>
                  <textarea
                    value={newMemory.text}
                    onChange={(e) => setNewMemory({...newMemory, text: e.target.value})}
                    rows={4}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-400 resize-none text-sm sm:text-base"
                    placeholder="Share your thoughts, stories, or memories..."
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-2 text-sm sm:text-base font-medium">
                    Add Photos (Optional - max 3, will be deleted after 24 hours)
                  </label>
                  
                  {newMemory.images.length > 0 && (
                    <div className="flex gap-2 sm:gap-3 mb-3 sm:mb-4 flex-wrap">
                      {newMemory.images.map((imageId, index) => (
                        <div key={index} className="relative">
                          <ImageDisplay imageId={imageId} />
                          <button
                            onClick={() => removeImage(index)}
                            className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-red-500 text-white rounded-full p-0.5 sm:p-1 hover:bg-red-600"
                          >
                            <X size={12} className="sm:size-[14px]" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {newMemory.images.length < 3 && (
                    <label className="border-2 border-dashed border-gray-300 rounded-lg p-4 sm:p-6 md:p-8 text-center hover:border-orange-400 transition-colors cursor-pointer block">
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) => handleImageUpload(e)}
                        className="hidden"
                        disabled={uploadingImages}
                      />
                      <Plus size={20} className="sm:size-[28px] mx-auto text-gray-400 mb-2 sm:mb-3" />
                      <p className="text-gray-500 text-sm sm:text-base">
                        {uploadingImages ? 'Uploading...' : 'Click to upload photos'}
                      </p>
                    </label>
                  )}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6 sm:mt-8">
                <button
                  onClick={handleContribute}
                  disabled={uploadingImages}
                  className="flex-1 bg-orange-400 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg hover:bg-orange-500 transition-colors text-sm sm:text-base disabled:opacity-50"
                >
                  Submit Memory
                </button>
                <button
                  onClick={() => {
                    setShowContributeModal(false);
                    setNewMemory({ text: '', author: '', images: [] });
                  }}
                  className="flex-1 bg-gray-200 text-gray-700 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg hover:bg-gray-300 transition-colors text-sm sm:text-base"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {showEditModal && editingMemory && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3 sm:p-4">
            <div className="bg-white rounded-lg p-4 sm:p-6 md:p-8 max-w-xl w-full max-h-[90vh] overflow-y-auto">
              <h3 className="text-2xl sm:text-3xl font-serif mb-4 sm:mb-6 text-gray-800">Edit Memory</h3>
              
              <div className="space-y-4 sm:space-y-5">
                <div>
                  <label className="block text-gray-700 mb-2 text-sm sm:text-base font-medium">Your Name</label>
                  <input
                    type="text"
                    value={editingMemory.author || ''}
                    onChange={(e) => setEditingMemory({...editingMemory, author: e.target.value})}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-400 text-sm sm:text-base"
                    placeholder="Enter your name"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-2 text-sm sm:text-base font-medium">Your Memory</label>
                  <textarea
                    value={editingMemory.text}
                    onChange={(e) => setEditingMemory({...editingMemory, text: e.target.value})}
                    rows={4}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-400 resize-none text-sm sm:text-base"
                    placeholder="Share your thoughts, stories, or memories..."
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-2 text-sm sm:text-base font-medium">
                    Photos (max 3, will be deleted after 24 hours)
                  </label>
                  
                  {editingMemory.images && editingMemory.images.length > 0 && (
                    <div className="flex gap-2 sm:gap-3 mb-3 sm:mb-4 flex-wrap">
                      {editingMemory.images.map((imageId, index) => (
                        <div key={index} className="relative">
                          <ImageDisplay imageId={imageId} />
                          <button
                            onClick={() => removeImage(index, true)}
                            className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-red-500 text-white rounded-full p-0.5 sm:p-1 hover:bg-red-600"
                          >
                            <X size={12} className="sm:size-[14px]" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {(!editingMemory.images || editingMemory.images.length < 3) && (
                    <label className="border-2 border-dashed border-gray-300 rounded-lg p-4 sm:p-6 md:p-8 text-center hover:border-orange-400 transition-colors cursor-pointer block">
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) => handleImageUpload(e, true)}
                        className="hidden"
                        disabled={uploadingImages}
                      />
                      <Plus size={20} className="sm:size-[28px] mx-auto text-gray-400 mb-2 sm:mb-3" />
                      <p className="text-gray-500 text-sm sm:text-base">
                        {uploadingImages ? 'Uploading...' : 'Click to upload photos'}
                      </p>
                    </label>
                  )}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6 sm:mt-8">
                <button
                  onClick={handleUpdate}
                  disabled={uploadingImages}
                  className="flex-1 bg-orange-400 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg hover:bg-orange-500 transition-colors text-sm sm:text-base disabled:opacity-50"
                >
                  Update Memory
                </button>
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingMemory(null);
                  }}
                  className="flex-1 bg-gray-200 text-gray-700 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg hover:bg-gray-300 transition-colors text-sm sm:text-base"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default MemoryWallDashboard;