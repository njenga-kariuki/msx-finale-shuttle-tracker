import React, { useState } from 'react';
import { useShuttle } from '../context/ShuttleContext';
import ShuttleCard from './ShuttleCard';
import RegistrationForm from './RegistrationForm';
import { Trash2, ChevronDown, ChevronUp, Edit3 } from 'lucide-react';

// Define a type for the information needed for editing
interface EditingRegistrationInfo {
  shuttleId: string;
  registrationId: string;
  currentName: string;
  currentGuests: number;
}

const ShuttleRegistration: React.FC = () => {
  const { shuttles, removeRegistration, updateRegistration } = useShuttle();
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
    <div className="max-w-5xl mx-auto">
      <div className="mb-10 md:mb-12 text-center">
        <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-800 mb-2">Select a Shuttle</h2>
        <p className="text-gray-600 text-sm max-w-2xl mx-auto">
          Limited capacity.
        </p>
      </div>

      {selectedShuttleId ? (
        <RegistrationForm 
          shuttleId={selectedShuttleId} 
          onCancel={() => setSelectedShuttleId(null)}
        />
      ) : (
        <>
          {/* Arrival Shuttles Section */}
          <div className="mb-12">
            <h3 className="text-2xl font-serif font-semibold text-gray-700 mb-6 text-center md:text-left">Depart from GSB</h3>
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
              <p className="text-gray-500 italic text-center md:text-left">No arrival shuttles available at this time.</p>
            )}
          </div>

          {/* Return Shuttles Section */}
          <div className="mb-10">
            <h3 className="text-2xl font-serif font-semibold text-gray-700 mb-6 text-center md:text-left">Return from Rosewood</h3>
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
              <p className="text-gray-500 italic text-center md:text-left">No return shuttles available at this time.</p>
            )}
          </div>
        </>
      )}

      <div className="mt-12 md:mt-16 pt-8 md:pt-10 border-t border-gray-200">
        <button
          onClick={() => setRegistrationsExpanded(!registrationsExpanded)}
          className="w-full flex justify-between items-center text-left mb-6 focus:outline-none"
          aria-expanded={registrationsExpanded}
          aria-controls="current-registrations-content"
        >
          <h3 className="text-2xl md:text-3xl font-serif font-bold text-gray-800">Current Registrations</h3>
          {registrationsExpanded ? <ChevronUp className="w-6 h-6 text-gray-700" /> : <ChevronDown className="w-6 h-6 text-gray-700" />}
        </button>
        
        {registrationsExpanded && (
          <div id="current-registrations-content" className="animate-fade-in-short">
            {shuttles.every(shuttle => shuttle.registrations.length === 0) ? (
              <div className="text-center py-10">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                </svg>
                <h4 className="mt-2 text-xl font-medium text-gray-700">No registrations yet.</h4>
                <p className="mt-1 text-sm text-gray-500">Once you register, your booking will appear here.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {shuttles.filter(s => s.registrations.length > 0).map(shuttle => {
                  const totalRegisteredGuests = shuttle.registrations.reduce((sum, reg) => sum + reg.guests, 0);
                  const totalPassengersOnShuttle = shuttle.registrations.length + totalRegisteredGuests;
                  
                  return (
                    <div key={shuttle.id} className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                      <button
                        onClick={() => toggleShuttleTimeExpansion(shuttle.id)}
                        className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 text-left focus:outline-none hover:bg-gray-50 transition-colors duration-150"
                        aria-expanded={!!expandedShuttleTimes[shuttle.id]}
                        aria-controls={`shuttle-registrations-${shuttle.id}`}
                      >
                        <h4 className="font-serif text-xl font-semibold text-[#8C1515] mb-1 sm:mb-0">{shuttle.time} ({shuttle.type?.charAt(0).toUpperCase() + shuttle.type?.slice(1) || 'Unknown'})</h4>
                        <div className="flex items-center mt-1 sm:mt-0">
                          <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
                            {totalPassengersOnShuttle} passenger{totalPassengersOnShuttle !== 1 ? 's' : ''} ({shuttle.registrations.length} group{shuttle.registrations.length !== 1 ? 's' : ''})
                          </span>
                          {expandedShuttleTimes[shuttle.id] ? <ChevronUp className="w-5 h-5 text-gray-600 ml-3 flex-shrink-0" /> : <ChevronDown className="w-5 h-5 text-gray-600 ml-3 flex-shrink-0" />}
                        </div>
                      </button>
                      
                      {expandedShuttleTimes[shuttle.id] && (
                        <div id={`shuttle-registrations-${shuttle.id}`} className="px-4 pb-4 pt-3 border-t border-gray-200 bg-gray-50/50 animate-fade-in-short">
                          <ul className="divide-y divide-gray-200">
                            {shuttle.registrations.map(registration => (
                              <li key={registration.id} className="py-2.5 flex flex-col sm:flex-row justify-between items-start sm:items-center group">
                                <div className="mb-1 sm:mb-0 flex-grow mr-2">
                                  <p className="font-medium text-gray-800 text-base">{registration.name}</p>
                                  <p className="text-sm text-gray-600">
                                    {registration.guests > 0 
                                      ? `${registration.guests + 1} passengers (group of ${registration.guests + 1})` 
                                      : '1 passenger (self)'}
                                  </p>
                                </div>
                                <div className="flex items-center space-x-1 sm:space-x-2 self-start sm:self-center mt-1 sm:mt-0 w-full sm:w-auto">
                                  <div className="text-xs text-gray-500 flex-grow sm:flex-grow-0 text-left sm:text-right pr-1">
                                    Registered: {new Date(registration.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric'})} {new Date(registration.timestamp).toLocaleTimeString([], {
                                      hour: '2-digit', minute: '2-digit'
                                    })}
                                  </div>
                                  <button
                                    onClick={() => handleEditClick(shuttle.id, registration)}
                                    className="text-gray-400 hover:text-blue-600 opacity-50 group-hover:opacity-100 transition-opacity p-2 rounded-md hover:bg-blue-50 flex-shrink-0"
                                    title="Edit registration"
                                  >
                                    <Edit3 className="w-5 h-5" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteClick(shuttle.id, registration.id)}
                                    className="text-gray-400 hover:text-red-600 opacity-50 group-hover:opacity-100 transition-opacity p-2 rounded-md hover:bg-red-50 flex-shrink-0"
                                    title="Remove registration"
                                  >
                                    <Trash2 className="w-5 h-5" />
                                  </button>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-xl shadow-2xl p-6 sm:p-8 max-w-lg w-full mx-auto">
            <h4 className="text-2xl font-serif font-semibold text-gray-800 mb-4">Confirm Removal</h4>
            <p className="text-gray-600 mb-1">
              You are about to remove the registration for <span className="font-medium">
                {shuttles.find(s => s.id === showDeleteConfirm.shuttleId)?.registrations.find(r => r.id === showDeleteConfirm.registrationId)?.name}
              </span>{' '}from the <span className="font-medium">
                {shuttles.find(s => s.id === showDeleteConfirm.shuttleId)?.time}
                {(() => {
                  const shuttleType = shuttles.find(s => s.id === showDeleteConfirm.shuttleId)?.type;
                  return shuttleType ? ` (${shuttleType.charAt(0).toUpperCase() + shuttleType.slice(1)})` : '';
                })()}
              </span> shuttle.
            </p>
            <p className="text-gray-600 mb-6">This action cannot be undone. Are you sure?</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="px-5 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 transition-colors shadow-sm"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-5 py-2.5 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors shadow-sm hover:shadow-md"
              >
                Yes, Remove Registration
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Registration Modal */}
      {editingRegistrationInfo && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-xl shadow-2xl p-6 sm:p-8 max-w-lg w-full mx-auto">
            <h4 className="text-2xl font-serif font-semibold text-gray-800 mb-6">Edit Registration</h4>
            <form onSubmit={(e) => { e.preventDefault(); handleSaveChanges(); }} className="space-y-6">
              <div>
                <label htmlFor="edit-name" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  id="edit-name"
                  name="name"
                  value={editFormData.name}
                  onChange={handleEditFormChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8C1515] focus:border-[#8C1515] transition-shadow shadow-sm"
                  required
                />
              </div>
              <div>
                <label htmlFor="edit-guests" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Additional Guests (excluding yourself)
                </label>
                <select
                  id="edit-guests"
                  name="guests"
                  value={editFormData.guests}
                  onChange={handleEditFormChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8C1515] focus:border-[#8C1515] transition-shadow shadow-sm bg-white appearance-none"
                >
                  <option value="0">0 (Just me)</option>
                  {[1, 2, 3, 4, 5].map(num => (
                    <option key={num} value={num}>{num} guest{num > 1 ? 's' : ''}</option>
                  ))}
                </select>
                <p className="text-sm text-gray-500 mt-2">
                  Total passengers for this booking: <span className="font-semibold text-gray-700">{editFormData.guests + 1}</span>
                </p>
              </div>
              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingRegistrationInfo(null)}
                  className="px-5 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 transition-colors shadow-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#8C1515] text-white rounded-lg text-sm font-medium hover:bg-[#7A1212] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8C1515] transition-colors shadow-sm hover:shadow-md"
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