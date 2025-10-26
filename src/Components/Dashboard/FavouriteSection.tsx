// Components/Dashboard/FavouriteSection.tsx - COMPLETE
import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Save } from 'lucide-react';
import { useMemorial } from '../../hooks/useMemorial';

interface Favorite {
  id: string;
  category: string;
  icon: string;
  question: string;
  answer: string;
}

export const FavoritesSection: React.FC = () => {
  const { memorialData, updateFavorites, saveToBackend } = useMemorial();
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [editingFavorite, setEditingFavorite] = useState<Favorite | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  // Initialize with memorial data from backend
  useEffect(() => {
    if (memorialData?.favorites) {
      setFavorites(memorialData.favorites as Favorite[]);
    }
  }, [memorialData]);

  const iconOptions = [
    { value: '🍕', label: 'Food' },
    { value: '🎵', label: 'Music' },
    { value: '🎬', label: 'Movies' },
    { value: '📚', label: 'Books' },
    { value: '⚽', label: 'Sports' },
    { value: '✈️', label: 'Travel' },
    { value: '🎨', label: 'Art' },
    { value: '🐾', label: 'Animals' },
    { value: '🎮', label: 'Games' },
    { value: '☕', label: 'Drinks' },
    { value: '🏡', label: 'Home' },
    { value: '🎭', label: 'Hobbies' },
  ];

  const handleAddFavorite = () => {
    setEditingFavorite({
      id: 'new-' + Date.now(),
      category: 'personal',
      icon: '❤️',
      question: '',
      answer: ''
    });
    setShowForm(true);
  };

  const handleSaveFavorite = async () => {
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
    
    // Save to backend
    setSaving(true);
    try {
      await updateFavorites(newFavorites);
      await saveToBackend();
    } catch (error) {
      console.error('Error saving favorites:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteFavorite = async (id: string) => {
    const newFavorites = favorites.filter(f => f.id !== id);
    setFavorites(newFavorites);
    
    // Save to backend
    setSaving(true);
    try {
      await updateFavorites(newFavorites);
      await saveToBackend();
    } catch (error) {
      console.error('Error deleting favorite:', error);
    } finally {
      setSaving(false);
    }
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
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full hover:from-amber-600 hover:to-orange-600 transition-all"
          >
            <Plus className="w-4 h-4" />
            Add Favorite
          </button>
          <button
            onClick={handleManualSave}
            disabled={saving}
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
            <label className="block text-sm font-medium text-gray-700 mb-2">Icon</label>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
              {iconOptions.map(icon => (
                <button
                  key={icon.value}
                  onClick={() => setEditingFavorite(prev => prev ? { ...prev, icon: icon.value } : null)}
                  className={`p-3 rounded-lg border-2 text-center transition-all ${
                    editingFavorite.icon === icon.value
                      ? 'border-amber-500 bg-amber-50'
                      : 'border-gray-200 hover:border-amber-300'
                  }`}
                >
                  <span className="text-2xl">{icon.value}</span>
                  <div className="text-xs text-gray-600 mt-1">{icon.label}</div>
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
          </div>
        ))}
      </div>

      {favorites.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-400 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl text-white">❤️</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-600 mb-2">No favorites added yet</h3>
          <p className="text-gray-500 mb-4">Share their personality through their favorite things and memories.</p>
          <button
            onClick={handleAddFavorite}
            className="px-6 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full hover:from-amber-600 hover:to-orange-600 transition-all"
          >
            Add First Favorite
          </button>
        </div>
      )}
    </div>
  );
};