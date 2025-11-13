// Components/Dashboard/FavouriteSection.tsx - FIXED
import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Trash2, Edit2, Save } from 'lucide-react';
import { useMemorial } from '../../hooks/useMemorial';

interface Favorite {
  id: string;
  category: string; // Now stores the category name (e.g., 'food', 'music')
  icon: string; // Emoji for display in frontend
  question: string;
  answer: string;
}

// Debounce hook for auto-saving
const useDebounce = <T,>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

export const FavoritesSection: React.FC = () => {
  const { memorialData, updateFavorites, saveToBackend } = useMemorial();
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [editingFavorite, setEditingFavorite] = useState<Favorite | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);

  const debouncedFavorites = useDebounce(favorites, 1000);

  // Updated icon options with category names that match backend
  const iconOptions = [
    { value: '🍕', label: 'Food', category: 'food' },
    { value: '🎵', label: 'Music', category: 'music' },
    { value: '🎬', label: 'Movies', category: 'movie' },
    { value: '📚', label: 'Books', category: 'book' },
    { value: '⚽', label: 'Sports', category: 'sport' },
    { value: '✈️', label: 'Travel', category: 'travel' },
    { value: '🎨', label: 'Hobbies', category: 'hobby' },
    { value: '🐾', label: 'Animals', category: 'animal' },
    { value: '🏖️', label: 'Places', category: 'place' },
    { value: '☕', label: 'Drinks', category: 'drink' },
    { value: '🌸', label: 'Flowers', category: 'flower' },
    { value: '🎭', label: 'Activities', category: 'hobby' },
    { value: '🎶', label: 'Songs', category: 'song' },
    { value: '🌈', label: 'Colors', category: 'color' },
    { value: '🎄', label: 'Holidays', category: 'holiday' },
    { value: '🌞', label: 'Seasons', category: 'season' },
  ];

  // Migrate old emoji-based categories to new category names
  const migrateOldFavorites = (oldFavorites: Favorite[]): Favorite[] => {
    const emojiToCategoryMap: Record<string, string> = {
      '🍕': 'food',
      '🎵': 'music',
      '🎬': 'movie',
      '📚': 'book',
      '⚽': 'sport',
      '✈️': 'travel',
      '🎨': 'hobby',
      '🐾': 'animal',
      '🏖️': 'place',
      '☕': 'drink',
      '🌸': 'flower',
      '🎭': 'hobby',
      '🎶': 'song',
      '🌈': 'color',
      '🎄': 'holiday',
      '🌞': 'season',
      '❤️': 'memory',
    };

    return oldFavorites.map(fav => {
      // If category is already a proper category name (not 'personal'), keep it
      const validCategories = ['food', 'drink', 'movie', 'book', 'song', 'music', 'hobby', 
        'sport', 'travel', 'place', 'flower', 'animal', 'season', 'holiday', 'color', 'memory'];
      
      if (validCategories.includes(fav.category?.toLowerCase())) {
        return fav;
      }

      // Try to migrate based on icon emoji
      const migratedCategory = emojiToCategoryMap[fav.icon] || 'memory';
      
      return {
        ...fav,
        category: migratedCategory,
        icon: fav.icon || '⭐' // Keep the original icon
      };
    });
  };

  // Initialize with memorial data from backend (only once)
  useEffect(() => {
    if (memorialData?.favorites && !hasInitialized) {
      const migratedFavorites = migrateOldFavorites((memorialData.favorites || []) as Favorite[]);
      setFavorites(migratedFavorites);
      setHasInitialized(true);
      
      // Auto-save migrated data if changes were made
      const needsMigration = JSON.stringify(migratedFavorites) !== JSON.stringify(memorialData.favorites);
      if (needsMigration && migratedFavorites.length > 0) {
        console.log('Migrating old favorites data to new format...');
        updateFavorites(migratedFavorites);
      }
    }
  }, [memorialData, hasInitialized, updateFavorites]);

  // Memoize the comparison function
  const hasChanges = useCallback((currentFavorites: Favorite[]) => {
    if (!memorialData?.favorites) return currentFavorites.length > 0;
    return JSON.stringify(currentFavorites) !== JSON.stringify(memorialData.favorites);
  }, [memorialData]);

  // Auto-save debounced changes
  useEffect(() => {
    if (hasInitialized && hasChanges(debouncedFavorites)) {
      updateFavorites(debouncedFavorites);
    }
  }, [debouncedFavorites, hasInitialized, hasChanges, updateFavorites]);

  // Warn about unsaved changes
  useEffect(() => {
    const hasUnsavedChanges = hasChanges(favorites);
    
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [favorites, hasChanges]);

  const handleAddFavorite = () => {
    setEditingFavorite({
      id: 'new-' + Date.now(),
      category: 'food', // Default category
      icon: '🍕', // Default emoji
      question: '',
      answer: ''
    });
    setShowForm(true);
  };

  const handleIconSelect = (iconOption: typeof iconOptions[0]) => {
    setEditingFavorite(prev => prev ? {
      ...prev,
      icon: iconOption.value,
      category: iconOption.category
    } : null);
  };

  const handleSaveFavorite = () => {
    if (!editingFavorite) return;

    let newFavorites: Favorite[];
    if (editingFavorite.id.startsWith('new-')) {
      newFavorites = [...favorites, { ...editingFavorite, id: Date.now().toString() }];
    } else {
      newFavorites = favorites.map(f => f.id === editingFavorite.id ? editingFavorite : f);
    }
    
    setFavorites(newFavorites);
    setShowForm(false);
    setEditingFavorite(null);
  };

  const handleDeleteFavorite = (id: string) => {
    const newFavorites = favorites.filter(f => f.id !== id);
    setFavorites(newFavorites);
  };

  const handleManualSave = async () => {
    setSaving(true);
    try {
      await updateFavorites(favorites);
      await saveToBackend();
      alert('Favorites saved successfully!');
    } catch (error) {
      console.error('Error saving favorites:', error);
      alert('Failed to save favorites. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // Show loading state while initializing
  if (!hasInitialized && !memorialData) {
    return (
      <div className="max-w-6xl space-y-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="animate-pulse text-center py-8">Loading favorites data...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">Favorites & Personality</h2>
          <p className="text-gray-600 mt-1">Share their favorite things and personality traits</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleAddFavorite}
            className="flex items-center gap-2 px-4 py-2 bg-linear-to-r from-amber-500 to-orange-500 text-white rounded-full hover:from-amber-600 hover:to-orange-600 transition-all"
          >
            <Plus className="w-4 h-4" />
            Add Favorite
          </button>
          <button
            onClick={handleManualSave}
            disabled={saving || !hasChanges(favorites)}
            className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-all disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save All'}
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 text-center">
          <div className="text-2xl font-bold text-gray-800">{favorites.length}</div>
          <div className="text-sm text-gray-600">Total Favorites</div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 text-center">
          <div className="text-2xl font-bold text-gray-800">
            {new Set(favorites.map(f => f.category)).size}
          </div>
          <div className="text-sm text-gray-600">Categories</div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 text-center">
          <div className="text-2xl font-bold text-gray-800">
            {favorites.filter(f => f.question && f.answer).length}
          </div>
          <div className="text-sm text-gray-600">Complete</div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 text-center">
          <div className="text-2xl font-bold text-gray-800">
            {favorites.filter(f => !f.question || !f.answer).length}
          </div>
          <div className="text-sm text-gray-600">Need Info</div>
        </div>
      </div>

      {/* Favorite Form */}
      {showForm && editingFavorite && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            {editingFavorite.id.startsWith('new-') ? 'Add Favorite' : 'Edit Favorite'}
          </h3>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Icon & Category</label>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
              {iconOptions.map(iconOption => (
                <button
                  key={iconOption.category + iconOption.value}
                  type="button"
                  onClick={() => handleIconSelect(iconOption)}
                  className={`p-3 rounded-lg border-2 text-center transition-all ${
                    editingFavorite.icon === iconOption.value && editingFavorite.category === iconOption.category
                      ? 'border-amber-500 bg-amber-50'
                      : 'border-gray-200 hover:border-amber-300'
                  }`}
                >
                  <span className="text-2xl">{iconOption.value}</span>
                  <div className="text-xs text-gray-600 mt-1">{iconOption.label}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Question</label>
            <input
              type="text"
              value={editingFavorite.question}
              onChange={(e) => setEditingFavorite(prev => prev ? { ...prev, question: e.target.value } : null)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400"
              placeholder="e.g., Favorite childhood memory?"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Answer</label>
            <textarea
              value={editingFavorite.answer}
              onChange={(e) => setEditingFavorite(prev => prev ? { ...prev, answer: e.target.value } : null)}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none"
              placeholder="The answer or story..."
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleSaveFavorite}
              disabled={!editingFavorite.question.trim() || !editingFavorite.answer.trim()}
              className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Save Favorite
            </button>
            <button
              onClick={() => {
                setShowForm(false);
                setEditingFavorite(null);
              }}
              className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Favorites Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {favorites.map((favorite) => (
          <div key={favorite.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <span className="text-3xl">{favorite.icon}</span>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setEditingFavorite(favorite);
                    setShowForm(true);
                  }}
                  className="p-1 text-gray-400 hover:text-amber-600 transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteFavorite(favorite.id)}
                  className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <h3 className="font-semibold text-gray-800 mb-2 text-lg">{favorite.question}</h3>
            <p className="text-gray-700 leading-relaxed">{favorite.answer}</p>
            <div className="mt-2 text-xs text-gray-500 capitalize">Category: {favorite.category}</div>
          </div>
        ))}
      </div>

      {favorites.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-linear-to-br from-amber-400 to-orange-400 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl text-white">❤️</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-600 mb-2">No favorites added yet</h3>
          <p className="text-gray-500 mb-4">Share their personality through their favorite things and memories.</p>
          <button
            onClick={handleAddFavorite}
            className="px-6 py-2 bg-linear-to-r from-amber-500 to-orange-500 text-white rounded-full hover:from-amber-600 hover:to-orange-600 transition-all"
          >
            Add First Favorite
          </button>
        </div>
      )}
    </div>
  );
};