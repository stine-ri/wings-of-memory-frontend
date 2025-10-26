// Components/Dashboard/TimeLineSection.tsx - COMPLETE
import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Calendar, MapPin, Save } from 'lucide-react';
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

export const TimelineSection: React.FC = () => {
  const { memorialData, updateTimeline, saveToBackend } = useMemorial();
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [editingEvent, setEditingEvent] = useState<TimelineEvent | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  // Initialize with memorial data
  useEffect(() => {
    if (memorialData?.timeline) {
      setEvents(memorialData.timeline as TimelineEvent[]);
    }
  }, [memorialData]);

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

  const handleSaveEvent = async () => {
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
    
    // Save to backend
    setSaving(true);
    try {
      await updateTimeline(newEvents);
      await saveToBackend();
    } catch (error) {
      console.error('Error saving timeline:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteEvent = async (id: string) => {
    const newEvents = events.filter(e => e.id !== id);
    setEvents(newEvents);
    
    // Save to backend
    setSaving(true);
    try {
      await updateTimeline(newEvents);
      await saveToBackend();
    } catch (error) {
      console.error('Error deleting event:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleManualSave = async () => {
    setSaving(true);
    try {
      await updateTimeline(events);
      await saveToBackend();
    } catch (error) {
      console.error('Error saving timeline:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">Life Timeline</h2>
          <p className="text-gray-600 mt-1">Chronicle the important moments and milestones</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleAddEvent}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full hover:from-amber-600 hover:to-orange-600 transition-all"
          >
            <Plus className="w-4 h-4" />
            Add Event
          </button>
          <button
            onClick={handleManualSave}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-all disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>

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
                onChange={(e) => setEditingEvent(prev => prev ? { ...prev, year: parseInt(e.target.value) } : null)}
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
              value={editingEvent.location}
              onChange={(e) => setEditingEvent(prev => prev ? { ...prev, location: e.target.value } : null)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400"
              placeholder="e.g., New York, NY"
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleSaveEvent}
              className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              Save Event
            </button>
            <button
              onClick={() => {
                setShowForm(false);
                setEditingEvent(null);
              }}
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
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteEvent(event.id)}
                    className="p-2 text-gray-400 hover:text-red-600 transition-colors"
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