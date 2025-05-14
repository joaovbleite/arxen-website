import React, { useState, useEffect } from 'react';

const COOKIE_STORAGE_KEY = 'arxen_cookie_consent';

const CookieConsent: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [isMobileOrTablet, setIsMobileOrTablet] = useState(false);

  useEffect(() => {
    // Check if the device is mobile or tablet
    const checkDeviceType = () => {
      const width = window.innerWidth;
      setIsMobileOrTablet(width < 1024); // Consider devices with width < 1024px as mobile/tablet
    };

    // Initial check
    checkDeviceType();
    
    // Add resize listener
    window.addEventListener('resize', checkDeviceType);

    // Only show on desktop
    if (!isMobileOrTablet) {
      const stored = localStorage.getItem(COOKIE_STORAGE_KEY);
      if (stored !== 'accepted') {
        setVisible(true);
      }
    }

    return () => {
      window.removeEventListener('resize', checkDeviceType);
    };
  }, [isMobileOrTablet]);

  const handleAccept = () => {
    localStorage.setItem(COOKIE_STORAGE_KEY, 'accepted');
    setVisible(false);
  };

  // Don't render on mobile/tablet
  if (isMobileOrTablet || !visible) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-[3000] bg-gray-900 text-white px-4 py-3 text-sm flex flex-col sm:flex-row items-center justify-between shadow-lg animate-slide-in-up">
      <p className="mb-2 sm:mb-0">
        We use cookies to enhance your browsing experience, serve personalized ads or content, and analyze our traffic. By clicking "Accept", you consent to our use of cookies.
      </p>
      <button
        onClick={handleAccept}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
      >
        Accept
      </button>
    </div>
  );
};

export default CookieConsent; 