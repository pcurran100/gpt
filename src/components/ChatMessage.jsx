import React from 'react';
import { FiUser, FiCpu } from 'react-icons/fi';

const ChatMessage = ({ message }) => {
  const { role, content } = message;
  
  const isUser = role === 'user';
  
  return (
    <div className={`flex mb-6 ${isUser ? 'justify-end' : ''}`}>
      {!isUser && (
        <div className="flex-shrink-0 mr-4 mt-1">
          <div className="w-8 h-8 rounded-full bg-deep-plum text-pure-white flex items-center justify-center">
            <FiCpu size={16} />
          </div>
        </div>
      )}
      <div className={`max-w-3xl ${isUser ? 'bg-deep-plum text-pure-white' : 'bg-soft-gray text-dark-espresso'} p-4 rounded-lg`}>
        {typeof content === 'string' ? <p>{content}</p> : content}
      </div>
      {isUser && (
        <div className="flex-shrink-0 ml-4 mt-1">
          <div className="w-8 h-8 rounded-full bg-warm-beige text-deep-plum flex items-center justify-center">
            <FiUser size={16} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatMessage; 