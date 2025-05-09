import React from 'react';
import { Clock, ChevronRight } from 'lucide-react';
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
  const isFull = totalPassengers >= capacity;
  
  let progressBarColor = 'bg-green-500'; // Default green
  if (isFull) {
    progressBarColor = 'bg-red-600'; // Solid red if full or over
  } else if (percentFull >= 85) { // Transition to red a bit earlier
    progressBarColor = 'bg-red-500';
  } else if (percentFull >= 65) { // Yellow warning sooner
    progressBarColor = 'bg-yellow-500';
  }

  return (
    <div 
      onClick={!isFull ? onClick : undefined}
      className={`bg-white rounded-lg shadow-md overflow-hidden transition-all duration-200 group border border-gray-200 hover:border-red-300 ${isFull ? 'opacity-60 cursor-not-allowed' : 'hover:shadow-lg cursor-pointer'}`}
    >
      <div className="p-3"> {/* Reduced padding for compactness */}
        {/* Row 1: Time & Select CTA / Full Message */} 
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center min-w-0"> {/* min-w-0 for long shuttle times */} 
            <Clock className="w-4 h-4 text-[#8C1515] mr-2 flex-shrink-0" />
            <h3 className="text-base font-serif font-semibold text-gray-800 truncate" title={shuttle.time}>{shuttle.time}</h3>
          </div>
          {!isFull ? (
            <div className="flex items-center text-sm text-[#8C1515] font-medium group-hover:text-[#6F0000] flex-shrink-0 ml-2">
              <span>Select</span>
              <ChevronRight className="w-4 h-4 ml-0.5 transition-transform duration-200 group-hover:translate-x-0.5" />
            </div>
          ) : (
            <div className="text-sm text-red-600 font-semibold flex-shrink-0 ml-2">
              Shuttle Full
            </div>
          )}
        </div>

        {/* Row 2: Capacity Info & Progress Bar */} 
        <div>
          <div className="text-xs text-gray-600 mb-0.5 flex justify-between">
            <span>
              {totalPassengers} / {capacity} spots
            </span>
            <span>
              {isFull ? '' : `${capacity - totalPassengers} open`}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div 
              className={`h-1.5 rounded-full transition-all duration-500 ${progressBarColor}`}
              style={{ width: `${Math.min(percentFull, 100)}%` }}
            ></div>
          </div>
        </div>
      </div>
      
      {/* Bottom Information Strip */} 
      {shuttle.registrations.length > 0 && (
        <div className="bg-gray-50 px-3 py-1.5 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            {shuttle.registrations.length} {shuttle.registrations.length === 1 ? 'group' : 'groups'} registered
          </p>
        </div>
      )}
    </div>
  );
};

export default ShuttleCard;