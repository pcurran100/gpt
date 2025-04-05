import React from 'react';

const ChatMessage = ({ message }) => {
  const { role, content } = message;
  
  return (
    <div className={`flex mb-6 ${role === 'user' ? 'justify-end' : ''}`}>
      <div className={`max-w-3xl ${role === 'user' ? 'bg-deep-plum text-pure-white' : 'bg-soft-gray text-dark-espresso'} p-4 rounded-lg`}>
        {content}
      </div>
    </div>
  );
};

export default ChatMessage; 