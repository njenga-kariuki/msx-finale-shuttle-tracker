import React from 'react';
import { Clock } from 'lucide-react';
import { Shuttle } from '../types/shuttle';

interface ShuttleCardProps {
  shuttle: Shuttle;
  onClick: () => void;
}

const ShuttleCard: React.FC<ShuttleCardProps> = ({ shuttle, onClick }) => {
  const totalPassengers = shuttle.registrations.reduce(
    (sum, reg) => sum + reg.guests + 1, 
    0
  );
  
  const capacity = 18;
  const percentFull = (totalPassengers / capacity) * 100;
  
  return (
    <div 
      className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 cursor-pointer"
      onClick={onClick}
    >
      <div className="p-6">
        <div className="flex items-center mb-4">
          <Clock className="w-5 h-5 text-[#8C1515] mr-2" />
          <h3 className="text-xl font-medium">{shuttle.time}</h3>
        </div>
        
        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Capacity</span>
            <span>{totalPassengers} / {capacity} passengers</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className={`h-2.5 rounded-full ${
                percentFull < 70 ? 'bg-green-500' : 
                percentFull < 90 ? 'bg-yellow-500' : 
                'bg-red-500'
              }`}
              style={{ width: `${Math.min(percentFull, 100)}%` }}
            ></div>
          </div>
        </div>
        
        <div className="text-center mt-6">
          <button 
            className="w-full bg-[#8C1515] hover:bg-[#6F0000] text-white py-2 px-4 rounded transition-colors"
          >
            Select This Shuttle
          </button>
        </div>
      </div>
      
      <div className="bg-gray-50 px-6 py-3 border-t">
        <p className="text-sm text-gray-600">
          {shuttle.registrations.length} {shuttle.registrations.length === 1 ? 'person' : 'people'} registered
        </p>
      </div>
    </div>
  );
};

export default ShuttleCard;