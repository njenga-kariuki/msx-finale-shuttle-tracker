import React, { useState, useEffect } from 'react';
import { ShuttleProvider } from './context/ShuttleContext';
import Layout from './components/Layout';
import ShuttleRegistration from './components/ShuttleRegistration';
import AdminView from './components/AdminView';

const ADMIN_HASH = '#/admin-shuttle-view';

function App() {
  // Log initial hash on component mount for App
  console.log('[App.tsx] Initial window.location.hash:', window.location.hash);
  
  const [showAdminView, setShowAdminView] = useState(window.location.hash === ADMIN_HASH);
  console.log('[App.tsx] Initial showAdminView state:', window.location.hash === ADMIN_HASH);

  useEffect(() => {
    console.log('[App.tsx] useEffect triggered. Adding hashchange listener.');
    const handleHashChange = () => {
      const currentHash = window.location.hash;
      console.log('[App.tsx] hashchange event detected. Current hash:', currentHash);
      const shouldShowAdmin = currentHash === ADMIN_HASH;
      console.log('[App.tsx] Should show admin based on hash?:', shouldShowAdmin);
      setShowAdminView(shouldShowAdmin);
    };

    window.addEventListener('hashchange', handleHashChange);
    // Call it once on mount to ensure the state is correct if the hash is already set
    handleHashChange(); 

    return () => {
      console.log('[App.tsx] useEffect cleanup. Removing hashchange listener.');
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []); // Empty dependency array ensures this runs once on mount and cleans up on unmount

  console.log('[App.tsx] Rendering. Current showAdminView state:', showAdminView);

  return (
    <ShuttleProvider>
      <Layout>
        {showAdminView ? <AdminView /> : <ShuttleRegistration />}
      </Layout>
    </ShuttleProvider>
  );
}

export default App;