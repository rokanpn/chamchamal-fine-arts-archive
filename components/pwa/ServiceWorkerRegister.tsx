'use client';

import { useEffect } from 'react';

export function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      const registerSW = () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((registration) => {
            console.log('Chamchamal PWA ServiceWorker registered with scope:', registration.scope);
            // Check for service worker updates immediately on load
            registration.update().catch(() => {});
          })
          .catch((error) => {
            console.warn('ServiceWorker registration skipped or failed:', error);
          });
      };

      if (document.readyState === 'complete') {
        registerSW();
      } else {
        window.addEventListener('load', registerSW);
      }

      // Proactively check for SW updates when user re-opens or switches back to the tab/app
      const handleVisibilityChange = () => {
        if (document.visibilityState === 'visible') {
          navigator.serviceWorker.ready
            .then((registration) => registration.update())
            .catch(() => {});
        }
      };
      document.addEventListener('visibilitychange', handleVisibilityChange);

      return () => {
        window.removeEventListener('load', registerSW);
        document.removeEventListener('visibilitychange', handleVisibilityChange);
      };
    }
  }, []);

  return null;
}
