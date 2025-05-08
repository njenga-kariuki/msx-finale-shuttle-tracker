import React, { useState } from 'react';
import { useShuttle } from '../context/ShuttleContext';
import ShuttleCard from './ShuttleCard';
import RegistrationForm from './RegistrationForm';
import { Trash2 } from 'lucide-react';

const ShuttleRegistration: React.FC = () => {
  const { shuttles, removeRegistration } = useShuttle();
  const [selectedShuttle, setSelectedShuttle] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<{shuttleId: string, registrationId: string} | null>(null);

  const handleDeleteClick = (shuttleId: string, registrationId: string) => {
    setShowDeleteConfirm({ shuttleId, registrationId });
  };

  const confirmDelete = () => {
    if (showDeleteConfirm) {
      removeRegistration(showDeleteConfirm.shuttleId, showDeleteConfirm.registrationId);
      setShowDeleteConfirm(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-serif font-bold text-gray-800 mb-3">Arrival Shuttle Registration</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Please select your preferred shuttle time from Stanford GSB to Rosewood Sand Hill.
          Each shuttle has limited capacity, so early registration is recommended.
        </p>
      </div>

      {selectedShuttle ? (
        <RegistrationForm 
          shuttleId={selectedShuttle} 
          onCancel={() => setSelectedShuttle(null)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {shuttles.map(shuttle => (
            <ShuttleCard
              key={shuttle.id}
              shuttle={shuttle}
              onClick={() => setSelectedShuttle(shuttle.id)}
            />
          ))}
        </div>
      )}

      <div className="mt-16 bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-serif font-bold text-gray-800 mb-4">Current Registrations</h3>
        
        {shuttles.every(shuttle => shuttle.registrations.length === 0) ? (
          <p className="text-gray-500 italic">No registrations yet.</p>
        ) : (
          <div className="space-y-8">
            {shuttles.map(shuttle => {
              const totalGuests = shuttle.registrations.reduce(
                (sum, reg) => sum + reg.guests, 0
              );
              
              return shuttle.registrations.length > 0 ? (
                <div key={shuttle.id} className="border-b pb-6 last:border-b-0 last:pb-0">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-medium text-lg">{shuttle.time} Shuttle</h4>
                    <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                      {shuttle.registrations.length} {shuttle.registrations.length === 1 ? 'registration' : 'registrations'} 
                      {totalGuests > 0 && ` • ${totalGuests + shuttle.registrations.length} total passengers`}
                    </span>
                  </div>
                  
                  <ul className="divide-y">
                    {shuttle.registrations.map(registration => (
                      <li key={registration.id} className="py-3 flex justify-between items-center group">
                        <div>
                          <p className="font-medium">{registration.name}</p>
                          <p className="text-sm text-gray-500">
                            {registration.guests > 0 
                              ? `${registration.guests + 1} passengers total` 
                              : '1 passenger'}
                          </p>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-sm text-gray-400">
                            {new Date(registration.timestamp).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                          <button
                            onClick={() => handleDeleteClick(shuttle.id, registration.id)}
                            className="text-gray-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null;
            })}
          </div>
        )}
      </div>

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h4 className="text-xl font-medium mb-4">Confirm Deletion</h4>
            <p className="text-gray-600 mb-6">
              Please confirm that this is your registration and you want to remove it.
              This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Delete Registration
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShuttleRegistration;