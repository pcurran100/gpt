# Chat Interface with Firebase Integration

This is a chat interface application built with React and Firebase. It features a modern UI with real-time data synchronization, file attachments, and user authentication.

## Features

- **User Authentication**: Secure login with Firebase Authentication
- **Chat Organization**: Conversations organized in folders with date categorization
- **File Attachments**: Support for uploading and viewing various file types
- **Real-time Updates**: Changes reflect immediately across connected devices
- **Responsive Design**: Works well on desktop and mobile devices

## Firebase Implementation

### Firestore Data Structure

```
users (collection)
  └── {userId} (document)
        └── folders (collection)
              └── {folderId} (document)
                    └── conversations (collection)
                          └── {conversationId} (document)
                                └── messages (collection)
                                      └── {messageId} (document)
```

### Firebase Storage Structure

Files are stored at:
```
/user_uploads/{userId}/folders/{folderId}/conversations/{conversationId}/{messageId}/{filename.ext}
```

## Installation and Setup

1. Clone the repository
```bash
git clone <repository-url>
cd chat-interface
```

2. Install dependencies
```bash
npm install
```

3. Set up Firebase
   - Create a Firebase project in the [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication, Firestore, and Storage
   - Update `firebase.js` with your project configuration

4. Deploy Firebase rules
   - See `firebase-rules.md` for the security rules
   - Deploy using Firebase CLI

5. Run the application
```bash
npm start
```

## Key Components

- **AuthContext**: Manages user authentication state
- **FirestoreContext**: Provides access to Firestore data and operations
- **ChatArea**: Main chat interface for messages and files
- **Sidebar**: Navigation and conversation management
- **ChatMessage**: Renders individual messages and attachments
- **FileAttachment**: Displays file attachments with appropriate preview

## API Documentation

### Firestore Service

- **createFolder**: Create a new folder for a user
- **getUserFolders**: Get all folders for a user
- **updateFolder**: Update folder details
- **deleteFolder**: Delete a folder and its content
- **createConversation**: Create a new conversation in a folder
- **getFolderConversations**: Get all conversations in a folder
- **getConversation**: Get a specific conversation
- **updateConversation**: Update conversation details
- **deleteConversation**: Delete a conversation
- **addMessage**: Add a message to a conversation
- **getConversationMessages**: Get all messages in a conversation
- **updateMessage**: Update a message
- **deleteMessage**: Delete a message
- **createUserDocument**: Initialize user document in Firestore

### Storage Service

- **uploadFile**: Upload a file to Firebase Storage
- **deleteFile**: Delete a file from Firebase Storage
- **getMessageFiles**: Get all files for a message
- **getConversationFiles**: Get all files for a conversation

## Future Enhancements

1. **Offline Support**: Enhance offline capabilities
2. **Message Search**: Add search functionality for conversation content
3. **Message Reactions**: Allow users to react to messages
4. **Read Receipts**: Show when messages are read
5. **Push Notifications**: Notify users of new messages
6. **Cloud Functions**: Implement serverless functions for:
   - Message processing
   - Large deletion operations
   - File processing (thumbnail generation, etc.)
7. **Conversation Sharing**: Allow users to share conversations
