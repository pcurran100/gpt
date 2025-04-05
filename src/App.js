import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import ChatArea from './components/ChatArea';
import './App.css';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [chats, setChats] = useState([{ id: 1, title: 'Color Palette Breakdown', messages: [] }]);
  const [currentChatId, setCurrentChatId] = useState(1);
  
  // Function to create a new chat
  const createNewChat = () => {
    const newChatId = chats.length > 0 ? Math.max(...chats.map(chat => chat.id)) + 1 : 1;
    const newChat = {
      id: newChatId,
      title: 'New chat',
      messages: []
    };
    setChats([...chats, newChat]);
    setCurrentChatId(newChatId);
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