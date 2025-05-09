import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 flex flex-col">
      <header className="bg-[#8C1515] text-white shadow-md">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-center py-5">
            <div className="flex items-center">
              <img 
                src="src/assets/StanfordGSB_SmallLogo.jpg" 
                alt="Stanford GSB Logo" 
                className="h-10 md:h-12 mr-4"
              />
              <div>
                <h1 className="text-2xl md:text-3xl font-serif font-semibold tracking-tight">Rosewood MSx '25 Finale</h1>
                <p className="text-sm md:text-base opacity-80 tracking-wide">Shuttle Planner</p>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-8 md:pt-6 md:pb-12 flex-grow">
        {children}
      </main>
      
      <footer className="bg-gray-100 border-t border-gray-200 py-4">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-600 text-sm">
          <p>&copy;Stanford GSB MSx Class of 2025. The Best Ever.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;