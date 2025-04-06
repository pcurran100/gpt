import React, { useState } from 'react';
import { FiMenu, FiShare, FiCopy, FiThumbsUp, FiThumbsDown, FiRefreshCw, FiSearch, FiPaperclip } from 'react-icons/fi';
import ChatMessage from './ChatMessage';

const ChatArea = ({ isSidebarOpen, setIsSidebarOpen, currentChat }) => {
  const [inputValue, setInputValue] = useState('');
  
  // Sample content for new chats
  const welcomeMessage = {
    role: 'assistant',
    content: (
      <div className="text-center">
        <h2 className="text-2xl font-medium mb-4">What can I help with?</h2>
      </div>
    )
  };

  // Get messages for the current chat or show welcome message for new chats
  const messages = currentChat.messages && currentChat.messages.length > 0 
    ? currentChat.messages 
    : [welcomeMessage];

  // Sample messages for specific predefined chats
  const sampleContentByTitle = {
    'Color Palette Breakdown': {
      role: 'assistant',
      content: (
        <div>
          <h2 className="text-xl font-medium mb-4">Color Palette Breakdown</h2>
          <div className="mb-6">
            <h3 className="font-medium mb-2">Primary Colors</h3>
            <ul className="list-disc ml-6 space-y-2">
              <li>Deep Plum (#6D214F)</li>
              <li>Warm Beige (#E3C4A8)</li>
            </ul>
          </div>
          <div className="mb-6">
            <h3 className="font-medium mb-2">Neutral Base</h3>
            <ul className="list-disc ml-6 space-y-2">
              <li>Pure White (#FFFFFF)</li>
              <li>Soft Warm Gray (#F4F1ED)</li>
            </ul>
          </div>
          <div className="mb-6">
            <h3 className="font-medium mb-2">Accents</h3>
            <ul className="list-disc ml-6 space-y-2">
              <li>Olive Green (#3D9970)</li>
              <li>Burnt Orange (#D35400)</li>
              <li>Crimson Red (#C0392B)</li>
            </ul>
          </div>
          <div className="mb-6">
            <h3 className="font-medium mb-2">Typography & Contrast</h3>
            <ul className="list-disc ml-6 space-y-2">
              <li>Dark Espresso (#3B2C35)</li>
              <li>Muted Taupe (#8E8275)</li>
            </ul>
          </div>
        </div>
      )
    },
    'UI Design Discussion': {
      role: 'assistant',
      content: (
        <div>
          <h2 className="text-xl font-medium mb-4">UI Design Discussion</h2>
          <p className="mb-4">Here are some key UI design principles to consider:</p>
          <ul className="list-disc ml-6 space-y-2">
            <li>Focus on user needs and goals</li>
            <li>Create clear visual hierarchy</li>
            <li>Use consistent design patterns</li>
            <li>Ensure accessibility for all users</li>
            <li>Design for mobile-first when appropriate</li>
          </ul>
        </div>
      )
    }
  };

  // If it's a predefined chat with sample content
  if (messages.length === 1 && messages[0] === welcomeMessage && sampleContentByTitle[currentChat.title]) {
    messages[0] = sampleContentByTitle[currentChat.title];
  }

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    
    // Form submission logic would go here
    setInputValue('');
  };

  return (
    <div className="flex-1 flex flex-col bg-pure-white relative overflow-hidden">
      {/* Header */}
      <header className="border-b border-soft-gray p-4 flex items-center justify-between bg-pure-white z-10">
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 rounded-md hover:bg-soft-gray"
        >
          <FiMenu className="text-dark-espresso" />
        </button>
        <div className="flex-1 text-center">
          <span className="font-medium text-dark-espresso">{currentChat.title}</span>
        </div>
        <button className="flex items-center gap-2 px-3 py-1.5 border border-soft-gray rounded-md text-dark-espresso hover:bg-soft-gray">
          <FiShare size={16} />
          <span>Share</span>
        </button>
      </header>

      {/* Main Chat Content */}
      <div className="flex-1 overflow-y-auto p-4 pb-32">
        {messages.map((message, index) => (
          <ChatMessage key={index} message={message} />
        ))}
      </div>

      {/* Message Actions - Only show if there are messages */}
      {messages.length > 0 && messages[0] !== welcomeMessage && (
        <div className="absolute bottom-24 left-0 right-0 flex justify-center space-x-2 p-2">
          <button className="p-2 rounded-md hover:bg-soft-gray text-muted-taupe">
            <FiCopy />
          </button>
          <button className="p-2 rounded-md hover:bg-soft-gray text-muted-taupe">
            <FiThumbsUp />
          </button>
          <button className="p-2 rounded-md hover:bg-soft-gray text-muted-taupe">
            <FiThumbsDown />
          </button>
          <button className="p-2 rounded-md hover:bg-soft-gray text-muted-taupe">
            <FiRefreshCw />
          </button>
        </div>
      )}

      {/* Input Area */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-pure-white border-t border-soft-gray">
        <form onSubmit={handleSubmit} className="relative max-w-3xl mx-auto">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask anything"
            className="w-full p-4 pr-14 rounded-lg border border-soft-gray focus:outline-none focus:ring-2 focus:ring-deep-plum focus:border-transparent resize-none"
            rows={1}
            style={{ minHeight: '56px' }}
          />
          <div className="absolute bottom-3 right-2 flex items-center">
            <button type="button" className="p-2 text-muted-taupe hover:text-deep-plum">
              <FiPaperclip />
            </button>
            <button type="button" className="p-2 text-muted-taupe hover:text-deep-plum ml-1">
              <FiSearch />
            </button>
          </div>
        </form>
        <div className="text-center mt-2 text-xs text-muted-taupe">
          ChatGPT can make mistakes. Check important info.
        </div>
      </div>
    </div>
  );
};

export default ChatArea; 