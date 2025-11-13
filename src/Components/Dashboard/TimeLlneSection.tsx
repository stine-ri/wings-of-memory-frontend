// Components/Dashboard/TimeLineSection.tsx - COMPLETE
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Plus, Trash2, Edit2, Calendar, MapPin, Save, RotateCcw } from 'lucide-react';
import { useMemorial } from '../../hooks/useMemorial';

interface TimelineEvent {
  id: string;
  year: number;
  date: string;
  title: string;
  description: string;
  location?: string;
  icon: string;
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

export const TimelineSection: React.FC = () => {
  const { memorialData, updateTimeline, saveToBackend } = useMemorial();
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [editingEvent, setEditingEvent] = useState<TimelineEvent | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  
  // Store original data for reset functionality
  const originalEvents = useRef<TimelineEvent[]>([]);

  const debouncedEvents = useDebounce(events, 1500); // Increased debounce time

  // Initialize with memorial data (only once) - PRESERVE INITIAL DATA
  useEffect(() => {
    if (memorialData?.timeline && !hasInitialized) {
      const initialEvents = memorialData.timeline as TimelineEvent[];
      setEvents(initialEvents);
      originalEvents.current = JSON.parse(JSON.stringify(initialEvents)); // Deep copy
      setHasInitialized(true);
      setHasUnsavedChanges(false);
    }
  }, [memorialData, hasInitialized]);

  // Enhanced comparison function with better change detection
  const hasChanges = useCallback((currentEvents: TimelineEvent[]) => {
    if (!memorialData?.timeline) return currentEvents.length > 0;
    
    const currentString = JSON.stringify(currentEvents);
    const originalString = JSON.stringify(originalEvents.current);
    
    return currentString !== originalString;
  }, [memorialData]);

  // Track changes in real-time
  useEffect(() => {
    if (hasInitialized) {
      setHasUnsavedChanges(hasChanges(events));
    }
  }, [events, hasInitialized, hasChanges]);

  // Auto-save debounced changes - ONLY IF THERE ARE ACTUAL CHANGES
  useEffect(() => {
    if (hasInitialized && hasUnsavedChanges && hasChanges(debouncedEvents)) {
      handleAutoSave();
    }
  }, [debouncedEvents, hasInitialized, hasUnsavedChanges]);

  const handleAutoSave = async () => {
    if (!hasUnsavedChanges) return;
    
    try {
      await updateTimeline(debouncedEvents);
      // Update original reference after successful save
      originalEvents.current = JSON.parse(JSON.stringify(debouncedEvents));
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error('Error auto-saving timeline:', error);
    }
  };

  // Enhanced reset functionality
  const handleResetChanges = () => {
    if (window.confirm('Are you sure you want to reset all changes? This cannot be undone.')) {
      setEvents(JSON.parse(JSON.stringify(originalEvents.current))); // Deep copy
      setHasUnsavedChanges(false);
      setShowForm(false);
      setEditingEvent(null);
    }
  };

  // Warn about unsaved changes - IMPROVED
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  const iconOptions = [
    { value: 'baby', label: '👶 Baby', emoji: '👶' },
    { value: 'graduation', label: '🎓 Graduation', emoji: '🎓' },
    { value: 'heart', label: '❤️ Love', emoji: '❤️' },
    { value: 'work', label: '💼 Work', emoji: '💼' },
    { value: 'travel', label: '✈️ Travel', emoji: '✈️' },
    { value: 'home', label: '🏠 Home', emoji: '🏠' },
  ];

  const handleAddEvent = () => {
    setEditingEvent({
      id: 'new-' + Date.now(),
      year: new Date().getFullYear(),
      date: '',
      title: '',
      description: '',
      location: '',
      icon: 'heart'
    });
    setShowForm(true);
  };

  const handleSaveEvent = () => {
    if (!editingEvent) return;

    let newEvents: TimelineEvent[];
    if (editingEvent.id.startsWith('new-')) {
      newEvents = [...events, { ...editingEvent, id: Date.now().toString() }];
    } else {
      newEvents = events.map(e => e.id === editingEvent.id ? editingEvent : e);
    }
    
    setEvents(newEvents);
    setShowForm(false);
    setEditingEvent(null);
  };

  const handleDeleteEvent = (id: string) => {
    if (window.confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
      const newEvents = events.filter(e => e.id !== id);
      setEvents(newEvents);
    }
  };

  const handleManualSave = async () => {
    if (!hasUnsavedChanges) return;
    
    setSaving(true);
    try {
      await updateTimeline(events);
      await saveToBackend();
      // Update original reference after successful manual save
      originalEvents.current = JSON.parse(JSON.stringify(events));
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error('Error saving timeline:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    if (editingEvent && editingEvent.id.startsWith('new-')) {
      // New event - just close form
      setShowForm(false);
      setEditingEvent(null);
    } else if (editingEvent) {
      // Editing existing event - check if there are changes
      const originalEvent = events.find(e => e.id === editingEvent.id);
      const hasEventChanges = originalEvent && JSON.stringify(originalEvent) !== JSON.stringify(editingEvent);
      
      if (hasEventChanges) {
        if (window.confirm('You have unsaved changes in this event. Are you sure you want to cancel?')) {
          setShowForm(false);
          setEditingEvent(null);
        }
      } else {
        setShowForm(false);
        setEditingEvent(null);
      }
    } else {
      setShowForm(false);
      setEditingEvent(null);
    }
  };

  // Show loading state while initializing
  if (!hasInitialized && !memorialData) {
    return (
      <div className="max-w-4xl space-y-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="animate-pulse text-center py-8">Loading timeline data...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">Life Timeline</h2>
          <p className="text-gray-600 mt-1">Chronicle the important moments and milestones</p>
        </div>
        <div className="flex gap-3">
          {hasUnsavedChanges && (
            <button
              onClick={handleResetChanges}
              className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-full hover:bg-gray-600 transition-all"
              title="Reset all changes"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>
          )}
          <button
            onClick={handleAddEvent}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full hover:from-amber-600 hover:to-orange-600 transition-all"
          >
            <Plus className="w-4 h-4" />
            Add Event
          </button>
          <button
            onClick={handleManualSave}
            disabled={saving || !hasUnsavedChanges}
            className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>

      {/* Unsaved Changes Indicator */}
      {hasUnsavedChanges && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-amber-800">
            <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
            <span className="font-medium">You have unsaved changes</span>
          </div>
        </div>
      )}

      {/* Event Form */}
      {showForm && editingEvent && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            {editingEvent.id.startsWith('new-') ? 'Add New Event' : 'Edit Event'}
          </h3>
          
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
              <input
                type="number"
                value={editingEvent.year}
                onChange={(e) => setEditingEvent(prev => prev ? { ...prev, year: parseInt(e.target.value) || 0 } : null)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400"
                min="1900"
                max="2100"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date Display</label>
              <input
                type="text"
                value={editingEvent.date}
                onChange={(e) => setEditingEvent(prev => prev ? { ...prev, date: e.target.value } : null)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400"
                placeholder="e.g., March 15, 1950"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Event Icon</label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {iconOptions.map(icon => (
                <button
                  key={icon.value}
                  type="button"
                  onClick={() => setEditingEvent(prev => prev ? { ...prev, icon: icon.value } : null)}
                  className={`p-3 rounded-lg border-2 text-center transition-all ${
                    editingEvent.icon === icon.value
                      ? 'border-amber-500 bg-amber-50'
                      : 'border-gray-200 hover:border-amber-300'
                  }`}
                >
                  <span className="text-2xl">{icon.emoji}</span>
                  <div className="text-xs text-gray-600 mt-1">{icon.label.split(' ')[1]}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
            <input
              type="text"
              value={editingEvent.title}
              onChange={(e) => setEditingEvent(prev => prev ? { ...prev, title: e.target.value } : null)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400"
              placeholder="e.g., Graduation, Wedding, etc."
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              value={editingEvent.description}
              onChange={(e) => setEditingEvent(prev => prev ? { ...prev, description: e.target.value } : null)}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none"
              placeholder="Describe this important life event..."
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Location (Optional)</label>
            <input
              type="text"
              value={editingEvent.location || ''}
              onChange={(e) => setEditingEvent(prev => prev ? { ...prev, location: e.target.value } : null)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400"
              placeholder="e.g., New York, NY"
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleSaveEvent}
              disabled={!editingEvent.title.trim() || !editingEvent.year}
              className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Save Event
            </button>
            <button
              onClick={handleCancelEdit}
              className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Timeline Events */}
      <div className="space-y-4">
        {events
          .sort((a, b) => a.year - b.year)
          .map((event) => (
            <div key={event.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-400 rounded-full flex items-center justify-center text-white text-lg">
                    {iconOptions.find(icon => icon.value === event.icon)?.emoji || '❤️'}
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-semibold text-gray-800 text-lg">{event.title}</h3>
                      <span className="px-2 py-1 bg-amber-100 text-amber-800 rounded-full text-sm font-medium">
                        {event.year}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {event.date}
                      </div>
                      {event.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {event.location}
                        </div>
                      )}
                    </div>
                    <p className="text-gray-700">{event.description}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditingEvent(event);
                      setShowForm(true);
                    }}
                    className="p-2 text-gray-400 hover:text-amber-600 transition-colors"
                    title="Edit event"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteEvent(event.id)}
                    className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                    title="Delete event"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
      </div>

      {events.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">No timeline events yet</h3>
          <p className="text-gray-500 mb-4">Start building the life story by adding important milestones.</p>
          <button
            onClick={handleAddEvent}
            className="px-6 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full hover:from-amber-600 hover:to-orange-600 transition-all"
          >
            Add First Event
          </button>
        </div>
      )}
    </div>
  );
};