import React from 'react';
import { Utensils, Camera, Music4, Bus, Users, Sunset, Cake, CalendarDays, Info } from 'lucide-react';

// Re-define colors here for use in this component (or ideally import from a central theme file)
const GSB_RED = '#8C1515';
const WARM_NEUTRAL_LIGHT = '#FBF9F6';
const WARM_NEUTRAL_DARK = '#4A4A4A';
const GOLD_ACCENT = '#B08D57';

const MenuView: React.FC = () => {
  const scheduleItems = [
    { time: '5:30 PM - 6:30 PM', title: 'Welcome & Appetizers', icon: Utensils, number: null },
    { time: '6:30 PM', title: 'Class Pic #1', icon: Users, number: null },
    { time: '6:30 PM - 8:00 PM', title: 'Tons of Food, Drinks, Memories & Vibes', icon: Music4, number: null }, // Changed icon to Music4 from generic number
    { time: '8:00 PM', title: 'Class Pic #2 (Sunset)', icon: Sunset, number: null },
    { time: '8:00 PM - 10:00 PM', title: 'Dessert & Even More Drinks, Memories & Vibes', icon: Cake, number: null },
  ];

  return (
    <div style={{ color: WARM_NEUTRAL_DARK }} className="max-w-3xl mx-auto my-8 font-serif">
      {/* Main Page Title & Countdown - now using serif for better consistency with headings */}
      <div className="text-center mb-10 md:mb-12">
        <h2 className="text-4xl md:text-5xl font-light mb-3" style={{ color: GSB_RED }}>
          Event Agenda
        </h2>

      </div>

      <div className="space-y-10 md:space-y-12">
        {/* Refined Important Notes Section */}
        <div style={{ backgroundColor: WARM_NEUTRAL_LIGHT }} className="rounded-lg shadow-lg border border-gray-200 p-6 md:p-8">
          <h3 className="text-2xl font-semibold mb-4 flex items-center" style={{ color: GSB_RED }}>
            <Info className="mr-3 h-6 w-6 flex-shrink-0" />
            A Few Things
          </h3>
          <ul className="space-y-3 text-base leading-relaxed list-none pl-0">
            {[
              { icon: Utensils, text: <>Come <strong style={{ color: GSB_RED, fontWeight: '600' }}>VERY hungry (and thirsty)</strong>! Lots of food (dietary options available) & open bar for the first 2 hours (mocktails included).</> },
              { icon: Camera, text: 'Dress to impress for our photographer (first 3 hours). Glam shots, candids, class pics!' },
              { icon: Music4, text: 'Bring your light dancing vibes! Awesome DJ (#1 in Yelp Bay Area) knows GSB events.' },
              { icon: Bus, text: <>Plan to arrive by <strong style={{ color: GSB_RED, fontWeight: '600' }}>6 PM latest</strong>. Shuttle details on the "Shuttle Planner" tab.</> },
            ].map((item, index) => (
              <li key={index} className="flex items-start">
                <item.icon className="mr-3 h-5 w-5 flex-shrink-0 mt-1" style={{ color: GSB_RED }} />
                <span>{item.text}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Refined General Schedule Section */}
        <div>
          <h3 className="text-3xl md:text-4xl font-light text-center mb-8 md:mb-10 pb-3 border-b-2" style={{ borderColor: GOLD_ACCENT, color: GSB_RED }}>
            General Schedule
          </h3>
          <div className="relative">
            {/* Vertical connecting line - more robustly done with before/after pseudo-elements on parent if possible, or individual lines */}
            <div className="absolute left-5 top-0 bottom-0 w-0.5" style={{ backgroundColor: GOLD_ACCENT, opacity: 0.3 }}></div>

            {scheduleItems.map((item, index) => (
              <div key={index} className="flex items-start mb-6 md:mb-8 group">
                {/* Icon/Marker */}
                <div className="z-10 flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center mr-5 shadow-md" style={{ backgroundColor: GSB_RED }}>
                  <item.icon className="h-5 w-5 text-white" />
                </div>
                {/* Event Details Card */}
                <div
                  style={{ backgroundColor: WARM_NEUTRAL_LIGHT }}
                  className="flex-grow p-4 md:p-5 rounded-lg shadow-lg border border-gray-200 transition-all duration-300 group-hover:shadow-xl group-hover:border-gray-300"
                >
                  <p className="font-semibold text-lg md:text-xl mb-1" style={{ color: WARM_NEUTRAL_DARK }}>{item.time}</p>
                  <p className="text-base leading-relaxed" style={{ color: WARM_NEUTRAL_DARK }}>{item.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Refined Setup Style Section */}
        <div style={{ backgroundColor: WARM_NEUTRAL_LIGHT }} className="rounded-lg shadow-lg border border-gray-200 p-6 md:p-8">
          <h3 className="text-2xl font-semibold mb-3" style={{ color: GSB_RED }}>Setup Style:</h3>
          <p className="text-base leading-relaxed">Casual lounge-style for easy mingling. Plenty of space to move around and catch up!</p>
        </div>

        {/* Refined Footer Note */}
        <div className="mt-10 pt-8 border-t-2 border-dashed" style={{ borderColor: GOLD_ACCENT, opacity: 0.5 }}>
          <p className="text-sm text-center leading-relaxed" style={{ color: WARM_NEUTRAL_DARK }}>
            If your schedule changes and you can't make it, or if you plan to arrive after 8 PM, please let the organizers know.
            <br />But <strong style={{ color: GSB_RED, fontWeight: '600' }}>DO NOT</strong> let either of these things happen! 😉
          </p>
        </div>
      </div>
    </div>
  );
};

export default MenuView; 