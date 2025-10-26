// Components/Dashboard/FamilyTreeSection.tsx - COMPLETE
import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Upload, Save } from 'lucide-react';
import { useMemorial } from '../../hooks/useMemorial';

interface FamilyMember {
  id: string;
  name: string;
  image?: string;
  relation: string;
}

export const FamilyTreeSection: React.FC = () => {
  const { memorialData, updateFamilyTree, saveToBackend } = useMemorial();
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [editingMember, setEditingMember] = useState<FamilyMember | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Initialize with memorial data from backend
  useEffect(() => {
    if (memorialData?.familyTree) {
      setMembers(memorialData.familyTree as FamilyMember[]);
    }
  }, [memorialData]);

  const relationOptions = [
    'Father', 'Mother', 'Spouse', 'Son', 'Daughter', 'Brother', 'Sister',
    'Grandfather', 'Grandmother', 'Grandson', 'Granddaughter', 'Uncle', 'Aunt',
    'Cousin', 'Nephew', 'Niece', 'Father-in-law', 'Mother-in-law'
  ];

  const handleAddMember = () => {
    setEditingMember({
      id: 'new-' + Date.now(),
      name: '',
      relation: 'Spouse'
    });
    setShowForm(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingMember) return;

    console.log("🖼️ Uploading family member image...");

    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB');
      return;
    }

    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    setUploading(true);

    try {
      // Get token from localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token not found. Please log in again.');
      }

      // Upload directly to your backend, which will handle ImageKit upload
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'memorials/family');

      const uploadResponse = await fetch('https://wings-of-memories-backend.onrender.com/api/imagekit/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData,
      });

      if (!uploadResponse.ok) {
        const errorText = await uploadResponse.text();
        console.error("❌ Upload error response:", errorText);
        
        if (uploadResponse.status === 401 || uploadResponse.status === 403) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          throw new Error('Session expired. Please log in again.');
        }
        
        throw new Error(`Upload failed (${uploadResponse.status}): ${errorText}`);
      }

      const data = await uploadResponse.json();
      console.log("✅ Family image upload success:", data);

      setEditingMember(prev => prev ? { ...prev, image: data.url } : null);
      alert('✅ Image uploaded successfully!');
    } catch (error) {
      console.error('❌ Upload failed:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleSaveMember = async () => {
    if (!editingMember || !editingMember.name.trim()) {
      alert('Please enter a name for the family member.');
      return;
    }

    let newMembers: FamilyMember[];
    if (editingMember.id.startsWith('new-')) {
      newMembers = [...members, { ...editingMember, id: Date.now().toString() }];
    } else {
      newMembers = members.map(m => m.id === editingMember.id ? editingMember : m);
    }
    
    setMembers(newMembers);
    setShowForm(false);
    setEditingMember(null);
    
    // Save to backend
    setSaving(true);
    try {
      await updateFamilyTree(newMembers);
      await saveToBackend();
    } catch (error) {
      console.error('Error saving family tree:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteMember = async (id: string) => {
    const newMembers = members.filter(m => m.id !== id);
    setMembers(newMembers);
    
    // Save to backend
    setSaving(true);
    try {
      await updateFamilyTree(newMembers);
      await saveToBackend();
    } catch (error) {
      console.error('Error deleting family member:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleManualSave = async () => {
    setSaving(true);
    try {
      await updateFamilyTree(members);
      await saveToBackend();
      alert('Family tree saved successfully!');
    } catch (error) {
      console.error('Error saving family tree:', error);
      alert('Failed to save family tree. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-6xl space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">Family Tree</h2>
          <p className="text-gray-600 mt-1">Add family members and their relationships</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleAddMember}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full hover:from-amber-600 hover:to-orange-600 transition-all"
          >
            <Plus className="w-4 h-4" />
            Add Family Member
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
          <div className="text-2xl font-bold text-gray-800">{members.length}</div>
          <div className="text-sm text-gray-600">Total Members</div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 text-center">
          <div className="text-2xl font-bold text-gray-800">
            {new Set(members.map(m => m.relation)).size}
          </div>
          <div className="text-sm text-gray-600">Relationships</div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 text-center">
          <div className="text-2xl font-bold text-gray-800">
            {members.filter(m => m.image).length}
          </div>
          <div className="text-sm text-gray-600">With Photos</div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 text-center">
          <div className="text-2xl font-bold text-gray-800">
            {members.filter(m => !m.image).length}
          </div>
          <div className="text-sm text-gray-600">Need Photos</div>
        </div>
      </div>

      {/* Member Form */}
      {showForm && editingMember && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            {editingMember.id.startsWith('new-') ? 'Add Family Member' : 'Edit Family Member'}
          </h3>
          
          <div className="flex flex-col md:flex-row gap-6 mb-6">
            {/* Image Upload */}
            <div className="flex-shrink-0">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg bg-gray-200 mb-4">
                {editingMember.image ? (
                  <img 
                    src={editingMember.image} 
                    alt="Preview" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <span className="text-4xl">👤</span>
                  </div>
                )}
              </div>
              <label className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer text-sm">
                <Upload className="w-4 h-4" />
                <span>{uploading ? 'Uploading...' : 'Upload Photo'}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={uploading}
                />
              </label>
              <p className="text-xs text-gray-500 mt-2">Optional: Add a photo</p>
            </div>

            {/* Form Fields */}
            <div className="flex-1 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                <input
                  type="text"
                  value={editingMember.name}
                  onChange={(e) => setEditingMember(prev => prev ? { ...prev, name: e.target.value } : null)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400"
                  placeholder="Enter full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Relationship</label>
                <select
                  value={editingMember.relation}
                  onChange={(e) => setEditingMember(prev => prev ? { ...prev, relation: e.target.value } : null)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400"
                >
                  {relationOptions.map(relation => (
                    <option key={relation} value={relation}>{relation}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleSaveMember}
              disabled={!editingMember.name.trim()}
              className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Save Member
            </button>
            <button
              onClick={() => {
                setShowForm(false);
                setEditingMember(null);
              }}
              className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Family Members Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {members.map((member) => (
          <div key={member.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 text-center hover:shadow-md transition-shadow">
            <div className="relative inline-block mb-4">
              <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-lg bg-gray-200 mx-auto">
                {member.image ? (
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <span className="text-2xl">👤</span>
                  </div>
                )}
              </div>
              <div className="absolute -top-2 -right-2 flex gap-1">
                <button
                  onClick={() => {
                    setEditingMember(member);
                    setShowForm(true);
                  }}
                  className="p-1 bg-amber-500 text-white rounded-full hover:bg-amber-600 transition-colors"
                >
                  <Edit2 className="w-3 h-3" />
                </button>
                <button
                  onClick={() => handleDeleteMember(member.id)}
                  className="p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
            <h3 className="font-semibold text-gray-800 mb-1">{member.name}</h3>
            <p className="text-sm text-amber-600 font-medium">{member.relation}</p>
          </div>
        ))}
      </div>

      {members.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-400 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl text-white">👨‍👩‍👧‍👦</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-600 mb-2">No family members added yet</h3>
          <p className="text-gray-500 mb-4">Build the family tree by adding relatives and their relationships.</p>
          <button
            onClick={handleAddMember}
            className="px-6 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full hover:from-amber-600 hover:to-orange-600 transition-all"
          >
            Add First Family Member
          </button>
        </div>
      )}
    </div>
  );
};