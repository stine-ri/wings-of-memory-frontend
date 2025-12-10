import React, { useState, useEffect, useCallback, useRef } from 'react';
import { MessageCircle, Heart, Trash2, Upload, Plus, Save } from 'lucide-react';
import { useMemorial } from '../../hooks/useMemorial';

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
interface RawMemory {
  id?: string;
  text?: string;
  author?: string;
  date?: string;
  images?: string[];
  likes?: number;
  isFeatured?: boolean;
  createdAt?: string;
}
// Custom equality check for memories
const areMemoriesEqual = (mem1: Memory[], mem2: Memory[]): boolean => {
  if (mem1.length !== mem2.length) return false;
  
  for (let i = 0; i < mem1.length; i++) {
    const m1 = mem1[i];
    const m2 = mem2[i];
    
    if (m1.id !== m2.id || 
        m1.text !== m2.text || 
        m1.author !== m2.author ||
        m1.isFeatured !== m2.isFeatured ||
        m1.likes !== m2.likes ||
        JSON.stringify(m1.images) !== JSON.stringify(m2.images)) {
      return false;
    }
  }
  
  return true;
};

export const MemoryWallSection: React.FC = () => {
  const { memorialData, updateMemoryWall } = useMemorial();
  const [memories, setMemories] = useState<Memory[]>([]);
  const [showMemoryForm, setShowMemoryForm] = useState(false);
  const [newMemory, setNewMemory] = useState({
    text: '',
    author: '',
    images: [] as string[]
  });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);
  const [lastSavedMemories, setLastSavedMemories] = useState<Memory[] | null>(null);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');

  // Use ref to prevent unnecessary re-renders
  const backendMemoriesRef = useRef<Memory[]>([]);
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Initialize memories from backend
  useEffect(() => {
    if (memorialData?.memoryWall && !hasInitialized) {
      try {
        const memoryWallData = Array.isArray(memorialData.memoryWall) 
          ? memorialData.memoryWall 
          : [];
        
        const safeMemories = memoryWallData.map((memory: RawMemory) => ({
          id: memory.id || crypto.randomUUID(),
          text: memory.text || '',
          author: memory.author || '',
          date: memory.date || new Date().toISOString().split('T')[0],
          images: Array.isArray(memory.images) ? memory.images : [],
          likes: typeof memory.likes === 'number' ? memory.likes : 0,
          isFeatured: Boolean(memory.isFeatured),
          createdAt: memory.createdAt || new Date().toISOString()
        })) as Memory[];
        
        setMemories(safeMemories);
        backendMemoriesRef.current = safeMemories;
        setLastSavedMemories(safeMemories);
        setHasInitialized(true);
        
        console.log('✅ MemoryWall initialized with', safeMemories.length, 'memories');
      } catch (error) {
        console.error('❌ Failed to initialize memories:', error);
        setHasInitialized(true);
      }
    }
  }, [memorialData, hasInitialized]);

  // Check if we have changes (optimized)
  const hasUnsavedChanges = useCallback(() => {
    if (!lastSavedMemories) return memories.length > 0;
    return !areMemoriesEqual(memories, lastSavedMemories);
  }, [memories, lastSavedMemories]);

  // Auto-save with debounce
  useEffect(() => {
    if (!hasInitialized || !hasUnsavedChanges()) return;

    // Clear any existing timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Set new timeout
    saveTimeoutRef.current = setTimeout(async () => {
      try {
        console.log('💾 Auto-saving memory wall...');
        await updateMemoryWall(memories);
        setLastSavedMemories([...memories]);
        console.log('✅ Auto-save completed');
      } catch (error) {
        console.error('❌ Auto-save failed:', error);
      }
    }, 2000); // Wait 2 seconds of inactivity before saving

    // Cleanup
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [memories, hasInitialized, hasUnsavedChanges, updateMemoryWall]);

  // Manual save function
  const handleManualSave = async () => {
    if (saving || !hasUnsavedChanges()) return;
    
    setSaving(true);
    setSaveStatus('saving');
    
    try {
      console.log('💾 Manual save triggered');
      await updateMemoryWall(memories);
      setLastSavedMemories([...memories]);
      setSaveStatus('success');
      
      // Show success message briefly
      setTimeout(() => setSaveStatus('idle'), 2000);
      
      console.log('✅ Manual save completed');
    } catch (error) {
      console.error('❌ Manual save failed:', error);
      setSaveStatus('error');
      alert('Failed to save. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // Calculate stats safely
  const stats = {
    total: memories.length,
    featured: memories.filter(m => m.isFeatured).length,
    withImages: memories.filter(m => 
      m.images && Array.isArray(m.images) && m.images.length > 0
    ).length,
    totalLikes: memories.reduce((sum, memory) => sum + (memory.likes || 0), 0)
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const uploadedImages: string[] = [];

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Please log in again.');
      }

      for (let i = 0; i < Math.min(files.length, 3); i++) {
        const file = files[i];
        
        if (file.size > 5 * 1024 * 1024) {
          alert('Image size should be less than 5MB');
          continue;
        }

        if (!file.type.startsWith('image/')) {
          alert('Please upload image files only');
          continue;
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', 'memorials/memory-wall');
        
        const uploadResponse = await fetch('https://wings-of-memories-backend.onrender.com/api/imagekit/upload', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` },
          body: formData,
        });

        if (!uploadResponse.ok) {
          const errorText = await uploadResponse.text();
          throw new Error(`Upload failed: ${errorText}`);
        }

        const data = await uploadResponse.json();
        uploadedImages.push(data.url);
      }

      if (uploadedImages.length > 0) {
        setNewMemory(prev => ({
          ...prev,
          images: [...prev.images, ...uploadedImages]
        }));
      }
    } catch (error) {
      console.error('❌ Upload failed:', error);
      alert('Failed to upload images. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleAddMemory = () => {
    if (!newMemory.text.trim() || !newMemory.author.trim()) {
      alert('Please fill in both your name and memory text.');
      return;
    }

    const memory: Memory = {
      id: Date.now().toString(),
      text: newMemory.text.trim(),
      author: newMemory.author.trim(),
      date: new Date().toISOString().split('T')[0],
      images: newMemory.images || [],
      likes: 0,
      isFeatured: false,
      createdAt: new Date().toISOString()
    };

    setMemories(prev => [memory, ...prev]);
    setNewMemory({ text: '', author: '', images: [] });
    setShowMemoryForm(false);
  };

  const handleDeleteMemory = (id: string) => {
    setMemories(prev => prev.filter(memory => memory.id !== id));
  };

  const handleToggleFeatured = (id: string) => {
    setMemories(prev => prev.map(memory =>
      memory.id === id ? { ...memory, isFeatured: !memory.isFeatured } : memory
    ));
  };

  const removeImageFromNewMemory = (index: number) => {
    setNewMemory(prev => ({
      ...prev,
      images: (prev.images || []).filter((_, i) => i !== index)
    }));
  };

  if (!hasInitialized) {
    return (
      <div className="max-w-4xl space-y-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="animate-pulse text-center py-8">Loading memory wall...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-6">
      {/* Header with Save Status */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">Memory Wall</h2>
          <p className="text-gray-600 mt-1">Manage shared memories and stories</p>
        </div>
        <div className="flex items-center gap-4">
          {/* Save Status Indicator */}
          {saveStatus === 'saving' && (
            <span className="text-sm text-blue-600 animate-pulse">Saving...</span>
          )}
          {saveStatus === 'success' && (
            <span className="text-sm text-green-600 flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              Saved
            </span>
          )}
          
          <div className="flex gap-3">
            <button
              onClick={() => setShowMemoryForm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full hover:from-amber-600 hover:to-orange-600 transition-all"
            >
              <Plus className="w-4 h-4" />
              Add Memory
            </button>
            <button
              onClick={handleManualSave}
              disabled={saving || !hasUnsavedChanges()}
              className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                hasUnsavedChanges() 
                  ? 'bg-green-500 text-white hover:bg-green-600' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <Save className="w-4 h-4" />
              {saving ? 'Saving...' : 'Save All'}
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 text-center">
          <div className="text-2xl font-bold text-gray-800">{stats.total}</div>
          <div className="text-sm text-gray-600">Total Memories</div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 text-center">
          <div className="text-2xl font-bold text-gray-800">{stats.featured}</div>
          <div className="text-sm text-gray-600">Featured</div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 text-center">
          <div className="text-2xl font-bold text-gray-800">{stats.withImages}</div>
          <div className="text-sm text-gray-600">With Photos</div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 text-center">
          <div className="text-2xl font-bold text-gray-800">{stats.totalLikes}</div>
          <div className="text-sm text-gray-600">Total Likes</div>
        </div>
      </div>

      {/* Add Memory Form */}
      {showMemoryForm && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Share a Memory</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Your Name *</label>
              <input
                type="text"
                value={newMemory.author}
                onChange={(e) => setNewMemory(prev => ({ ...prev, author: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400"
                placeholder="Enter your name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Your Memory *</label>
              <textarea
                value={newMemory.text}
                onChange={(e) => setNewMemory(prev => ({ ...prev, text: e.target.value }))}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none"
                placeholder="Share your thoughts, stories, or memories..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Add Photos (Optional - max 3)
              </label>
              
              {newMemory.images && newMemory.images.length > 0 && (
                <div className="flex gap-3 mb-4 flex-wrap">
                  {newMemory.images.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image}
                        alt=""
                        className="w-16 h-16 object-cover rounded"
                      />
                      <button
                        onClick={() => removeImageFromNewMemory(index)}
                        className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {(!newMemory.images || newMemory.images.length < 3) && (
                <label className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-amber-400 transition-colors cursor-pointer block">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={uploading}
                  />
                  <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                  <p className="text-gray-500">
                    {uploading ? 'Uploading...' : 'Click to upload photos'}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Max 3 images, 5MB each
                  </p>
                </label>
              )}
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={handleAddMemory}
              disabled={!newMemory.text.trim() || !newMemory.author.trim()}
              className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
            >
              Share Memory
            </button>
            <button
              onClick={() => {
                setShowMemoryForm(false);
                setNewMemory({ text: '', author: '', images: [] });
              }}
              className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Memories List */}
      <div className="space-y-4">
        {memories.map((memory) => (
          <div key={memory.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-semibold text-gray-800">{memory.author}</h3>
                  {memory.isFeatured && (
                    <span className="px-2 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-medium">
                      Featured
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500">{memory.date}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleToggleFeatured(memory.id)}
                  className={`p-2 rounded-lg transition-colors ${
                    memory.isFeatured
                      ? 'bg-amber-100 text-amber-600'
                      : 'bg-gray-100 text-gray-600 hover:bg-amber-100 hover:text-amber-600'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${memory.isFeatured ? 'fill-current' : ''}`} />
                </button>
                <button
                  onClick={() => handleDeleteMemory(memory.id)}
                  className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-red-100 hover:text-red-600 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
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
                    alt=""
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                ))}
              </div>
            )}

            <div className="flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Heart className="w-4 h-4" />
                  <span>{memory.likes || 0} likes</span>
                </div>
              </div>
              <span>Added {new Date(memory.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        ))}
      </div>

      {memories.length === 0 && !showMemoryForm && (
        <div className="text-center py-12">
          <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">No memories shared yet</h3>
          <p className="text-gray-500 mb-4">Be the first to share a memory or invite others to contribute.</p>
          <button
            onClick={() => setShowMemoryForm(true)}
            className="px-6 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full hover:from-amber-600 hover:to-orange-600 transition-all"
          >
            Share First Memory
          </button>
        </div>
      )}
    </div>
  );
};