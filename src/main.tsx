import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import faviconSrc from './assets/fave.png'; // Import the favicon

// Dynamically set the favicon
const faviconLink = document.querySelector("link[rel*='icon']") as HTMLLinkElement | null;
if (faviconLink) {
  faviconLink.href = faviconSrc;
  faviconLink.type = 'image/png'; // Ensure type is correct if it was different
} else {
  // If no link[rel*='icon'] tag exists, create one (fallback, though index.html should have it)
  const newFavicon = document.createElement('link');
  newFavicon.rel = 'icon';
  newFavicon.type = 'image/png';
  newFavicon.href = faviconSrc;
  document.head.appendChild(newFavicon);
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
