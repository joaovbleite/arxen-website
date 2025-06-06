import React, { useEffect } from 'react';

interface LoadingIndicatorProps {
  isLoading: boolean;
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ isLoading }) => {
  // Safety timeout - if loading takes too long, auto-hide after 5 seconds (reduced from 10)
  useEffect(() => {
    if (isLoading) {
      console.log('LoadingIndicator: Loading started');
      
      // Make sure any pending hide operations are canceled
      const existingLoaderElement = document.getElementById('safety-timeout-loader');
      if (existingLoaderElement) {
        existingLoaderElement.classList.remove('opacity-0');
        existingLoaderElement.style.pointerEvents = 'auto';
      }
      
      const timeoutId = setTimeout(() => {
        // Add a class to fade out the loader if it's still visible after 5 seconds
        const loaderElement = document.getElementById('safety-timeout-loader');
        if (loaderElement) {
          console.log('LoadingIndicator: Safety timeout reached, hiding loader');
          loaderElement.classList.add('opacity-0');
          loaderElement.style.pointerEvents = 'none';
        }
      }, 5000); // 5 seconds timeout (reduced from 10)
      
      return () => {
        clearTimeout(timeoutId);
        // Ensure loader is hidden when component unmounts
        const loaderElement = document.getElementById('safety-timeout-loader');
        if (loaderElement) {
          loaderElement.classList.add('opacity-0');
          loaderElement.style.pointerEvents = 'none';
        }
        console.log('LoadingIndicator: Loading ended or component unmounted');
      };
    } else {
      // Ensure loader is hidden when isLoading changes to false
      const loaderElement = document.getElementById('safety-timeout-loader');
      if (loaderElement) {
        loaderElement.classList.add('opacity-0');
        loaderElement.style.pointerEvents = 'none';
      }
    }
  }, [isLoading]);

  if (!isLoading) return null;

  return (
    <div 
      id="safety-timeout-loader"
      className="fixed inset-0 bg-white z-[2000] flex flex-col items-center justify-center transition-opacity duration-500"
    >
      <div className="flex flex-col items-center">
        <img 
          src="https://i.postimg.cc/SNx9NN2x/Chat-GPT-Image-May-13-2025-12-34-23-PM-removebg-preview.png" 
          alt="ARXEN Construction" 
          className="h-32 w-auto mb-6 animate-pulse"
        />
        <div className="w-24 h-1 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-blue-600 animate-progress-bar"></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingIndicator; 