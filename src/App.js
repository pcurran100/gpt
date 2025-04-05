import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import ChatArea from './components/ChatArea';
import './App.css';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  return (
    <div className="flex h-screen bg-soft-gray">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      
      {/* Main Chat Area */}
      <ChatArea isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
    </div>
  );
}

export default App; 