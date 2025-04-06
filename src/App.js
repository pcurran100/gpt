import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import ChatArea from './components/ChatArea';
import './App.css';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  // Initialize with sample chats with various timestamps
  const [chats, setChats] = useState([
    { 
      id: 1, 
      title: 'Color Palette Breakdown', 
      messages: [],
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // Yesterday
      projectId: null
    },
    { 
      id: 2, 
      title: 'UI Design Discussion', 
      messages: [],
      timestamp: new Date(), // Today
      projectId: null
    },
    { 
      id: 3, 
      title: 'Energy Storage Calculations', 
      messages: [],
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      projectId: 1 // Assigned to Commercial Energy Storage project
    },
    { 
      id: 4, 
      title: 'Weekly Meeting Notes', 
      messages: [],
      timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      projectId: null
    },
    { 
      id: 5, 
      title: 'Monthly Budget Review', 
      messages: [],
      timestamp: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000), // 20 days ago
      projectId: null
    },
    { 
      id: 6, 
      title: 'Product Launch Plan', 
      messages: [],
      timestamp: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000), // 45 days ago
      projectId: null
    }
  ]);
  
  const [currentChatId, setCurrentChatId] = useState(2); // Set the "Today" chat as current
  
  // Function to create a new chat
  const createNewChat = () => {
    const newChatId = chats.length > 0 ? Math.max(...chats.map(chat => chat.id)) + 1 : 1;
    const newChat = {
      id: newChatId,
      title: 'New chat',
      messages: [],
      timestamp: new Date(), // Set to current time - this ensures it appears at the top of Today
      projectId: null
    };
    setChats([...chats, newChat]);
    setCurrentChatId(newChatId);
  };
  
  // Function to update a chat's project association (will be used for drag and drop)
  const updateChatProject = (chatId, projectId) => {
    setChats(chats.map(chat => 
      chat.id === chatId ? { ...chat, projectId } : chat
    ));
  };
  
  return (
    <div className="flex h-screen bg-soft-gray">
      {/* Sidebar */}
      <Sidebar 
        isOpen={isSidebarOpen} 
        setIsOpen={setIsSidebarOpen} 
        chats={chats}
        currentChatId={currentChatId}
        setCurrentChatId={setCurrentChatId}
        createNewChat={createNewChat}
        updateChatProject={updateChatProject}
      />
      
      {/* Main Chat Area */}
      <ChatArea 
        isSidebarOpen={isSidebarOpen} 
        setIsSidebarOpen={setIsSidebarOpen}
        currentChat={chats.find(chat => chat.id === currentChatId) || chats[0]}
      />
    </div>
  );
}

export default App; 