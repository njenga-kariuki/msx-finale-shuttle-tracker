export interface Registration {
  id: string;
  name: string;
  guests: number;
  timestamp: number;
}

export interface Shuttle {
  id: string;
  time: string;
  registrations: Registration[];
}

export interface ShuttleContextType {
  shuttles: Shuttle[];
  addRegistration: (shuttleId: string, name: string, guests: number) => void;
  removeRegistration: (shuttleId: string, registrationId: string) => void;
}