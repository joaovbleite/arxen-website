import React, { useEffect, useState } from 'react';

interface LoadingIndicatorProps {
  isLoading: boolean;
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ isLoading }) => {
  // Use state to manage visibility for smooth transitions
  const [isVisible, setIsVisible] = useState(isLoading);
  
  // Add transition effect to prevent abrupt DOM changes
  useEffect(() => {
    if (isLoading) {
      setIsVisible(true);
    } else {
      // Delay hiding to allow animation to complete
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);
  
  // If not visible at all, render nothing to avoid any impact on layout
  if (!isVisible && !isLoading) return null;

  return (
    <div 
      className={`fixed inset-0 bg-white z-[2000] flex flex-col items-center justify-center transition-opacity duration-300 pointer-events-none ${isLoading ? 'opacity-100' : 'opacity-0'}`}
      aria-hidden={!isLoading}
      style={{ 
        // Force GPU acceleration for smoother animations
        transform: 'translateZ(0)',
        willChange: 'opacity'
      }}
    >
      <div className="flex flex-col items-center" style={{ width: '150px', height: '150px' }}>
        <div className="w-32 h-32 flex items-center justify-center mb-6">
          <img 
            src="https://i.postimg.cc/SNx9NN2x/Chat-GPT-Image-May-13-2025-12-34-23-PM-removebg-preview.png" 
            alt="ARXEN Construction" 
            className="h-32 w-32 animate-pulse"
            width="128"
            height="128"
            // Prevent image flashing on load
            style={{ objectFit: 'contain' }}
          />
        </div>
        <div className="w-24 h-1 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-blue-600 animate-progress-bar"></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingIndicator; 