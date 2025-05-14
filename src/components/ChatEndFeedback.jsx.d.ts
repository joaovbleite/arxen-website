import * as React from 'react';

export interface ChatEndFeedbackProps {
  onClose: () => void;
  onFeedbackComplete: (rating: number) => void;
}

declare const ChatEndFeedback: React.FC<ChatEndFeedbackProps>;
export default ChatEndFeedback; 