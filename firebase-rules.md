# Firebase Security Rules

## Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow authenticated users to access their own data only
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      
      // Folders collection
      match /folders/{folderId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
        
        // Conversations collection
        match /conversations/{conversationId} {
          allow read, write: if request.auth != null && request.auth.uid == userId;
          
          // Messages collection
          match /messages/{messageId} {
            allow read, write: if request.auth != null && request.auth.uid == userId;
          }
        }
      }
    }
    
    // Deny all other access
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

## Firebase Storage Rules

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // User uploads path: user_uploads/{userId}/folders/{folderId}/conversations/{conversationId}/{messageId}/{filename}
    match /user_uploads/{userId}/folders/{folderId}/conversations/{conversationId}/{messageId}/{fileName} {
      // Allow read if user is authenticated and it's their file
      allow read: if request.auth != null && request.auth.uid == userId;
      
      // Allow write if user is authenticated, it's their folder, and file is < 20MB
      allow write: if request.auth != null && 
                   request.auth.uid == userId && 
                   request.resource.size < 20 * 1024 * 1024 &&
                   request.resource.contentType.matches('image/.*|application/pdf|text/.*|audio/.*|video/.*');
    }
    
    // Deny access to all other files
    match /{allPaths=**} {
      allow read, write: if false;
    }
  }
}
```

## How to Deploy Rules

### Deploy Firestore Rules

1. Save the Firestore rules to a file named `firestore.rules`
2. Run the following command:
```bash
firebase deploy --only firestore:rules
```

### Deploy Storage Rules

1. Save the Storage rules to a file named `storage.rules`
2. Run the following command:
```bash
firebase deploy --only storage:rules
``` 