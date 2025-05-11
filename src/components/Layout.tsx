import React from 'react';
import { Bus, CalendarSearch } from 'lucide-react';

// Color definitions (keeping for consistency if needed elsewhere, but header is now GSB_RED)
const GSB_RED = '#8C1515';
const WARM_NEUTRAL_LIGHT = '#FBF9F6'; // Subtle cream/off-white for page background
const WARM_NEUTRAL_DARK = '#4A4A4A'; // Warm dark gray for text/elements
const GOLD_ACCENT = '#B08D57'; // Muted gold for active tab accent

interface LayoutProps {
  children: React.ReactNode;
  activeView: 'register' | 'menu' | 'djRequests';
  setActiveView: (view: 'register' | 'menu' | 'djRequests') => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeView, setActiveView }) => {
  // Refined tab styling
  const navButtonBaseStyle = "py-3 px-4 md:px-5 transition-all duration-300 ease-in-out font-medium text-sm tracking-wide focus:outline-none";
  // Active style uses gold accent for underline, text is white for contrast against red header
  const activeStyle = `text-white border-b-2 border-[${GOLD_ACCENT}]`;
  // Inactive style uses a lighter shade of white/off-white for readability against red header
  const inactiveStyle = `text-red-100 hover:text-white`;

  return (
    <div style={{ backgroundColor: WARM_NEUTRAL_LIGHT }} className="min-h-screen flex flex-col font-sans">
      <header style={{ backgroundColor: GSB_RED }} className="text-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center pt-5 pb-3">
            <div className="flex items-center mb-3">
              <img 
                src="/src/assets/StanfordGSB_SmallLogo.jpg"
                alt="Stanford GSB Logo" 
                className="h-10 md:h-12 mr-4"
              />
              <h1 className="text-2xl md:text-3xl font-serif font-light tracking-tight text-white">
                Rosewood MSx '25 Finale
              </h1>
            </div>
          </div>
          
          {/* Refined Navigation Tabs */}
          <nav className="flex justify-center border-b" style={{ borderColor: 'rgba(255, 255, 255, 0.2)' }}>
            <button 
              onClick={() => setActiveView('menu')}
              className={`${navButtonBaseStyle} ${activeView === 'menu' ? activeStyle : inactiveStyle}`}
            >
              <span>EVENT AGENDA</span>
            </button>
            <button 
              onClick={() => setActiveView('register')}
              className={`${navButtonBaseStyle} ${activeView === 'register' ? activeStyle : inactiveStyle}`}
            >
              <span>SHUTTLE PLANNER</span>
            </button>
            <button 
              onClick={() => setActiveView('djRequests')}
              className={`${navButtonBaseStyle} ${activeView === 'djRequests' ? activeStyle : inactiveStyle}`}
            >
              <span>DJ REQUESTS</span>
            </button>
          </nav>
        </div>
      </header>
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12 flex-grow">
        {children}
      </main>
      
      <footer style={{ backgroundColor: WARM_NEUTRAL_LIGHT }} className="border-t border-gray-300 py-6">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p style={{ color: WARM_NEUTRAL_DARK }} className="text-xs tracking-wide">
            &copy; Stanford GSB MSx Class of 2025. The Best Ever.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;