import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { PostHogProvider } from 'posthog-js/react';

// Temporarily disable StrictMode to prevent double-mounting
createRoot(document.getElementById('root')!).render(
  <PostHogProvider
    apiKey={import.meta.env.VITE_PUBLIC_POSTHOG_KEY}
    options={{
      api_host: import.meta.env.VITE_PUBLIC_POSTHOG_HOST,
      capture_exceptions: true, // This enables capturing exceptions using Error Tracking, set to false if you don't want this
      debug: import.meta.env.MODE === 'development',
    }}
  >
    <App />
  </PostHogProvider>
);
