import React, { useState, useEffect } from 'react';
import { ShuttleProvider } from './context/ShuttleContext';
import Layout from './components/Layout';
import ShuttleRegistration from './components/ShuttleRegistration';
import AdminView from './components/AdminView';
import MenuView from './components/MenuView';

const ADMIN_HASH = '#/admin-shuttle-view';

function App() {
  // Log initial hash on component mount for App
  // console.log('[App.tsx] Initial window.location.hash:', window.location.hash);
  
  const [showAdminView, setShowAdminView] = useState(window.location.hash === ADMIN_HASH);
  // console.log('[App.tsx] Initial showAdminView state:', window.location.hash === ADMIN_HASH);

  // Set default activeView to 'register' (Shuttle Planner)
  const [activeView, setActiveView] = useState<'register' | 'menu'>('register');

  useEffect(() => {
    // console.log('[App.tsx] useEffect triggered. Adding hashchange listener.');
    const handleHashChange = () => {
      const currentHash = window.location.hash;
      // console.log('[App.tsx] hashchange event detected. Current hash:', currentHash);
      const shouldShowAdmin = currentHash === ADMIN_HASH;
      // console.log('[App.tsx] Should show admin based on hash?:', shouldShowAdmin);
      setShowAdminView(shouldShowAdmin);

      if (shouldShowAdmin) {
        // If admin view is shown, non-admin views are not active.
      } else {
        // If not admin, and current activeView is not a valid tab, default to 'register'
        // This handles cases where hash might change to something unexpected non-admin.
        if (activeView !== 'register' && activeView !== 'menu') {
          // setActiveView('register'); // Already handled by initial state and layout interactions
        }
      }
    };

    window.addEventListener('hashchange' , handleHashChange);
    handleHashChange(); // Initial check

    return () => {
      // console.log('[App.tsx] useEffect cleanup. Removing hashchange listener.');
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []); // Intentionally empty: setShowAdminView is stable, activeView logic should not cause re-runs based on its own changes within this effect.

  // console.log('[App.tsx] Rendering. Current showAdminView state:', showAdminView);
  // console.log('[App.tsx] Rendering. Current activeView state:', activeView);

  const renderMainContent = () => {
    if (showAdminView) {
      return <AdminView />;
    }
    if (activeView === 'menu') {
      return <MenuView />;
    }
    // Default to ShuttleRegistration (which is the 'register' view)
    return <ShuttleRegistration />;
  };

  return (
    <ShuttleProvider>
      <Layout activeView={activeView} setActiveView={setActiveView}>
        {renderMainContent()}
      </Layout>
    </ShuttleProvider>
  );
}

export default App;