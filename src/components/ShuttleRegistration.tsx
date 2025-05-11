import React, { useState, useEffect } from 'react';
import { useShuttle } from '../context/ShuttleContext';
import ShuttleCard from './ShuttleCard';
import RegistrationForm from './RegistrationForm';
import { Trash2, ChevronDown, ChevronUp, Edit3, Info as InfoIcon } from 'lucide-react';

// Define colors (ideally from a central theme file)
const GSB_RED = '#8C1515';
const WARM_NEUTRAL_LIGHT = '#FBF9F6';
const WARM_NEUTRAL_DARK = '#4A4A4A';
const GOLD_ACCENT = '#B08D57';

// Define a type for the information needed for editing
interface EditingRegistrationInfo {
  shuttleId: string;
  registrationId: string;
  currentName: string;
  currentGuests: number;
}

const ShuttleRegistration: React.FC = () => {
  const { shuttles, removeRegistration, updateRegistration } = useShuttle();

  // Log shuttles data when it changes or on render
  useEffect(() => {
    console.log('[ShuttleRegistration] Shuttles received from context (useEffect):', JSON.parse(JSON.stringify(shuttles)));
    if (shuttles && shuttles.length > 0) {
      console.log('[ShuttleRegistration] Details of first shuttle:', JSON.parse(JSON.stringify(shuttles[0])));
    }
  }, [shuttles]);

  const [selectedShuttleId, setSelectedShuttleId] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<{shuttleId: string, registrationId: string} | null>(null);
  const [registrationsExpanded, setRegistrationsExpanded] = useState(false);
  const [expandedShuttleTimes, setExpandedShuttleTimes] = useState<{ [key: string]: boolean }>({});
  const [editingRegistrationInfo, setEditingRegistrationInfo] = useState<EditingRegistrationInfo | null>(null);
  const [editFormData, setEditFormData] = useState({ name: '', guests: 0 });

  const toggleShuttleTimeExpansion = (shuttleId: string) => {
    setExpandedShuttleTimes(prev => ({
      ...prev,
      [shuttleId]: !prev[shuttleId]
    }));
  };

  const handleDeleteClick = (shuttleId: string, registrationId: string) => {
    setShowDeleteConfirm({ shuttleId, registrationId });
  };

  const confirmDelete = () => {
    if (showDeleteConfirm) {
      removeRegistration(showDeleteConfirm.shuttleId, showDeleteConfirm.registrationId);
      setShowDeleteConfirm(null);
    }
  };

  const handleEditClick = (shuttleId: string, registration: { id: string; name: string; guests: number }) => {
    setEditingRegistrationInfo({
      shuttleId,
      registrationId: registration.id,
      currentName: registration.name,
      currentGuests: registration.guests,
    });
    setEditFormData({ name: registration.name, guests: registration.guests });
  };

  const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({ ...prev, [name]: name === 'guests' ? Number(value) : value }));
  };

  const handleSaveChanges = () => {
    if (!editingRegistrationInfo) return;

    const { shuttleId, registrationId } = editingRegistrationInfo;
    const { name, guests } = editFormData;

    if (name.trim() === '') {
      alert("Name cannot be empty.");
      return;
    }

    const selectedShuttle = shuttles.find(s => s.id === shuttleId);
    if (selectedShuttle) {
      const capacity = 28; // Assuming capacity is 28, consistent with RegistrationForm & ShuttleCard
      // Calculate current passengers on this shuttle, EXCLUDING the one being edited, then add the new count for this registration.
      const otherRegistrationsPassengers = selectedShuttle.registrations
        .filter(reg => reg.id !== registrationId)
        .reduce((sum, reg) => sum + reg.guests + 1, 0);
      
      const newTotalPassengersForThisBooking = guests + 1;
      if (otherRegistrationsPassengers + newTotalPassengersForThisBooking > capacity) {
        alert(`Updating to ${newTotalPassengersForThisBooking} passenger(s) would exceed the shuttle capacity of ${capacity}. Please select fewer guests or a different shuttle.`);
        return;
      }
    }

    updateRegistration(shuttleId, registrationId, name.trim(), guests);
    setEditingRegistrationInfo(null);
  };

  return (
    <div className="max-w-5xl mx-auto font-serif" style={{ color: WARM_NEUTRAL_DARK }}>
      <div className="mb-10 md:mb-12 text-center">
        <h2 className="text-4xl md:text-5xl font-light mb-3" style={{ color: GSB_RED }}>Shuttle Planner</h2>
        <p className="text-base md:text-lg font-normal">Limited capacity.</p>
      </div>

      {selectedShuttleId ? (
        <RegistrationForm 
          shuttleId={selectedShuttleId} 
          onCancel={() => setSelectedShuttleId(null)}
        />
      ) : (
        <>
          <div className="mb-12">
            <h3 className="text-2xl font-semibold text-center md:text-left mb-6" style={{ color: GSB_RED }}>Depart from GSB</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8">
              {shuttles.filter(s => s.type === 'arrival').map(shuttle => (
                <ShuttleCard
                  key={shuttle.id}
                  shuttle={shuttle}
                  onClick={() => setSelectedShuttleId(shuttle.id)}
                />
              ))}
            </div>
            {shuttles.filter(s => s.type === 'arrival').length === 0 && (
              <p className="italic text-center md:text-left opacity-70">(No arrival shuttles currently listed)</p>
            )}
          </div>

          <div className="mb-10">
            <h3 className="text-2xl font-semibold text-center md:text-left mb-6" style={{ color: GSB_RED }}>Return from Rosewood</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8">
              {shuttles.filter(s => s.type === 'return').map(shuttle => (
                <ShuttleCard
                  key={shuttle.id}
                  shuttle={shuttle}
                  onClick={() => setSelectedShuttleId(shuttle.id)}
                />
              ))}
            </div>
            {shuttles.filter(s => s.type === 'return').length === 0 && (
              <p className="italic text-center md:text-left opacity-70">(No return shuttles currently listed)</p>
            )}
          </div>
        </>
      )}

      <div className="mt-12 md:mt-16 pt-8 md:pt-10 border-t" style={{ borderColor: 'rgba(176, 141, 87, 0.3)' }}>
        <button
          onClick={() => setRegistrationsExpanded(!registrationsExpanded)}
          className="w-full flex justify-between items-center text-left mb-6 focus:outline-none p-2 rounded-md hover:bg-gray-50/50 transition-colors"
          aria-expanded={registrationsExpanded}
          aria-controls="current-registrations-content"
        >
          <h3 className="text-2xl md:text-3xl font-semibold" style={{ color: GSB_RED }}>Current Registrations</h3>
          {registrationsExpanded ? <ChevronUp className="w-6 h-6" style={{ color: GSB_RED }} /> : <ChevronDown className="w-6 h-6" style={{ color: GSB_RED }} />}
        </button>
        
        {registrationsExpanded && (
          <div id="current-registrations-content" className="animate-fade-in-short space-y-4">
            {shuttles.every(shuttle => shuttle.registrations.length === 0) ? (
              <div className="text-center py-10 px-6 rounded-lg" style={{ backgroundColor: WARM_NEUTRAL_LIGHT }}>
                <InfoIcon className="mx-auto h-12 w-12 opacity-40 mb-3" style={{ color: WARM_NEUTRAL_DARK }}/>
                <h4 className="mt-2 text-xl font-medium">No registrations yet.</h4>
                <p className="mt-1 text-sm opacity-70">Once you register, your booking will appear here.</p>
              </div>
            ) : (
              shuttles.filter(s => s.registrations.length > 0).map(shuttle => {
                const totalRegisteredGuests = shuttle.registrations.reduce((sum, reg) => sum + reg.guests, 0);
                const totalPassengersOnShuttle = shuttle.registrations.length + totalRegisteredGuests;
                return (
                  <div key={shuttle.id} className="rounded-lg shadow-lg border overflow-hidden" style={{ backgroundColor: WARM_NEUTRAL_LIGHT, borderColor: 'rgba(0,0,0,0.05)' }}>
                    <button
                      onClick={() => toggleShuttleTimeExpansion(shuttle.id)}
                      className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 text-left focus:outline-none transition-colors duration-150 hover:bg-gray-50/30"
                      aria-expanded={!!expandedShuttleTimes[shuttle.id]}
                      aria-controls={`shuttle-registrations-${shuttle.id}`}
                    >
                      <h4 className="font-semibold text-lg mb-1 sm:mb-0" style={{ color: GSB_RED }}>{shuttle.time} ({shuttle.type?.charAt(0).toUpperCase() + shuttle.type?.slice(1) || 'Unknown'})</h4>
                      <div className="flex items-center mt-1 sm:mt-0">
                        <span className="px-3 py-1 rounded-full text-sm font-medium mr-2" style={{ backgroundColor: 'rgba(130, 19, 21, 0.1)', color: GSB_RED }}>
                          {totalPassengersOnShuttle} passenger{totalPassengersOnShuttle !== 1 ? 's' : ''} ({shuttle.registrations.length} group{shuttle.registrations.length !== 1 ? 's' : ''})
                        </span>
                        {expandedShuttleTimes[shuttle.id] ? <ChevronUp className="w-5 h-5 opacity-70" /> : <ChevronDown className="w-5 h-5 opacity-70" />}
                      </div>
                    </button>
                    
                    {expandedShuttleTimes[shuttle.id] && (
                      <div id={`shuttle-registrations-${shuttle.id}`} className="px-4 pb-4 pt-3 border-t animate-fade-in-short" style={{ borderColor: 'rgba(0,0,0,0.05)', backgroundColor: 'rgba(251, 249, 246, 0.5)' }}>
                        <ul className="divide-y" style={{ borderColor: 'rgba(0,0,0,0.05)' }}>
                          {shuttle.registrations.map(registration => (
                            <li key={registration.id} className="py-3 flex flex-col sm:flex-row justify-between items-start sm:items-center group">
                              <div className="mb-1 sm:mb-0 flex-grow mr-2">
                                <p className="font-medium text-base">{registration.name}</p>
                                <p className="text-sm opacity-80">
                                  {registration.guests > 0 
                                    ? `${registration.guests + 1} passengers (group of ${registration.guests + 1})` 
                                    : '1 passenger (self)'}
                                </p>
                              </div>
                              <div className="flex items-center space-x-2 self-start sm:self-center mt-1 sm:mt-0 w-full sm:w-auto">
                                <div className="text-xs opacity-60 flex-grow sm:flex-grow-0 text-left sm:text-right pr-1">
                                  Registered: {new Date(registration.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric'})} {new Date(registration.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                                <button
                                  onClick={() => handleEditClick(shuttle.id, registration)}
                                  className="text-gray-400 hover:text-blue-600 opacity-60 group-hover:opacity-100 transition-opacity p-1.5 rounded-md hover:bg-blue-50/50"
                                  title="Edit registration"
                                >
                                  <Edit3 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteClick(shuttle.id, registration.id)}
                                  className="text-gray-400 hover:text-red-600 opacity-60 group-hover:opacity-100 transition-opacity p-1.5 rounded-md hover:bg-red-50/50"
                                  title="Remove registration"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 animate-fade-in font-sans">
          <div style={{ backgroundColor: WARM_NEUTRAL_LIGHT }} className="rounded-lg shadow-2xl p-6 sm:p-8 max-w-lg w-full mx-auto">
            <h4 className="text-2xl font-serif font-semibold mb-5" style={{ color: GSB_RED }}>Confirm Removal</h4>
            <p className="text-gray-700 mb-2 text-sm leading-relaxed">
              You are about to remove the registration for <strong className="font-medium" style={{ color: WARM_NEUTRAL_DARK }}>
                {shuttles.find(s => s.id === showDeleteConfirm.shuttleId)?.registrations.find(r => r.id === showDeleteConfirm.registrationId)?.name}
              </strong> from the <strong className="font-medium" style={{ color: WARM_NEUTRAL_DARK }}>
                {shuttles.find(s => s.id === showDeleteConfirm.shuttleId)?.time}
                {(() => {
                  const shuttleType = shuttles.find(s => s.id === showDeleteConfirm.shuttleId)?.type;
                  return shuttleType ? ` (${shuttleType.charAt(0).toUpperCase() + shuttleType.slice(1)})` : '';
                })()}
              </strong> shuttle.
            </p>
            <p className="text-gray-600 mb-6 text-sm">(This action cannot be undone)</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="px-5 py-2.5 border rounded-lg text-sm font-medium transition-colors shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
                style={{ borderColor: 'rgba(0,0,0,0.2)', color: WARM_NEUTRAL_DARK }}
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className={`px-5 py-2.5 text-white rounded-lg text-sm font-medium transition-colors shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[${GSB_RED}]`}
                style={{ backgroundColor: GSB_RED }}
              >
                Yes, Remove
              </button>
            </div>
          </div>
        </div>
      )}

      {editingRegistrationInfo && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 animate-fade-in font-sans">
          <div style={{ backgroundColor: WARM_NEUTRAL_LIGHT }} className="rounded-lg shadow-2xl p-6 sm:p-8 max-w-lg w-full mx-auto">
            <h4 className="text-2xl font-serif font-semibold mb-6" style={{ color: GSB_RED }}>Edit Registration</h4>
            <form onSubmit={(e) => { e.preventDefault(); handleSaveChanges(); }} className="space-y-5">
              <div>
                <label htmlFor="edit-name" className="block text-sm font-medium mb-1.5" style={{ color: WARM_NEUTRAL_DARK }}>
                  Full Name
                </label>
                <input
                  type="text"
                  id="edit-name"
                  name="name"
                  value={editFormData.name}
                  onChange={handleEditFormChange}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none transition-shadow shadow-sm focus:ring-2 focus:ring-[${GOLD_ACCENT}]`}
                  style={{ borderColor: 'rgba(0,0,0,0.2)', color: WARM_NEUTRAL_DARK, backgroundColor: '#fff' }}
                  required
                />
              </div>
              <div>
                <label htmlFor="edit-guests" className="block text-sm font-medium mb-1.5" style={{ color: WARM_NEUTRAL_DARK }}>
                  Additional Guests (excluding yourself)
                </label>
                <select
                  id="edit-guests"
                  name="guests"
                  value={editFormData.guests}
                  onChange={handleEditFormChange}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none transition-shadow shadow-sm bg-white appearance-none focus:ring-2 focus:ring-[${GOLD_ACCENT}]`}
                  style={{ borderColor: 'rgba(0,0,0,0.2)', color: WARM_NEUTRAL_DARK }}
                >
                  <option value="0">0 (Just me)</option>
                  {[1, 2, 3, 4, 5].map(num => (
                    <option key={num} value={num}>{num} guest{num > 1 ? 's' : ''}</option>
                  ))}
                </select>
                <p className="text-xs opacity-70 mt-2">
                  Total passengers for this booking: <strong className="font-semibold">{editFormData.guests + 1}</strong>
                </p>
              </div>
              <div className="flex justify-end space-x-3 pt-3">
                <button
                  type="button"
                  onClick={() => setEditingRegistrationInfo(null)}
                  className="px-5 py-2.5 border rounded-lg text-sm font-medium transition-colors shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
                  style={{ borderColor: 'rgba(0,0,0,0.2)', color: WARM_NEUTRAL_DARK }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-5 py-2.5 text-white rounded-lg text-sm font-medium transition-colors shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[${GSB_RED}]`}
                  style={{ backgroundColor: GSB_RED }}
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShuttleRegistration;