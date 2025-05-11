import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Shuttle, Registration } from '../types/shuttle'; // Assuming types are reusable

interface CombinedRegistrationInfo extends Registration {
  shuttleTime: string;
  shuttleType: string;
}

const AdminView: React.FC = () => {
  const [allRegistrationsInfo, setAllRegistrationsInfo] = useState<CombinedRegistrationInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAdminData = async () => {
      setIsLoading(true);
      setError(null);
      console.log('[AdminView] Fetching admin data...');
      try {
        const { data: shuttlesData, error: shuttlesError } = await supabase
          .from('shuttles')
          .select('id, time, type');

        if (shuttlesError) throw new Error(`Error fetching shuttles: ${shuttlesError.message}`);
        if (!shuttlesData) throw new Error('No shuttle data returned');

        console.log('[AdminView] Shuttles data:', shuttlesData);

        const { data: registrationsData, error: registrationsError } = await supabase
          .from('registrations')
          .select('*')
          .order('timestamp', { ascending: false }); // Show newest first

        if (registrationsError) throw new Error(`Error fetching registrations: ${registrationsError.message}`);
        if (!registrationsData) throw new Error('No registrations data returned');
        
        console.log('[AdminView] Registrations data:', registrationsData);

        const combinedInfo: CombinedRegistrationInfo[] = registrationsData.map(reg => {
          const shuttle = shuttlesData.find(s => s.id === reg.shuttle_id);
          return {
            ...reg, // Spread all original registration fields (id, name, guests, timestamp)
            id: reg.id, // Explicitly ensure reg.id is used for the key if needed
            timestamp: new Date(reg.timestamp).getTime(), // Convert to number if needed by Registration type
            shuttleTime: shuttle ? shuttle.time : 'Unknown Shuttle',
            shuttleType: shuttle ? (shuttle.type as string) : 'Unknown',
          };
        });
        
        // Sort combinedInfo by shuttleTime
        combinedInfo.sort((a, b) => {
          // Helper to convert time string "HH:MM AM/PM" to minutes since midnight
          const timeToMinutes = (timeStr: string): number => {
            const [time, modifier] = timeStr.split(' ');
            let [hours, minutes] = time.split(':').map(Number);

            if (modifier && modifier.toUpperCase() === 'PM' && hours < 12) {
              hours += 12;
            }
            if (modifier && modifier.toUpperCase() === 'AM' && hours === 12) { // Midnight case
              hours = 0;
            }
            return hours * 60 + minutes;
          };

          const timeA = timeToMinutes(a.shuttleTime);
          const timeB = timeToMinutes(b.shuttleTime);

          return timeA - timeB;
        });
        
        console.log('[AdminView] Combined registration info (sorted by shuttle time):', combinedInfo);
        setAllRegistrationsInfo(combinedInfo);

      } catch (err: any) {
        console.error('[AdminView] Error fetching admin data:', err);
        setError(err.message || 'Failed to fetch admin data.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAdminData();

    // Optional: Set up Supabase real-time subscription for registrations table 
    // to keep the admin view updated, similar to ShuttleContext.
    const registrationsSubscription = supabase
      .channel('admin-registrations')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'registrations' },
        (payload) => {
          console.log('[AdminView] Realtime change detected:', payload);
          fetchAdminData(); // Re-fetch all data on any change
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(registrationsSubscription);
    };

  }, []);

  if (isLoading) {
    return <div className="p-4 text-center">Loading admin data...</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-red-600">Error: {error}</div>;
  }

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">Admin View: All Shuttle Registrations</h1>
      {allRegistrationsInfo.length === 0 ? (
        <p className="text-center text-gray-600">No registrations found.</p>
      ) : (
        <div className="overflow-x-auto bg-white shadow-md rounded-lg">
          <table className="min-w-full table-auto text-left">
            <thead className="bg-gray-100 border-b border-gray-300">
              <tr>
                <th className="px-6 py-3 text-xs font-medium text-gray-600 uppercase tracking-wider">Shuttle Time</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-600 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-600 uppercase tracking-wider">Registrant Name</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-600 uppercase tracking-wider">Total Passengers</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-600 uppercase tracking-wider">Registered At</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {allRegistrationsInfo.map((reg) => (
                <tr key={reg.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{reg.shuttleTime}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${reg.shuttleType === 'arrival' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                      {reg.shuttleType.charAt(0).toUpperCase() + reg.shuttleType.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{reg.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-center">{reg.guests + 1}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {new Date(reg.timestamp).toLocaleString(undefined, { 
                      year: 'numeric', month: 'short', day: 'numeric', 
                      hour: '2-digit', minute: '2-digit' 
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminView; 