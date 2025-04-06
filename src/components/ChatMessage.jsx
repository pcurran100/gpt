import React from 'react';
import { FiUser, FiCpu, FiCopy, FiRefreshCw } from 'react-icons/fi';
import FileAttachment from './FileAttachment';

const ChatMessage = ({ message, isLatest = false }) => {
  const { role, content, attachments = [] } = message;
  
  const isUser = role === 'user';
  
  return (
    <div className={`flex mb-6 ${isUser ? 'justify-end' : ''} relative group`}>
      {!isUser && (
        <div className="flex-shrink-0 mr-4 mt-1">
          <div className="w-8 h-8 rounded-full bg-deep-plum text-pure-white flex items-center justify-center">
            <FiCpu size={16} />
          </div>
        </div>
      )}
      <div className={`max-w-3xl ${isUser ? 'bg-deep-plum text-pure-white' : 'bg-soft-gray text-dark-espresso'} p-4 rounded-lg`}>
        {typeof content === 'string' ? <p>{content}</p> : content}
        
        {/* Render attachments if any */}
        {attachments && attachments.length > 0 && (
          <div className="mt-3 space-y-2">
            {attachments.map((attachment, index) => (
              <FileAttachment key={attachment.filePath || index} file={attachment} />
            ))}
          </div>
        )}
        
        {/* Message actions - only for assistant messages */}
        {!isUser && (
          <div className={`flex mt-3 pt-2 border-t border-gray-200 gap-3 ${isLatest ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity`}>
            <button className="text-muted-taupe hover:text-deep-plum" aria-label="Copy message">
              <FiCopy size={16} />
            </button>
            <button className="text-muted-taupe hover:text-deep-plum" aria-label="Regenerate response">
              <FiRefreshCw size={16} />
            </button>
          </div>
        )}
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