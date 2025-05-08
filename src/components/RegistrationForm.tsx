import React, { useState } from 'react';
import { ArrowLeft, Check } from 'lucide-react';
import { useShuttle } from '../context/ShuttleContext';

interface RegistrationFormProps {
  shuttleId: string;
  onCancel: () => void;
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({ shuttleId, onCancel }) => {
  const { shuttles, addRegistration } = useShuttle();
  const [name, setName] = useState('');
  const [guests, setGuests] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  
  const selectedShuttle = shuttles.find(shuttle => shuttle.id === shuttleId);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (name.trim()) {
      addRegistration(shuttleId, name.trim(), guests);
      setSubmitted(true);
      
      // Reset form after showing success message
      setTimeout(() => {
        setName('');
        setGuests(0);
        onCancel();
        setSubmitted(false);
      }, 2000);
    }
  };
  
  if (!selectedShuttle) return null;
  
  if (submitted) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center max-w-md mx-auto animate-fade-in">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Check className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-xl font-medium mb-2">Registration Confirmed!</h3>
        <p className="text-gray-600 mb-6">
          You've been registered for the {selectedShuttle.time} shuttle.
        </p>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg shadow-md p-8 max-w-md mx-auto">
      <button 
        onClick={onCancel}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        Back to shuttle selection
      </button>
      
      <h3 className="text-xl font-medium mb-6">Register for {selectedShuttle.time} Shuttle</h3>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Your Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8C1515] focus:border-transparent"
            placeholder="Enter your full name"
            required
          />
        </div>
        
        <div className="mb-6">
          <label htmlFor="guests" className="block text-sm font-medium text-gray-700 mb-1">
            Additional Guests (not including yourself)
          </label>
          <select
            id="guests"
            value={guests}
            onChange={(e) => setGuests(Number(e.target.value))}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8C1515] focus:border-transparent"
          >
            <option value="0">No additional guests</option>
            <option value="1">1 guest</option>
            <option value="2">2 guests</option>
            <option value="3">3 guests</option>
            <option value="4">4 guests</option>
            <option value="5">5 guests</option>
          </select>
          <p className="text-sm text-gray-500 mt-1">
            Total passengers: {guests + 1}
          </p>
        </div>
        
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-[#8C1515] text-white rounded-md hover:bg-[#6F0000] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8C1515]"
          >
            Register
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegistrationForm;