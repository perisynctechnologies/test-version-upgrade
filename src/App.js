import { useEffect } from 'react';
import './App.css';
import UpdatePrompt from './components/UpdatePrompt';

function App() {
  useEffect(() => {
    const handleToastVisibility = (e) => {
      if (e.detail) {
        // Toast visible - lock scroll
        document.body.style.overflow = 'hidden';
        document.documentElement.style.paddingBottom = '100px'; // Space for toast
      } else {
        // Toast hidden - restore scroll
        document.body.style.overflow = '';
        document.documentElement.style.paddingBottom = '';
      }
    };
    
    document.addEventListener('toastVisibility', handleToastVisibility);
    
    // Cleanup event listener on unmount
    return () => {
      document.removeEventListener('toastVisibility', handleToastVisibility);
      
      // Ensure scroll is restored if component unmounts while toast is visible
      document.body.style.overflow = '';
      document.documentElement.style.paddingBottom = '';
    };
  }, []);

  return (
    <div className="App">
      <UpdatePrompt />
      <div className="app-content">
        {/* Your app content here */}
        <header>
          <h1>My Application</h1>
        </header>
        <main>
          <p>Welcome to the app! - Friday 27th June - 01:01AM</p>
        </main>
      </div>
    </div>
  );
}

export default App;