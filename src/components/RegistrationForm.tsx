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
    
    if (name.trim() && selectedShuttle) {
      const totalCurrentPassengers = selectedShuttle.registrations.reduce((sum, reg) => sum + reg.guests + 1, 0);
      const capacity = 18; // Assuming capacity is 18, match ShuttleCard
      if (totalCurrentPassengers + guests + 1 > capacity) {
        alert(`Registering ${guests + 1} passenger(s) would exceed the shuttle capacity of ${capacity}. Please select fewer guests or a different shuttle.`);
        return;
      }
      addRegistration(shuttleId, name.trim(), guests);
      setSubmitted(true);
      
      setTimeout(() => {
        setName('');
        setGuests(0);
        onCancel(); // This will take user back to shuttle selection
        // setSubmitted(false); // Not strictly needed if onCancel unmounts/hides this form
      }, 2500); // Increased timeout for better readability of success message
    }
  };
  
  if (!selectedShuttle) return null;
  
  if (submitted) {
    return (
      <div className="bg-white rounded-xl shadow-xl p-8 text-center max-w-md mx-auto animate-fade-in border border-green-200">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
          <Check className="w-9 h-9 text-green-600" />
        </div>
        <h3 className="text-2xl font-serif font-semibold text-gray-800 mb-3">Registration Confirmed!</h3>
        <p className="text-gray-600 mb-2">
          You have been successfully registered for the <span className="font-medium text-gray-700">{selectedShuttle.time}</span> shuttle.
        </p>
        <p className="text-sm text-gray-500">Name: <span className="font-medium text-gray-600">{name}</span></p>
        <p className="text-sm text-gray-500">Additional Guests: <span className="font-medium text-gray-600">{guests}</span></p>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-xl shadow-xl p-8 max-w-md mx-auto border border-gray-200">
      <button 
        onClick={onCancel}
        className="flex items-center text-sm text-gray-600 hover:text-[#8C1515] mb-6 font-medium group"
      >
        <ArrowLeft className="w-4 h-4 mr-1.5 transition-transform duration-200 group-hover:-translate-x-0.5" />
        Back to shuttle selection
      </button>
      
      <h3 className="text-2xl font-serif font-semibold text-gray-800 mb-6">Register for {selectedShuttle.time} Shuttle</h3>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1.5">
            Your Full Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8C1515] focus:border-[#8C1515] transition-shadow shadow-sm"
            placeholder="e.g., Jane Doe"
            required
          />
        </div>
        
        <div>
          <label htmlFor="guests" className="block text-sm font-medium text-gray-700 mb-1.5">
            Additional Guests (excluding yourself)
          </label>
          <select
            id="guests"
            value={guests}
            onChange={(e) => setGuests(Number(e.target.value))}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8C1515] focus:border-[#8C1515] transition-shadow shadow-sm bg-white appearance-none"
          >
            <option value="0">0 (Just me)</option>
            {[1, 2, 3, 4, 5].map(num => (
              <option key={num} value={num}>{num} guest{num > 1 ? 's' : ''}</option>
            ))}
          </select>
          <p className="text-sm text-gray-500 mt-2">
            Total passengers for this booking: <span className="font-semibold text-gray-700">{guests + 1}</span>
          </p>
        </div>
        
        <div className="flex justify-end space-x-3 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 transition-colors shadow-sm"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2.5 bg-[#8C1515] text-white rounded-lg text-sm font-medium hover:bg-[#7A1212] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8C1515] transition-colors shadow-sm hover:shadow-md"
          >
            Register Now
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegistrationForm;