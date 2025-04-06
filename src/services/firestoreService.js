import { 
  collection, 
  doc, 
  setDoc, 
  addDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../firebase';

// ===== FOLDER OPERATIONS =====

/**
 * Create a new folder for a user
 */
export const createFolder = async (userId, folderData) => {
  const foldersRef = collection(db, 'users', userId, 'folders');
  return await addDoc(foldersRef, {
    ...folderData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
};

/**
 * Get all folders for a user
 */
export const getUserFolders = async (userId) => {
  const foldersRef = collection(db, 'users', userId, 'folders');
  const q = query(foldersRef, orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};

/**
 * Update folder details
 */
export const updateFolder = async (userId, folderId, folderData) => {
  const folderRef = doc(db, 'users', userId, 'folders', folderId);
  return await updateDoc(folderRef, {
    ...folderData,
    updatedAt: serverTimestamp()
  });
};

/**
 * Delete a folder and all its contents
 * Note: This should be done with a Cloud Function to ensure all nested data is deleted
 */
export const deleteFolder = async (userId, folderId) => {
  const folderRef = doc(db, 'users', userId, 'folders', folderId);
  // In a production app, you would use a Cloud Function to delete all subcollections
  return await deleteDoc(folderRef);
};

// ===== CONVERSATION OPERATIONS =====

/**
 * Create a new conversation in a folder
 */
export const createConversation = async (userId, folderId, conversationData) => {
  const conversationsRef = collection(db, 'users', userId, 'folders', folderId, 'conversations');
  return await addDoc(conversationsRef, {
    ...conversationData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
};

/**
 * Get all conversations in a folder
 */
export const getFolderConversations = async (userId, folderId) => {
  const conversationsRef = collection(db, 'users', userId, 'folders', folderId, 'conversations');
  const q = query(conversationsRef, orderBy('updatedAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};

/**
 * Get a specific conversation
 */
export const getConversation = async (userId, folderId, conversationId) => {
  const conversationRef = doc(db, 'users', userId, 'folders', folderId, 'conversations', conversationId);
  const snapshot = await getDoc(conversationRef);
  
  if (!snapshot.exists()) {
    return null;
  }
  
  return {
    id: snapshot.id,
    ...snapshot.data()
  };
};

/**
 * Update conversation details
 */
export const updateConversation = async (userId, folderId, conversationId, conversationData) => {
  const conversationRef = doc(db, 'users', userId, 'folders', folderId, 'conversations', conversationId);
  return await updateDoc(conversationRef, {
    ...conversationData,
    updatedAt: serverTimestamp()
  });
};

/**
 * Delete a conversation and all its messages
 */
export const deleteConversation = async (userId, folderId, conversationId) => {
  const conversationRef = doc(db, 'users', userId, 'folders', folderId, 'conversations', conversationId);
  // In a production app, you would use a Cloud Function to delete all subcollections
  return await deleteDoc(conversationRef);
};

// ===== MESSAGE OPERATIONS =====

/**
 * Add a message to a conversation
 */
export const addMessage = async (userId, folderId, conversationId, messageData) => {
  const messagesRef = collection(
    db, 
    'users', 
    userId, 
    'folders', 
    folderId, 
    'conversations', 
    conversationId, 
    'messages'
  );
  
  // Add the message
  const messageRef = await addDoc(messagesRef, {
    ...messageData,
    createdAt: serverTimestamp()
  });
  
  // Update the conversation's lastMessage and updatedAt
  const conversationRef = doc(db, 'users', userId, 'folders', folderId, 'conversations', conversationId);
  await updateDoc(conversationRef, {
    lastMessage: {
      content: messageData.content.substring(0, 100), // Store a preview
      role: messageData.role,
      createdAt: serverTimestamp()
    },
    updatedAt: serverTimestamp()
  });
  
  return messageRef;
};

/**
 * Get all messages in a conversation
 */
export const getConversationMessages = async (userId, folderId, conversationId) => {
  const messagesRef = collection(
    db, 
    'users', 
    userId, 
    'folders', 
    folderId, 
    'conversations', 
    conversationId, 
    'messages'
  );
  
  const q = query(messagesRef, orderBy('createdAt', 'asc'));
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};

/**
 * Update a message
 */
export const updateMessage = async (userId, folderId, conversationId, messageId, messageData) => {
  const messageRef = doc(
    db, 
    'users', 
    userId, 
    'folders', 
    folderId, 
    'conversations', 
    conversationId, 
    'messages',
    messageId
  );
  
  return await updateDoc(messageRef, messageData);
};

/**
 * Delete a message
 */
export const deleteMessage = async (userId, folderId, conversationId, messageId) => {
  const messageRef = doc(
    db, 
    'users', 
    userId, 
    'folders', 
    folderId, 
    'conversations', 
    conversationId, 
    'messages',
    messageId
  );
  
  return await deleteDoc(messageRef);
};

// ===== USER OPERATIONS =====

/**
 * Initialize user document in Firestore when a new user signs up
 */
export const createUserDocument = async (userId, userData) => {
  const userRef = doc(db, 'users', userId);
  
  // Check if user document already exists
  const userDoc = await getDoc(userRef);
  
  if (!userDoc.exists()) {
    // Create user document if it doesn't exist
    await setDoc(userRef, {
      ...userData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    // Create a default folder for the user
    const defaultFolderRef = await createFolder(userId, { name: 'My Conversations' });
    
    // Update user document with the default folder reference
    await updateDoc(userRef, {
      defaultFolderId: defaultFolderRef.id
    });
    
    return {
      id: userId,
      ...userData,
      defaultFolderId: defaultFolderRef.id
    };
  }
  
  return {
    id: userId,
    ...userDoc.data()
  };
}; 