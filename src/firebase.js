import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCNFFWR7FPnAaFsNkcbIf-zcZFy0ZLSV84",
  authDomain: "chat-interface-b40d4.firebaseapp.com",
  projectId: "chat-interface-b40d4",
  storageBucket: "chat-interface-b40d4.firebasestorage.app",
  messagingSenderId: "772004700427",
  appId: "1:772004700427:web:b7d2ad65fa1c04a12d420e",
  measurementId: "G-14NSYS3KGY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
export default app; 