import React from 'react';

interface FeedbackProps {
  messageId: number;
  onFeedback: (messageId: number, isHelpful: boolean) => void;
  feedbackGiven?: boolean;
  isHelpful?: boolean;
}

/**
 * A component that renders feedback buttons for chat responses
 */
const ChatBotFeedback: React.FC<FeedbackProps> = ({ 
  messageId, 
  onFeedback, 
  feedbackGiven = false, 
  isHelpful = false 
}) => {
  if (feedbackGiven) {
    return (
      <div className="mt-2 text-xs text-gray-500">
        {isHelpful 
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
          onClick={() => onFeedback(messageId, true)}
          className="text-xs px-2 py-1 rounded bg-green-100 hover:bg-green-200 text-green-700 transition-colors"
        >
          Yes
        </button>
        <button 
          onClick={() => onFeedback(messageId, false)}
          className="text-xs px-2 py-1 rounded bg-red-100 hover:bg-red-200 text-red-700 transition-colors"
        >
          No
        </button>
      </div>
    </div>
  );
};

export default ChatBotFeedback; 