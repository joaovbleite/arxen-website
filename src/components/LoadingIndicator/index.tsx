import React from 'react';

interface LoadingIndicatorProps {
  isLoading: boolean;
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ isLoading }) => {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-white z-[2000] flex flex-col items-center justify-center transition-opacity duration-300">
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