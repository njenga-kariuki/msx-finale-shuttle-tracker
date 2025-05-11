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
    console.log('[ShuttleContext] Attempting to fetch all data...');
    setIsLoading(true);
    setError(null);
    try {
      console.log('[ShuttleContext] Supabase client initialized?', !!supabase);
      
      console.log('[ShuttleContext] Fetching shuttle definitions...');
      const { data: shuttleDefinitions, error: shuttleError } = await supabase
        .from('shuttles') // Make sure your table is named 'shuttles'
        .select('id, time, type');

      console.log('[ShuttleContext] Shuttle definitions raw data:', shuttleDefinitions);
      console.error('[ShuttleContext] Shuttle definitions error:', shuttleError);

      if (shuttleError) {
        throw new Error(`Error fetching shuttle definitions: ${shuttleError.message}`);
      }
      if (!shuttleDefinitions) {
        // This case might mean the table exists but is empty, or RLS prevents access but doesn't error in a way shuttleError catches.
        console.warn('[ShuttleContext] No shuttle definitions data returned, but no explicit error. Check RLS or if table is empty.');
        // We'll let it proceed to see if registrations also has issues, or set shuttles to empty.
        // For now, if shuttleDefinitions is null/undefined and no error, it might be an RLS issue or empty table.
        // throw new Error("No shuttle definitions found and no explicit Supabase error. Check RLS or if table is empty.");
      }
      // If shuttleDefinitions is an empty array, it's a valid response (table is empty or RLS filtered all out)
      if (shuttleDefinitions && shuttleDefinitions.length === 0) {
        console.warn('[ShuttleContext] Shuttle definitions table is empty or RLS filtered all results.');
      }

      console.log('[ShuttleContext] Fetching all registrations...');
      const { data: allRegistrations, error: registrationError } = await supabase
        .from('registrations') // Make sure your table is named 'registrations'
        .select('*')
        .order('timestamp', { ascending: true }); // Optional: order by timestamp

      console.log('[ShuttleContext] All registrations raw data:', allRegistrations);
      console.error('[ShuttleContext] All registrations error:', registrationError);

      if (registrationError) {
        throw new Error(`Error fetching registrations: ${registrationError.message}`);
      }
      // Not throwing an error if allRegistrations is null/undefined and no explicit error, similar to shuttles.
      // It's valid for there to be no registrations.

      // Ensure shuttleDefinitions is an array before mapping, even if it was null from a non-erroring empty response
      const definitionsToProcess = shuttleDefinitions || [];

      console.log('[ShuttleContext] Combining data... Definitions to process:', definitionsToProcess);
      const combinedShuttles: Shuttle[] = definitionsToProcess.map(shuttleDef => {
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
      console.log('[ShuttleContext] Combined shuttles data:', combinedShuttles);
      setShuttles(combinedShuttles);
    } catch (err: any) {
      console.error("[ShuttleContext] CRITICAL ERROR in fetchAllData:", err.message, err.stack);
      setError(err.message || "Failed to fetch data.");
      setShuttles([]); // Ensure shuttles is empty on critical error
    } finally {
      setIsLoading(false);
      console.log('[ShuttleContext] fetchAllData finished.');
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
          console.log('[ShuttleContext] Realtime change received!', payload);
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
    console.log(`[ShuttleContext] Attempting to add registration for shuttle ${shuttleId}:`, { name, guests });
    try {
      const { data, error } = await supabase
        .from('registrations')
        .insert([{ shuttle_id: shuttleId, name, guests, timestamp: new Date().toISOString() }])
        .select(); // .select() can return the inserted row(s)

      console.log('[ShuttleContext] Add registration response data:', data);
      console.error('[ShuttleContext] Add registration response error:', error);
      if (error) throw error;
      
      // No need to manually create newRegistration.id, Supabase handles it.
      // Refresh data from Supabase to ensure UI consistency
      // For simplicity, we re-fetch all data. More advanced optimistic updates are possible.
      if (data) { // If insert was successful
         // await fetchAllData(); // Or optimistically update - re-fetch is simpler for now
         // The realtime subscription should handle the update, but a manual fetch ensures it
      }
    } catch (err: any) {
      console.error("[ShuttleContext] Error adding registration:", err.message, err.stack);
      setError(err.message || "Failed to add registration.");
      // Optionally, re-throw or handle UI feedback
    }
  };

  const removeRegistration = async (shuttleId: string, registrationId: string) => {
    console.log(`[ShuttleContext] Attempting to remove registration ${registrationId} from shuttle ${shuttleId}`);
    // shuttleId is not directly used for delete here as registrationId is unique
    try {
      const { error } = await supabase
        .from('registrations')
        .delete()
        .match({ id: registrationId });

      console.error('[ShuttleContext] Remove registration response error:', error);
      if (error) throw error;
      // await fetchAllData(); // Realtime subscription should handle this
    } catch (err: any) {
      console.error("[ShuttleContext] Error removing registration:", err.message, err.stack);
      setError(err.message || "Failed to remove registration.");
    }
  };

  const updateRegistration = async (shuttleId: string, registrationId: string, name: string, guests: number) => {
    console.log(`[ShuttleContext] Attempting to update registration ${registrationId}:`, { name, guests });
     // shuttleId is not directly used for update here as registrationId is unique
    try {
      const { error } = await supabase
        .from('registrations')
        .update({ name, guests, timestamp: new Date().toISOString() })
        .match({ id: registrationId });

      console.error('[ShuttleContext] Update registration response error:', error);
      if (error) throw error;
      // await fetchAllData(); // Realtime subscription should handle this
    } catch (err: any) {
      console.error("[ShuttleContext] Error updating registration:", err.message, err.stack);
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