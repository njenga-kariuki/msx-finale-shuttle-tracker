import React, { createContext, useState, useEffect, useContext } from 'react';
import { Shuttle, ShuttleContextType, Registration } from '../types/shuttle';
import { supabase } from '../supabaseClient'; // Import Supabase client

// Remove initialShuttles, this will come from Supabase

const ShuttleContext = createContext<ShuttleContextType | undefined>(undefined);

export const ShuttleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [shuttles, setShuttles] = useState<Shuttle[]>([]); // Initialize with empty array
  const [isLoading, setIsLoading] = useState(true); // Optional: for loading state
  const [error, setError] = useState<string | null>(null); // Optional: for error state

  // Function to fetch all data from Supabase
  const fetchAllData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // 1. Fetch all shuttle definitions
      const { data: shuttleDefinitions, error: shuttleError } = await supabase
        .from('shuttles') // Make sure your table is named 'shuttles'
        .select('id, time, type');

      if (shuttleError) throw shuttleError;
      if (!shuttleDefinitions) throw new Error("No shuttle definitions found.");

      // 2. Fetch all registrations
      const { data: allRegistrations, error: registrationError } = await supabase
        .from('registrations') // Make sure your table is named 'registrations'
        .select('*')
        .order('timestamp', { ascending: true }); // Optional: order by timestamp

      if (registrationError) throw registrationError;

      // 3. Combine shuttle definitions with their registrations
      const combinedShuttles: Shuttle[] = shuttleDefinitions.map(shuttleDef => {
        const shuttleRegistrations = allRegistrations?.filter(reg => reg.shuttle_id === shuttleDef.id) || [];
        return {
          id: shuttleDef.id,
          time: shuttleDef.time,
          type: shuttleDef.type as 'arrival' | 'return', // Ensure type matches
          registrations: shuttleRegistrations.map(reg => ({
            id: reg.id, // Supabase registration ID
            name: reg.name,
            guests: reg.guests,
            timestamp: new Date(reg.timestamp).getTime() // Ensure timestamp is a number
          }))
        };
      });
      setShuttles(combinedShuttles);
    } catch (err: any) {
      console.error("Error fetching data from Supabase:", err);
      setError(err.message || "Failed to fetch data.");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchAllData();

    // Supabase Realtime (optional, but good for multi-user)
    // Listen to inserts, updates, and deletes on the 'registrations' table
    const registrationsSubscription = supabase
      .channel('public:registrations')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'registrations' },
        (payload) => {
          console.log('Change received!', payload);
          fetchAllData(); // Re-fetch all data on any change
        }
      )
      .subscribe();
    
    // Clean up subscription on unmount
    return () => {
      supabase.removeChannel(registrationsSubscription);
    };
  }, []); // Empty dependency array means this runs once on mount

  const addRegistration = async (shuttleId: string, name: string, guests: number) => {
    try {
      const { data, error } = await supabase
        .from('registrations')
        .insert([{ shuttle_id: shuttleId, name, guests, timestamp: new Date().toISOString() }])
        .select(); // .select() can return the inserted row(s)

      if (error) throw error;
      
      // No need to manually create newRegistration.id, Supabase handles it.
      // Refresh data from Supabase to ensure UI consistency
      // For simplicity, we re-fetch all data. More advanced optimistic updates are possible.
      if (data) { // If insert was successful
         // await fetchAllData(); // Or optimistically update - re-fetch is simpler for now
         // The realtime subscription should handle the update, but a manual fetch ensures it
      }
    } catch (err: any) {
      console.error("Error adding registration:", err);
      setError(err.message || "Failed to add registration.");
      // Optionally, re-throw or handle UI feedback
    }
  };

  const removeRegistration = async (shuttleId: string, registrationId: string) => {
    // shuttleId is not directly used for delete here as registrationId is unique
    try {
      const { error } = await supabase
        .from('registrations')
        .delete()
        .match({ id: registrationId });

      if (error) throw error;
      // await fetchAllData(); // Realtime subscription should handle this
    } catch (err: any) {
      console.error("Error removing registration:", err);
      setError(err.message || "Failed to remove registration.");
    }
  };

  const updateRegistration = async (shuttleId: string, registrationId: string, name: string, guests: number) => {
     // shuttleId is not directly used for update here as registrationId is unique
    try {
      const { error } = await supabase
        .from('registrations')
        .update({ name, guests, timestamp: new Date().toISOString() })
        .match({ id: registrationId });

      if (error) throw error;
      // await fetchAllData(); // Realtime subscription should handle this
    } catch (err: any) {
      console.error("Error updating registration:", err);
      setError(err.message || "Failed to update registration.");
    }
  };
  
  // Expose isLoading and error for UI if needed
  // const contextValue = { shuttles, addRegistration, removeRegistration, updateRegistration, isLoading, error };
  // For now, keeping the original context signature:
  const contextValue = { shuttles, addRegistration, removeRegistration, updateRegistration };


  return (
    <ShuttleContext.Provider value={contextValue}>
      {children}
    </ShuttleContext.Provider>
  );
};

export const useShuttle = (): ShuttleContextType => {
  const context = useContext(ShuttleContext);
  if (context === undefined) {
    throw new Error('useShuttle must be used within a ShuttleProvider');
  }
  // If you added isLoading/error to contextValue, update ShuttleContextType accordingly
  return context;
};