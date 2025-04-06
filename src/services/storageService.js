import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject, 
  listAll 
} from 'firebase/storage';
import { storage } from '../firebase';

/**
 * Upload a file to Firebase Storage
 * 
 * @param {File} file - The file object to upload
 * @param {string} userId - The user ID
 * @param {string} folderId - The folder ID
 * @param {string} conversationId - The conversation ID
 * @param {string} messageId - The message ID
 * @returns {Promise<{filePath: string, downloadUrl: string, fileName: string, contentType: string, size: number}>}
 */
export const uploadFile = async (file, userId, folderId, conversationId, messageId) => {
  // Create a storage reference
  const filePath = `user_uploads/${userId}/folders/${folderId}/conversations/${conversationId}/${messageId}/${file.name}`;
  const storageRef = ref(storage, filePath);
  
  // Upload the file
  const snapshot = await uploadBytes(storageRef, file);
  
  // Get the download URL
  const downloadUrl = await getDownloadURL(snapshot.ref);
  
  // Return file metadata
  return {
    filePath,
    downloadUrl,
    fileName: file.name,
    contentType: file.type,
    size: file.size
  };
};

/**
 * Delete a file from Firebase Storage
 * 
 * @param {string} filePath - The path to the file in storage
 * @returns {Promise<void>}
 */
export const deleteFile = async (filePath) => {
  const storageRef = ref(storage, filePath);
  return await deleteObject(storageRef);
};

/**
 * Get all files for a message
 * 
 * @param {string} userId - The user ID
 * @param {string} folderId - The folder ID
 * @param {string} conversationId - The conversation ID
 * @param {string} messageId - The message ID
 * @returns {Promise<Array<{filePath: string, downloadUrl: string, fileName: string}>>}
 */
export const getMessageFiles = async (userId, folderId, conversationId, messageId) => {
  const messageFolderPath = `user_uploads/${userId}/folders/${folderId}/conversations/${conversationId}/${messageId}`;
  const listRef = ref(storage, messageFolderPath);
  
  try {
    const res = await listAll(listRef);
    
    // Map each file reference to its download URL and metadata
    const filesPromises = res.items.map(async (itemRef) => {
      const downloadUrl = await getDownloadURL(itemRef);
      const fileName = itemRef.name;
      const filePath = itemRef.fullPath;
      
      return {
        filePath,
        downloadUrl,
        fileName
      };
    });
    
    return await Promise.all(filesPromises);
  } catch (error) {
    console.error("Error getting message files:", error);
    return [];
  }
};

/**
 * Get all files for a conversation
 * 
 * @param {string} userId - The user ID
 * @param {string} folderId - The folder ID
 * @param {string} conversationId - The conversation ID
 * @returns {Promise<Array<{filePath: string, downloadUrl: string, fileName: string, messageId: string}>>}
 */
export const getConversationFiles = async (userId, folderId, conversationId) => {
  const conversationPath = `user_uploads/${userId}/folders/${folderId}/conversations/${conversationId}`;
  const listRef = ref(storage, conversationPath);
  
  try {
    const res = await listAll(listRef);
    
    // For each message folder, get all files
    const messagesFolderPromises = res.prefixes.map(async (prefix) => {
      const messageId = prefix.name;
      const messageFiles = await getMessageFiles(userId, folderId, conversationId, messageId);
      
      // Add messageId to each file object
      return messageFiles.map(file => ({
        ...file,
        messageId
      }));
    });
    
    // Flatten the array of arrays
    const nestedResults = await Promise.all(messagesFolderPromises);
    return nestedResults.flat();
  } catch (error) {
    console.error("Error getting conversation files:", error);
    return [];
  }
}; 