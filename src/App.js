import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import ChatArea from './components/ChatArea';
import LoginPage from './components/LoginPage';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { FirestoreProvider } from './contexts/FirestoreContext';
import './App.css';

// Main application component
function AppContent() {
  const { currentUser, loading, error } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  // Initialize with sample chats with various timestamps
  const [chats, setChats] = useState([
    { 
      id: 1, 
      title: 'New Chat',
      messages: [],
      timestamp: new Date(),
      projectId: null
    }
  ]);
  
  const [currentChatId, setCurrentChatId] = useState(1);
  
  // Function to create a new chat
  const createNewChat = () => {
    const newChatId = chats.length > 0 ? Math.max(...chats.map(chat => chat.id)) + 1 : 1;
    const newChat = {
      id: newChatId,
      title: 'New chat',
      messages: [],
      timestamp: new Date(),
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

  // Show loading spinner only during initial auth check
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-700">Loading...</p>
        </div>
      </div>
    );
  }

  // Show error state if there's an error
  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-center text-red-600 p-4 bg-white rounded shadow">
          <p>Error: {error}</p>
        </div>
      </div>
    );
  }

  // Show login page if no user
  if (!currentUser) {
    return <LoginPage />;
  }

  // Show main app if authenticated
  return (
    <FirestoreProvider>
      <div className="flex h-screen bg-gray-100">
        <Sidebar 
          isOpen={isSidebarOpen} 
          setIsOpen={setIsSidebarOpen} 
          chats={chats}
          currentChatId={currentChatId}
          setCurrentChatId={setCurrentChatId}
          createNewChat={createNewChat}
          updateChatProject={updateChatProject}
        />
        <ChatArea 
          isSidebarOpen={isSidebarOpen} 
          setIsSidebarOpen={setIsSidebarOpen}
          currentChat={chats.find(chat => chat.id === currentChatId) || chats[0]}
          user={currentUser}
        />
      </div>
    </FirestoreProvider>
  );
}

// Wrapper with AuthProvider
function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App; 