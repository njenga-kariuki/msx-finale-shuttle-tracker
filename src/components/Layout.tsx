import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <header className="bg-[#8C1515] text-white shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row items-center justify-center">
            <div className="flex items-center">
              <img 
                src="https://www.gsb.stanford.edu/sites/default/files/stanford-gsb-logo-rev.svg" 
                alt="Stanford GSB Logo" 
                className="h-8 md:h-10 mr-4"
              />
              <div>
                <h1 className="text-xl md:text-2xl font-serif font-medium tracking-wide">Rosewood MSx '25: Finale</h1>
                <p className="text-xs md:text-sm opacity-90 tracking-wide">Arrival Shuttle Service</p>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
      
      <footer className="bg-gray-100 border-t border-gray-200 py-4">
        <div className="container mx-auto px-4 text-center text-gray-600 text-sm">
          <p>Shuttle will continue to run from Rosewood to GSB pickup until 9pm</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;