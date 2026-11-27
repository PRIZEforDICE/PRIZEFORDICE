import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js';
import { getAuth, GoogleAuthProvider } from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js';

export const firebaseConfig = {
  apiKey: 'AIzaSyB70RYUsQoFvBV-63GI8PEMLRo5QG4hafA',
  authDomain: 'prizefordice-c20c4.firebaseapp.com',
  projectId: 'prizefordice-c20c4',
  storageBucket: 'prizefordice-c20c4.firebasestorage.app',
  messagingSenderId: '659630426936',
  appId: '1:659630426936:web:8f9454ed5c7bb782968fcd',
  measurementId: 'G-CJC1WCS93J'
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });
