import React, { useState } from 'react';

const FeedbackButtons = ({ messageId }) => {
  const [feedbackGiven, setFeedbackGiven] = useState(false);
  const [wasHelpful, setWasHelpful] = useState(null);
  
  const handleFeedback = (isHelpful) => {
    setFeedbackGiven(true);
    setWasHelpful(isHelpful);
    
    // In a real app, this would send the feedback to a server
    console.log(`Feedback for message ${messageId}: ${isHelpful ? 'Helpful' : 'Not helpful'}`);
  };
  
  if (feedbackGiven) {
    return (
      <div className="mt-2 text-xs text-gray-500">
        {wasHelpful 
          ? 'Thanks for your feedback! We\'re glad this was helpful.' 
          : 'Thanks for your feedback. We\'ll work to improve our responses.'}
      </div>
    );
  }

  return (
    <div className="mt-2 pt-2 border-t border-gray-200">
      <p className="text-xs text-gray-500 mb-1">Was this helpful?</p>
      <div className="flex space-x-2">
        <button 
          onClick={() => handleFeedback(true)}
          className="text-xs px-2 py-1 rounded bg-green-100 hover:bg-green-200 text-green-700 transition-colors"
        >
          Yes
        </button>
        <button 
          onClick={() => handleFeedback(false)}
          className="text-xs px-2 py-1 rounded bg-red-100 hover:bg-red-200 text-red-700 transition-colors"
        >
          No
        </button>
      </div>
    </div>
  );
};

export default FeedbackButtons; 