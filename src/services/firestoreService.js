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
import { db, auth } from '../firebase.config';

// Diagnostic function to check Firebase connection - should no longer be used but keeping it here for reference
export const checkFirebaseConnection = async () => {
  console.log('Checking Firebase connection...');
  try {
    if (!auth.currentUser) {
      console.log('No authenticated user - cannot test write operations');
      // Just test if we can access Firestore
      const usersRef = collection(db, 'users');
      console.log('Successfully accessed Firestore users collection');
      return true;
    }

    console.log('Testing with authenticated user:', auth.currentUser.uid);
    
    const testRef = collection(db, 'test');
    try {
      const snapshot = await getDocs(testRef).catch(error => {
        console.error('Error inside catch block of promise rejection:', error);
      });
      console.log('Successfully connected to Firestore! Docs:', snapshot.docs.map(doc => doc.data())); //seems to get here ok
    } catch (error) {
      console.error('Failed to connect to Firestore:', error);
    }
    // Try to access the user's document
    const userRef = doc(db, 'users', auth.currentUser.uid);
    try {
      const userDoc = await getDoc(userRef);
    
      if (userDoc.exists()) {
        console.log("Document data:", userDoc.data());
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      console.error("Error getting document:", error);
    }

    // Try to access folders collection
    const foldersRef = collection(db, 'users', auth.currentUser.uid, 'folders');
    console.log('Successfully accessed folders collection');

    // Try to get folders
    const foldersSnapshot = await getDocs(foldersRef);
    console.log('Current folders:', foldersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));

    return true;
  } catch (error) {
    console.error('Failed to access Firestore:', error);
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    return false;
  }
};

// ===== FOLDER OPERATIONS =====

/**
 * Create a new folder for a user
 */
export const createFolder = async (userId, folderData) => {
  console.log('Creating folder:', folderData);
  const foldersRef = collection(db, 'users', userId, 'folders');
  
  // Ensure folderData has required fields
  const sanitizedFolderData = {
    name: folderData.name || 'Untitled Folder',
    type: folderData.type || 'user',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  };

  const folderRef = await addDoc(foldersRef, sanitizedFolderData);
  console.log('Created folder with ID:', folderRef.id);
  return folderRef;
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
  console.log('Creating user document for:', userId);
  try {
    // Ensure userData has required fields and no undefined values
    const sanitizedUserData = {
      email: userData?.email || '',
      displayName: userData?.displayName || '',
      photoURL: userData?.photoURL || '',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    console.log('Sanitized user data:', sanitizedUserData);

    // Create user document
    const userRef = doc(db, 'users', userId);
    await setDoc(userRef, sanitizedUserData);
    console.log('Created user document');

    // Create default folder
    const defaultFolderData = {
      name: 'Default',
      type: 'default',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    const foldersRef = collection(db, 'users', userId, 'folders');
    const defaultFolderRef = await addDoc(foldersRef, defaultFolderData);
    console.log('Created default folder:', defaultFolderRef.id);

    // Update user with default folder reference
    await updateDoc(userRef, {
      defaultFolderId: defaultFolderRef.id,
      updatedAt: serverTimestamp()
    });
    console.log('Updated user with default folder reference');

    return {
      id: userId,
      ...sanitizedUserData,
      defaultFolderId: defaultFolderRef.id
    };
  } catch (error) {
    console.error('Error in createUserDocument:', error);
    throw error;
  }
}; 