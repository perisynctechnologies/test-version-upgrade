import React, { useState, useEffect, useRef } from 'react';
import './UpdatePrompt.css';

const UpdatePrompt = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const registrationRef = useRef(null);


  // Add this useEffect
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

  useEffect(() => {
    const handleUpdate = event => {
      if (document.visibilityState === 'visible') {
        registrationRef.current = event.detail;
        setIsVisible(true);
      }
    };

    document.addEventListener('swUpdate', handleUpdate);
    return () => document.removeEventListener('swUpdate', handleUpdate);
  }, []);

 

//   const handleReload = () => {
//     const registration = registrationRef.current;
//     if (registration?.waiting) {
//       setIsUpdating(true);
//       registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      
//       let reloaded = false;
//       const controllerChangeHandler = () => {
//         if (!reloaded) {
//           reloaded = true;
//           window.location.reload();
//         }
//         navigator.serviceWorker.removeEventListener('controllerchange', controllerChangeHandler);
//       };

//       navigator.serviceWorker.addEventListener('controllerchange', controllerChangeHandler);
//     }
//   };

 const handleReload = () => {
    const registration = registrationRef.current;
    if (registration?.waiting) {
      setIsUpdating(true);
      // Tell service worker to skip waiting and activate
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });
    }
  };

  // Add close handler that sets visibility to false
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
            onClick={handleClose}  // Updated to use handleClose
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