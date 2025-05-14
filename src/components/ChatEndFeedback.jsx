import React, { useState } from 'react';

/**
 * Component that displays feedback options when ending a chat
 */
const ChatEndFeedback = ({ onClose, onFeedbackComplete }) => {
  const [feedbackGiven, setFeedbackGiven] = useState(false);
  const [rating, setRating] = useState(null);
  
  const handleRating = (selectedRating) => {
    setRating(selectedRating);
    setFeedbackGiven(true);
    
    // Log the feedback (in a real app, send to server)
    console.log(`Chat end feedback: ${selectedRating}/5 stars`);
    
    // Notify parent component feedback is complete
    setTimeout(() => {
      if (onFeedbackComplete) {
        onFeedbackComplete(selectedRating);
      }
      
      // Close the chat after feedback
      setTimeout(() => {
        if (onClose) {
          onClose();
        }
      }, 1500);
    }, 1000);
  };
  
  if (feedbackGiven) {
    return (
      <div className="p-4 bg-blue-50 rounded-lg text-center">
        <p className="text-blue-700 font-medium mb-2">Thanks for your feedback!</p>
        <p className="text-sm text-blue-600">We appreciate your input and will use it to improve our service.</p>
        <p className="text-xs text-blue-500 mt-2">Closing chat...</p>
      </div>
    );
  }
  
  return (
    <div className="p-4 bg-blue-50 rounded-lg">
      <p className="text-center text-blue-700 font-medium mb-3">How was your experience today?</p>
      <div className="flex justify-center space-x-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => handleRating(star)}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-white text-yellow-500 hover:bg-yellow-50 border border-yellow-300"
          >
            {star}
          </button>
        ))}
      </div>
      <p className="text-center text-xs text-blue-600 mt-2">Your feedback helps us improve</p>
      <div className="mt-3 text-center">
        <button 
          onClick={() => onClose && onClose()}
          className="text-xs text-gray-500 hover:underline"
        >
          Skip and close
        </button>
      </div>
    </div>
  );
};

export default ChatEndFeedback; 