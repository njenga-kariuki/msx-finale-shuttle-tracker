import React, { createContext, useState, useEffect, useContext } from 'react';
import { Shuttle, ShuttleContextType, Registration } from '../types/shuttle';

const initialShuttles: Shuttle[] = [
  {
    id: 'arrival-shuttle-1',
    time: '5:10 PM',
    type: 'arrival',
    registrations: [],
  },
  {
    id: 'arrival-shuttle-2',
    time: '5:40 PM',
    type: 'arrival',
    registrations: [],
  },
  {
    id: 'return-shuttle-1',
    time: '8:30 PM',
    type: 'return',
    registrations: [],
  },
  {
    id: 'return-shuttle-2',
    time: '9:00 PM',
    type: 'return',
    registrations: [],
  },
];

const ShuttleContext = createContext<ShuttleContextType | undefined>(undefined);

export const ShuttleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [shuttles, setShuttles] = useState<Shuttle[]>(() => {
    const savedShuttlesString = localStorage.getItem('shuttles');
    if (savedShuttlesString) {
      const savedShuttles = JSON.parse(savedShuttlesString) as Partial<Shuttle>[]; // Allow partial for migration
      
      return initialShuttles.map(initialShuttle => {
        const existingSavedShuttle = savedShuttles.find(saved => saved.id === initialShuttle.id);
        if (existingSavedShuttle) {
          // Merge: take registrations from saved, but ensure type and time are from initial (latest definition)
          return {
            ...initialShuttle, // provides id, time, type (and default empty registrations)
            ...existingSavedShuttle, // overrides with saved data, hopefully including registrations
            type: initialShuttle.type, // Ensure type is always from the latest code
            time: initialShuttle.time, // Ensure time is always from the latest code
          };
        }
        return initialShuttle; // New shuttle not in local storage yet
      });
    }    
    return initialShuttles;
  });

  useEffect(() => {
    localStorage.setItem('shuttles', JSON.stringify(shuttles));
  }, [shuttles]);

  const addRegistration = (shuttleId: string, name: string, guests: number) => {
    const newRegistration: Registration = {
      id: crypto.randomUUID(),
      name,
      guests,
      timestamp: Date.now(),
    };

    setShuttles(prevShuttles =>
      prevShuttles.map(shuttle =>
        shuttle.id === shuttleId
          ? { ...shuttle, registrations: [...shuttle.registrations, newRegistration] }
          : shuttle
      )
    );
  };

  const removeRegistration = (shuttleId: string, registrationId: string) => {
    setShuttles(prevShuttles =>
      prevShuttles.map(shuttle =>
        shuttle.id === shuttleId
          ? {
              ...shuttle,
              registrations: shuttle.registrations.filter(
                registration => registration.id !== registrationId
              ),
            }
          : shuttle
      )
    );
  };

  const updateRegistration = (shuttleId: string, registrationId: string, name: string, guests: number) => {
    setShuttles(prevShuttles =>
      prevShuttles.map(shuttle =>
        shuttle.id === shuttleId
          ? {
              ...shuttle,
              registrations: shuttle.registrations.map(reg =>
                reg.id === registrationId
                  ? { ...reg, name, guests, timestamp: Date.now() } // Update name, guests, and timestamp
                  : reg
              ),
            }
          : shuttle
      )
    );
  };

  return (
    <ShuttleContext.Provider value={{ shuttles, addRegistration, removeRegistration, updateRegistration }}>
      {children}
    </ShuttleContext.Provider>
  );
};

export const useShuttle = (): ShuttleContextType => {
  const context = useContext(ShuttleContext);
  if (context === undefined) {
    throw new Error('useShuttle must be used within a ShuttleProvider');
  }
  return context;
};