import React from 'react';
import { ShuttleProvider } from './context/ShuttleContext';
import Layout from './components/Layout';
import ShuttleRegistration from './components/ShuttleRegistration';

function App() {
  return (
    <ShuttleProvider>
      <Layout>
        <ShuttleRegistration />
      </Layout>
    </ShuttleProvider>
  );
}

export default App;