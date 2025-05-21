import React, { useEffect, useState, useRef } from 'react';

const LOCAL_STORAGE_KEY = 'arxen_promo_signup_seen';

const PromoModal: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isMobileOrTablet, setIsMobileOrTablet] = useState(false);

  const formRef = useRef<HTMLFormElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

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

    // Show the popup after 3 seconds only on desktop
    if (!isMobileOrTablet) {
      const timer = setTimeout(() => {
        setOpen(true);
      }, 3000);
      
      // Clean up timer if component unmounts
      return () => {
        clearTimeout(timer);
        window.removeEventListener('resize', checkDeviceType);
      };
    }
    
    return () => {
      window.removeEventListener('resize', checkDeviceType);
    };
  }, [isMobileOrTablet]);

  const handleClose = () => {
    setOpen(false);
    localStorage.setItem(LOCAL_STORAGE_KEY, 'true');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    
    console.log('Notification signup email:', email);
    
    // Submit form to Formspree
    if (formRef.current) {
      formRef.current.submit();
    }
    
    setSubmitted(true);
    localStorage.setItem(LOCAL_STORAGE_KEY, 'true');
    setTimeout(() => setOpen(false), 2500);
  };

  // Don't render on mobile/tablet
  if (isMobileOrTablet || !open) return null;

  return (
    <div className="fixed bottom-24 right-4 z-[2000] animate-fade-in">
      <div className="bg-white rounded-2xl shadow-xl w-[300px] p-4 relative animate-slide-in-up transition-all duration-300 ease-in-out">
        <div className="flex justify-end items-center mb-2">
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close promotional modal"
          >
            &times;
          </button>
        </div>
        
        {submitted ? (
          <div className="text-center py-3 px-2">
            <h3 className="text-lg font-bold text-blue-700 mb-1">Thank you!</h3>
            <p className="text-gray-700 text-xs">You've been added to our notification list. We'll let you know about our special offers!</p>
          </div>
        ) : (
          <>
            <h3 className="text-xl font-bold text-center text-blue-800 mb-1">Stay Updated!</h3>
            <p className="text-center text-gray-700 text-xs mb-3">Sign up to receive notifications about our <span className="font-semibold text-blue-700">exclusive offers</span> and special promotions.</p>
            <form 
              ref={formRef}
              action="https://formspree.io/f/xbloejrb" 
              method="POST"
              onSubmit={handleSubmit} 
              className="space-y-2"
              target="hidden_iframe"
            >
              <input
                type="email"
                id="promo-email"
                name="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-3 py-1.5 text-xs border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <input type="hidden" name="form-type" value="promo-subscription" />
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-1.5 rounded-lg font-medium transition-colors text-xs"
              >
                Sign Up for Notifications
              </button>
            </form>
            <p className="text-xs text-gray-500 text-center mt-2">We respect your privacy and won't spam you.</p>
          </>
        )}
      </div>
      {/* Hidden iframe for form submission */}
      <iframe name="hidden_iframe" id="hidden_iframe" ref={iframeRef} style={{ display: 'none' }}></iframe>
    </div>
  );
};

export default PromoModal; 