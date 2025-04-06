import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import * as firestoreService from '../services/firestoreService';
import * as storageService from '../services/storageService';

// Create context
const FirestoreContext = createContext();

// Context Provider component
export const FirestoreProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [folders, setFolders] = useState([]);
  const [currentFolder, setCurrentFolder] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [currentConversation, setCurrentConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Initialize user data when they log in
  useEffect(() => {
    const initializeUserData = async () => {
      if (!currentUser) {
        setFolders([]);
        setCurrentFolder(null);
        setConversations([]);
        setCurrentConversation(null);
        setMessages([]);
        setLoading(false);
        return;
      }
      
      setLoading(true);
      
      try {
        // Create/get user document
        await firestoreService.createUserDocument(currentUser.uid, {
          name: currentUser.displayName,
          email: currentUser.email,
          photoURL: currentUser.photoURL
        });
        
        // Load folders
        await loadFolders();
      } catch (err) {
        console.error('Error initializing user data:', err);
        setError('Failed to load user data. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    initializeUserData();
  }, [currentUser]);
  
  // Load folders for current user
  const loadFolders = async () => {
    if (!currentUser) return;
    
    try {
      const userFolders = await firestoreService.getUserFolders(currentUser.uid);
      setFolders(userFolders);
      
      // Set current folder to the first one if not already set
      if (userFolders.length > 0 && !currentFolder) {
        setCurrentFolder(userFolders[0]);
        // Load conversations for this folder
        await loadConversations(userFolders[0].id);
      }
    } catch (err) {
      console.error('Error loading folders:', err);
      setError('Failed to load folders. Please try again.');
    }
  };
  
  // Load conversations for a folder
  const loadConversations = async (folderId) => {
    if (!currentUser || !folderId) return;
    
    try {
      const folderConversations = await firestoreService.getFolderConversations(currentUser.uid, folderId);
      setConversations(folderConversations);
      
      // Reset current conversation when changing folders
      setCurrentConversation(null);
      setMessages([]);
    } catch (err) {
      console.error('Error loading conversations:', err);
      setError('Failed to load conversations. Please try again.');
    }
  };
  
  // Load messages for a conversation
  const loadMessages = async (conversationId) => {
    if (!currentUser || !currentFolder || !conversationId) return;
    
    try {
      const conversationMessages = await firestoreService.getConversationMessages(
        currentUser.uid,
        currentFolder.id,
        conversationId
      );
      
      // Convert stored message content back to React elements if needed
      // This is a simplified approach - in a real app you'd need a more robust solution
      // to handle storing and retrieving React elements or rich content
      const processedMessages = conversationMessages.map(message => {
        // If the message content is a string that looks like HTML, parse it
        if (typeof message.content === 'string' && message.content.startsWith('<div')) {
          // In a real app, you'd use a proper HTML parser or sanitizer here
          return {
            ...message,
            content: message.content
          };
        }
        return message;
      });
      
      setMessages(processedMessages);
    } catch (err) {
      console.error('Error loading messages:', err);
      setError('Failed to load messages. Please try again.');
    }
  };
  
  // Create a new folder
  const createNewFolder = async (folderName) => {
    if (!currentUser) return null;
    
    try {
      const folderRef = await firestoreService.createFolder(currentUser.uid, { name: folderName });
      await loadFolders();
      return folderRef;
    } catch (err) {
      console.error('Error creating folder:', err);
      setError('Failed to create folder. Please try again.');
      return null;
    }
  };
  
  // Create a new conversation
  const createNewConversation = async (title) => {
    if (!currentUser || !currentFolder) return null;
    
    try {
      const conversationRef = await firestoreService.createConversation(
        currentUser.uid,
        currentFolder.id,
        { title, messages: [] }
      );
      
      await loadConversations(currentFolder.id);
      return conversationRef;
    } catch (err) {
      console.error('Error creating conversation:', err);
      setError('Failed to create conversation. Please try again.');
      return null;
    }
  };
  
  // Update a conversation (e.g., change title)
  const updateConversation = async (conversationId, conversationData) => {
    if (!currentUser || !currentFolder) return null;
    
    try {
      await firestoreService.updateConversation(
        currentUser.uid,
        currentFolder.id,
        conversationId,
        conversationData
      );
      
      // Refresh conversations to get the updated data
      await loadConversations(currentFolder.id);
      
      // If this is the current conversation, update it
      if (currentConversation && currentConversation.id === conversationId) {
        const updatedConversation = await firestoreService.getConversation(
          currentUser.uid,
          currentFolder.id,
          conversationId
        );
        setCurrentConversation(updatedConversation);
      }
      
      return true;
    } catch (err) {
      console.error('Error updating conversation:', err);
      setError('Failed to update conversation. Please try again.');
      return null;
    }
  };
  
  // Add a new message to the current conversation
  const addNewMessage = async (messageData) => {
    if (!currentUser || !currentFolder || !currentConversation) return null;
    
    try {
      // If the message includes files, upload them first
      let attachments = [];
      if (messageData.files && messageData.files.length > 0) {
        const messageRef = await firestoreService.addMessage(
          currentUser.uid,
          currentFolder.id,
          currentConversation.id,
          { 
            role: messageData.role,
            content: messageData.content,
            attachments: [] // We'll update this after uploading files
          }
        );
        
        // Upload each file
        const uploadPromises = messageData.files.map(file => 
          storageService.uploadFile(
            file.file, // Extract the actual File object
            currentUser.uid, 
            currentFolder.id, 
            currentConversation.id, 
            messageRef.id
          )
        );
        
        attachments = await Promise.all(uploadPromises);
        
        // Update the message with attachment info
        await firestoreService.updateMessage(
          currentUser.uid,
          currentFolder.id,
          currentConversation.id,
          messageRef.id,
          { attachments }
        );
        
        await loadMessages(currentConversation.id);
        return messageRef;
      } else {
        // No files to upload, just add the message
        const messageRef = await firestoreService.addMessage(
          currentUser.uid,
          currentFolder.id,
          currentConversation.id,
          {
            role: messageData.role,
            content: messageData.content,
            attachments: []
          }
        );
        
        await loadMessages(currentConversation.id);
        return messageRef;
      }
    } catch (err) {
      console.error('Error adding message:', err);
      setError('Failed to add message. Please try again.');
      return null;
    }
  };
  
  // Set current folder and load its conversations
  const selectFolder = async (folderId) => {
    const folder = folders.find(f => f.id === folderId);
    
    if (folder) {
      setCurrentFolder(folder);
      await loadConversations(folderId);
    }
  };
  
  // Set current conversation and load its messages
  const selectConversation = async (conversationId) => {
    const conversation = conversations.find(c => c.id === conversationId);
    
    if (conversation) {
      setCurrentConversation(conversation);
      await loadMessages(conversationId);
    }
  };
  
  const deleteFolder = async (folderId) => {
    if (!currentUser) return;
    
    try {
      await firestoreService.deleteFolder(currentUser.uid, folderId);
      
      // If we deleted the current folder, reset to another folder
      if (currentFolder && currentFolder.id === folderId) {
        setCurrentFolder(null);
        setConversations([]);
        setCurrentConversation(null);
        setMessages([]);
      }
      
      await loadFolders();
    } catch (err) {
      console.error('Error deleting folder:', err);
      setError('Failed to delete folder. Please try again.');
    }
  };
  
  const deleteConversation = async (conversationId) => {
    if (!currentUser || !currentFolder) return;
    
    try {
      await firestoreService.deleteConversation(
        currentUser.uid,
        currentFolder.id,
        conversationId
      );
      
      // If we deleted the current conversation, reset
      if (currentConversation && currentConversation.id === conversationId) {
        setCurrentConversation(null);
        setMessages([]);
      }
      
      await loadConversations(currentFolder.id);
    } catch (err) {
      console.error('Error deleting conversation:', err);
      setError('Failed to delete conversation. Please try again.');
    }
  };
  
  const value = {
    folders,
    currentFolder,
    conversations,
    currentConversation,
    messages,
    loading,
    error,
    loadFolders,
    loadConversations,
    loadMessages,
    createNewFolder,
    createNewConversation,
    updateConversation,
    addNewMessage,
    selectFolder,
    selectConversation,
    deleteFolder,
    deleteConversation,
    setError
  };
  
  return (
    <FirestoreContext.Provider value={value}>
      {children}
    </FirestoreContext.Provider>
  );
};

// Custom hook to use the Firestore context
export const useFirestore = () => {
  const context = useContext(FirestoreContext);
  
  if (!context) {
    throw new Error('useFirestore must be used within a FirestoreProvider');
  }
  
  return context;
}; 