import React, { useState, useEffect, useRef } from 'react';
import './UpdatePrompt.css';

const UpdatePrompt = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const registrationRef = useRef(null);

  // Listen for FORCE_RELOAD messages from service worker
  useEffect(() => {
    const handleForceReload = (event) => {
      if (event.data?.type === 'FORCE_RELOAD') {
        window.location.reload();
      }
    };
    
    navigator.serviceWorker.addEventListener('message', handleForceReload);
    
    return () => {
      navigator.serviceWorker.removeEventListener('message', handleForceReload);
    };
  }, []);

  // Add this useEffect for toast visibility events
  useEffect(() => {
    // Dispatch event when visibility changes
    const event = new CustomEvent('toastVisibility', { detail: isVisible });
    document.dispatchEvent(event);
    
    // Cleanup: Notify when toast is hidden
    return () => {
      if (isVisible) {
        const hideEvent = new CustomEvent('toastVisibility', { detail: false });
        document.dispatchEvent(hideEvent);
      }
    };
  }, [isVisible]);

  // Enhanced update detection with dual mechanisms
  useEffect(() => {
    // Existing swUpdate listener
    const handleUpdateEvent = event => {
      if (document.visibilityState === 'visible') {
        registrationRef.current = event.detail;
        setIsVisible(true);
      }
    };

    // New: Listen for version messages from service worker
    const handleVersionMessage = (event) => {
      if (event.data?.type === 'NEW_VERSION_AVAILABLE') {
        console.log('New version detected via service worker:', event.data.version);
        setIsVisible(true);
      }
    };

    // Set up both event listeners
    document.addEventListener('swUpdate', handleUpdateEvent);
    navigator.serviceWorker.addEventListener('message', handleVersionMessage);
    
    return () => {
      // Clean up both event listeners
      document.removeEventListener('swUpdate', handleUpdateEvent);
      navigator.serviceWorker.removeEventListener('message', handleVersionMessage);
    };
  }, []);

  const handleReload = () => {
    const registration = registrationRef.current;
    if (registration?.waiting) {
      setIsUpdating(true);
      // Tell service worker to skip waiting and activate
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });
    }
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="update-toast" role="alert" aria-live="assertive">
      <div className="toast-content">
        <p>A new version is available!</p>
        <div className="toast-actions">
          <button
            onClick={handleReload}
            disabled={isUpdating}
            className="update-btn"
            aria-busy={isUpdating}
            aria-label={isUpdating ? 'Updating application' : 'Update now'}
          >
            {isUpdating ? (
              <>
                <span className="spinner" aria-hidden="true"></span>
                Updating...
              </>
            ) : 'Update Now'}
          </button>
          <button
            onClick={handleClose}
            className="dismiss-btn"
            disabled={isUpdating}
          >
            Later
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdatePrompt;