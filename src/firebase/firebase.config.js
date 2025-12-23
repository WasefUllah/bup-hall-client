// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCfy51JHZJnjSRi6Aduyehv5UR-OuMd2ss",
  authDomain: "bup-hall-management-9e543.firebaseapp.com",
  projectId: "bup-hall-management-9e543",
  storageBucket: "bup-hall-management-9e543.firebasestorage.app",
  messagingSenderId: "112063856772",
  appId: "1:112063856772:web:d5b8bfb27a5b991f5fc2d1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;