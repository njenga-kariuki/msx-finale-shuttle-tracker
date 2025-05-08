import React, { createContext, useState, useEffect, useContext } from 'react';
import { Shuttle, ShuttleContextType, Registration } from '../types/shuttle';

const initialShuttles: Shuttle[] = [
  {
    id: 'shuttle-1',
    time: '5:05 PM',
    registrations: [],
  },
  {
    id: 'shuttle-2',
    time: '5:40 PM',
    registrations: [],
  },
];

const ShuttleContext = createContext<ShuttleContextType | undefined>(undefined);

export const ShuttleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [shuttles, setShuttles] = useState<Shuttle[]>(() => {
    const savedShuttles = localStorage.getItem('shuttles');
    return savedShuttles ? JSON.parse(savedShuttles) : initialShuttles;
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

  return (
    <ShuttleContext.Provider value={{ shuttles, addRegistration, removeRegistration }}>
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