import React, { useState, useRef, useEffect } from 'react';
import { FiMenu, FiShare, FiCopy, FiThumbsUp, FiThumbsDown, FiRefreshCw, FiSearch, FiPaperclip, FiUser, FiSettings, FiLogOut, FiSmile, FiChevronDown } from 'react-icons/fi';
import ChatMessage from './ChatMessage';

const ChatArea = ({ isSidebarOpen, setIsSidebarOpen, currentChat, user, onLogout }) => {
  const [inputValue, setInputValue] = useState('');
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const dropdownRef = useRef(null);
  
  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowUserDropdown(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle logout
  const handleLogout = (e) => {
    e.preventDefault();
    setShowUserDropdown(false);
    onLogout();
  };

  // Sample content for new chats
  const welcomeMessage = {
    role: 'assistant',
    content: (
      <div className="text-center">
        <h2 className="text-2xl font-medium mb-4">What can I help with?</h2>
      </div>
    )
  };

  // Sample messages for a conversation
  const sampleConversation = [
    {
      role: 'user',
      content: 'How can I improve my website\'s accessibility?'
    },
    {
      role: 'assistant',
      content: (
        <div>
          <p className="mb-3">Here are some key ways to improve your website's accessibility:</p>
          <ol className="list-decimal ml-6 space-y-2">
            <li>Use proper semantic HTML elements</li>
            <li>Ensure sufficient color contrast</li>
            <li>Add alt text to all images</li>
            <li>Make your site keyboard navigable</li>
            <li>Use ARIA attributes where appropriate</li>
            <li>Create a logical tab order</li>
          </ol>
          <p className="mt-3">Would you like me to elaborate on any of these points?</p>
        </div>
      )
    },
    {
      role: 'user',
      content: 'Can you tell me more about semantic HTML elements?'
    },
    {
      role: 'assistant',
      content: (
        <div>
          <p className="mb-3">Semantic HTML elements clearly describe their meaning to both browsers and developers. Using them properly improves accessibility, SEO, and code readability.</p>
          <p className="mb-3">Key semantic elements include:</p>
          <ul className="list-disc ml-6 space-y-2">
            <li><code>&lt;header&gt;</code> - For introductory content or navigation links</li>
            <li><code>&lt;nav&gt;</code> - For navigation menus</li>
            <li><code>&lt;main&gt;</code> - For the main content of the page</li>
            <li><code>&lt;article&gt;</code> - For self-contained compositions</li>
            <li><code>&lt;section&gt;</code> - For thematic grouping of content</li>
            <li><code>&lt;aside&gt;</code> - For content tangentially related to the main content</li>
            <li><code>&lt;footer&gt;</code> - For footer information</li>
          </ul>
          <p className="mt-3">Instead of using generic <code>&lt;div&gt;</code> elements for everything, using these semantic elements helps screen readers and other assistive technologies better understand your content's structure.</p>
        </div>
      )
    }
  ];

  // Get messages for the current chat or show welcome message for new chats
  let messages = currentChat.messages && currentChat.messages.length > 0 
    ? currentChat.messages 
    : [welcomeMessage];
  
  // Special case for "UI Design Discussion" - show a sample conversation
  if (currentChat.title === 'UI Design Discussion') {
    messages = sampleConversation;
  }

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
    }
  };

  // If it's a predefined chat with sample content (except UI Design Discussion which has conversation)
  if (messages.length === 1 && messages[0] === welcomeMessage && 
      sampleContentByTitle[currentChat.title] && 
      currentChat.title !== 'UI Design Discussion') {
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
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3 py-1.5 border border-soft-gray rounded-md text-dark-espresso hover:bg-soft-gray">
            <FiShare size={16} />
            <span>Share</span>
          </button>
          
          {/* User Account Button */}
          <div className="relative" ref={dropdownRef}>
            <button 
              className="flex items-center justify-center w-9 h-9 rounded-full bg-deep-plum text-pure-white ml-2"
              onClick={() => setShowUserDropdown(!showUserDropdown)}
            >
              <FiUser size={18} />
            </button>
            
            {/* User Dropdown Menu */}
            {showUserDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-pure-white shadow-lg rounded-md border border-soft-gray z-20">
                <div className="p-3 border-b border-soft-gray">
                  <div className="font-medium">{user?.name || 'User'}</div>
                  <div className="text-sm text-muted-taupe">{user?.email || 'user@example.com'}</div>
                </div>
                <ul>
                  <li className="hover:bg-soft-gray">
                    <a href="#myGPTs" className="block px-4 py-2 text-dark-espresso">
                      <div className="flex items-center gap-2">
                        <FiSmile size={16} />
                        <span>My GPTs</span>
                      </div>
                    </a>
                  </li>
                  <li className="hover:bg-soft-gray">
                    <a href="#settings" className="block px-4 py-2 text-dark-espresso">
                      <div className="flex items-center gap-2">
                        <FiSettings size={16} />
                        <span>Settings</span>
                      </div>
                    </a>
                  </li>
                  <li className="hover:bg-soft-gray border-t border-soft-gray">
                    <a href="#logout" className="block px-4 py-2 text-dark-espresso" onClick={handleLogout}>
                      <div className="flex items-center gap-2">
                        <FiLogOut size={16} />
                        <span>Log out</span>
                      </div>
                    </a>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
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