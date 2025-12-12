import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Plus, Trash2, Edit2, Upload, Save } from 'lucide-react';
import { useMemorial } from '../../hooks/useMemorial';

interface FamilyMember {
  id: string;
  name: string;
  image?: string;
  relation: string;
  isDeceased?: boolean;
  birthYear?: string;
  deathYear?: string;
}

interface RawFamilyMember {
  id?: string;
  name?: string;
  image?: string;
  relation?: string;
  isDeceased?: boolean;
  birthYear?: string;
  deathYear?: string;
}

export const FamilyTreeSection: React.FC = () => {
  const { memorialData, updateFamilyTree } = useMemorial();
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [editingMember, setEditingMember] = useState<FamilyMember | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);
  const [lastSavedMembers, setLastSavedMembers] = useState<FamilyMember[] | null>(null);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');

  // Use refs for better performance
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Safely initialize with memorial data from backend
  useEffect(() => {
    if (memorialData?.familyTree && !hasInitialized) {
      try {
        const familyTreeData = Array.isArray(memorialData.familyTree) 
          ? memorialData.familyTree 
          : [];
        
        const safeMembers = familyTreeData.map((member: RawFamilyMember) => ({
          id: member.id || crypto.randomUUID(),
          name: member.name || '',
          image: member.image || '',
          relation: member.relation || 'Spouse',
          isDeceased: member.isDeceased || false,
          birthYear: member.birthYear || '',
          deathYear: member.deathYear || ''
        })) as FamilyMember[];
        
        setMembers(safeMembers);
        setLastSavedMembers(safeMembers);
        setHasInitialized(true);
        
        console.log('✅ FamilyTree initialized with', safeMembers.length, 'members');
      } catch (error) {
        console.error('❌ Failed to initialize family tree:', error);
        setHasInitialized(true);
      }
    }
  }, [memorialData, hasInitialized]);

  // Check if we have unsaved changes (optimized)
  const hasUnsavedChanges = useCallback(() => {
    if (!lastSavedMembers) return members.length > 0;
    if (members.length !== lastSavedMembers.length) return true;
    return JSON.stringify(members) !== JSON.stringify(lastSavedMembers);
  }, [members, lastSavedMembers]);

  // Auto-save with debounce (only on actual changes)
  useEffect(() => {
    if (!hasInitialized || !hasUnsavedChanges()) return;

    // Clear any existing timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Set new timeout for auto-save
    saveTimeoutRef.current = setTimeout(async () => {
      try {
        console.log('💾 Auto-saving family tree...');
        await updateFamilyTree(members);
        setLastSavedMembers([...members]);
        setSaveStatus('success');
        setTimeout(() => setSaveStatus('idle'), 1000);
        console.log('✅ Auto-save completed');
      } catch (error) {
        console.error('❌ Auto-save failed:', error);
        setSaveStatus('error');
        setTimeout(() => setSaveStatus('idle'), 2000);
      }
    }, 2000); // Wait 2 seconds of inactivity before saving

    // Cleanup
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [members, hasInitialized, hasUnsavedChanges, updateFamilyTree]);

  // Manual save function
  const handleManualSave = async () => {
    if (saving || !hasUnsavedChanges()) return;
    
    setSaving(true);
    setSaveStatus('saving');
    
    try {
      console.log('💾 Manual save triggered');
      await updateFamilyTree(members);
      setLastSavedMembers([...members]);
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

  const relationOptions = [
    'Father', 'Mother', 'Spouse', 'Son', 'Daughter', 'Brother', 'Sister',
    'Grandfather', 'Grandmother', 'Grandson', 'Granddaughter', 'Uncle', 'Aunt',
    'Cousin', 'Nephew', 'Niece', 'Father-in-law', 'Mother-in-law', 'Self', 'Memorialized'
  ];

  const handleAddMember = () => {
    setEditingMember({
      id: 'new-' + Date.now(),
      name: '',
      relation: 'Spouse',
      isDeceased: false,
      birthYear: '',
      deathYear: ''
    });
    setShowForm(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingMember) return;

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
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Please log in again.');
      }

      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'memorials/family');

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
      setEditingMember(prev => prev ? { ...prev, image: data.url } : null);
    } catch (error) {
      console.error('❌ Upload failed:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleSaveMember = () => {
    if (!editingMember || !editingMember.name.trim()) {
      alert('Please enter a name for the family member.');
      return;
    }

    // Validate dates
    if (editingMember.isDeceased && editingMember.deathYear && editingMember.birthYear) {
      if (parseInt(editingMember.deathYear) < parseInt(editingMember.birthYear)) {
        alert('Death year must be after birth year.');
        return;
      }
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
  };

  const handleDeleteMember = (id: string) => {
    setMembers(prev => prev.filter(m => m.id !== id));
  };

  // Toggle deceased status
  const handleToggleDeceased = () => {
    if (editingMember) {
      const updatedMember = {
        ...editingMember,
        isDeceased: !editingMember.isDeceased
      };
      setEditingMember(updatedMember);
      
      // Clear death year if marking as not deceased
      if (!updatedMember.isDeceased) {
        setEditingMember(prev => prev ? { ...prev, deathYear: '' } : null);
      }
    }
  };

  // Calculate stats
  const stats = {
    total: members.length,
    deceased: members.filter(m => m.isDeceased).length,
    living: members.filter(m => !m.isDeceased).length,
    relationships: new Set(members.map(m => m.relation)).size,
    withPhotos: members.filter(m => m.image).length,
    needsPhotos: members.filter(m => !m.image).length
  };

  if (!hasInitialized) {
    return (
      <div className="max-w-6xl space-y-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="animate-pulse text-center py-8">Loading family tree...</div>
        </div>
      </div>
      
    );
  }

  return (
    <div className="max-w-6xl space-y-6">
      {/* Header with Save Status */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">Family Tree</h2>
          <p className="text-gray-600 mt-1">Add family members and their relationships</p>
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
              onClick={handleAddMember}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full hover:from-amber-600 hover:to-orange-600 transition-all"
            >
              <Plus className="w-4 h-4" />
              Add Family Member
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
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 text-center">
          <div className="text-2xl font-bold text-gray-800">{stats.total}</div>
          <div className="text-sm text-gray-600">Total Members</div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{stats.living}</div>
          <div className="text-sm text-gray-600">Living</div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 text-center">
          <div className="text-2xl font-bold text-gray-600">{stats.deceased}</div>
          <div className="text-sm text-gray-600">Deceased</div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 text-center">
          <div className="text-2xl font-bold text-gray-800">{stats.relationships}</div>
          <div className="text-sm text-gray-600">Relationships</div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 text-center">
          <div className="text-2xl font-bold text-gray-800">{stats.withPhotos}</div>
          <div className="text-sm text-gray-600">With Photos</div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 text-center">
          <div className="text-2xl font-bold text-gray-800">{stats.needsPhotos}</div>
          <div className="text-sm text-gray-600">Need Photos</div>
        </div>
      </div>
{/* Important Reminder */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center">
            <span className="text-amber-600 text-sm">💡</span>
          </div>
          <div>
            <p className="text-amber-800 font-medium">Important: Include the Memorialized Person</p>
            <p className="text-amber-700 text-sm mt-1">
              Remember to add <strong>{memorialData?.name || "the deceased person"}</strong> to the family tree 
              with the relationship set to <strong>"Memorialized"</strong> (this means they are the deceased person 
              being honored on this memorial page). This helps visitors understand family connections.
            </p>
          </div>
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
            <div className="shrink-0">
              <div className={`w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg mb-4 ${
                editingMember.isDeceased ? 'bg-gray-200 opacity-75' : 'bg-gray-100'
              }`}>
                {editingMember.image ? (
                  <img 
                    src={editingMember.image} 
                    alt="Preview" 
                    className={`w-full h-full object-cover ${editingMember.isDeceased ? 'grayscale' : ''}`}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    {editingMember.isDeceased ? (
                      <span className="text-4xl">🕊️</span>
                    ) : (
                      <span className="text-4xl">👤</span>
                    )}
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

              {/* Deceased Toggle */}
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={editingMember.isDeceased || false}
                      onChange={handleToggleDeceased}
                      className="sr-only"
                    />
                    <div className={`w-12 h-6 rounded-full transition-colors duration-200 ${
                      editingMember.isDeceased ? 'bg-gray-700' : 'bg-gray-300'
                    }`}>
                      <div className={`w-5 h-5 bg-white rounded-full transform transition-transform duration-200 ${
                        editingMember.isDeceased ? 'translate-x-7' : 'translate-x-1'
                      }`}></div>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {editingMember.isDeceased ? 'Deceased' : 'Living'}
                  </span>
                </label>
                
                {editingMember.isDeceased && (
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    <span className="w-2 h-2 bg-gray-600 rounded-full"></span>
                    Will appear in "In Loving Memory" section
                  </span>
                )}
              </div>

              {/* Birth Year */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Birth Year (Optional)</label>
                <input
                  type="text"
                  value={editingMember.birthYear || ''}
                  onChange={(e) => setEditingMember(prev => prev ? { ...prev, birthYear: e.target.value } : null)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400"
                  placeholder="e.g., 1950"
                  maxLength={4}
                />
              </div>

              {/* Death Year (only for deceased) */}
              {editingMember.isDeceased && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Death Year (Optional)</label>
                  <input
                    type="text"
                    value={editingMember.deathYear || ''}
                    onChange={(e) => setEditingMember(prev => prev ? { ...prev, deathYear: e.target.value } : null)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400"
                    placeholder="e.g., 2023"
                    maxLength={4}
                  />
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleSaveMember}
              disabled={!editingMember.name.trim()}
              className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
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
          <div key={member.id} className={`bg-white rounded-2xl shadow-sm border border-gray-200 p-6 text-center hover:shadow-md transition-shadow relative ${
            member.isDeceased ? 'opacity-90' : ''
          }`}>
            {/* Deceased Indicator */}
            {member.isDeceased && (
              <div className="absolute top-2 right-2 bg-gray-800 text-white text-xs px-2 py-1 rounded-full">
                ✝ Deceased
              </div>
            )}
            
            <div className="relative inline-block mb-4">
              <div className={`w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-lg mx-auto ${
                member.isDeceased ? 'bg-gray-200' : 'bg-gray-100'
              }`}>
                {member.image ? (
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    className={`w-full h-full object-cover ${member.isDeceased ? 'grayscale' : ''}`}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    {member.isDeceased ? (
                      <span className="text-2xl">🕊️</span>
                    ) : (
                      <span className="text-2xl">👤</span>
                    )}
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
            
            {/* Years Information */}
            {(member.birthYear || member.deathYear) && (
              <p className="text-xs text-gray-500 mt-2">
                {member.birthYear && member.deathYear 
                  ? `${member.birthYear} - ${member.deathYear}`
                  : member.birthYear 
                    ? `Born ${member.birthYear}`
                    : `Passed ${member.deathYear}`
                }
              </p>
            )}
          </div>
        ))}
      </div>

      {members.length === 0 && !showForm && (
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