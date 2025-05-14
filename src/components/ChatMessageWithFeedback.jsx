import React from 'react';
import FeedbackButtons from './FeedbackButtons';

// This is a wrapper component that can be used to add feedback to any chat message
const ChatMessageWithFeedback = ({ message, showFeedback = false }) => {
  const { text, timestamp, isUser } = message;
  const messageId = message.id || `msg_${timestamp}`;
  
  return (
    <div className={`chat-message ${isUser ? 'user-message' : 'bot-message'}`}>
      <div className="message-content">
        {text}
      </div>
      
      {/* Only show feedback for bot messages when showFeedback is true */}
      {!isUser && showFeedback && (
        <FeedbackButtons messageId={messageId} />
      )}
    </div>
  );
};

export default ChatMessageWithFeedback;

/*
Usage example in ChatBot.tsx:

import ChatMessageWithFeedback from './ChatMessageWithFeedback';

// In the render function, when mapping messages:
{messages.map((message, index) => (
  <ChatMessageWithFeedback 
    key={index} 
    message={message} 
    showFeedback={!message.isUser && !message.type} // Only show for basic bot text messages
  />
))}
*/ 