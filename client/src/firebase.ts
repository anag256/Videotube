// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "videotube-54e1d.firebaseapp.com",
  projectId: "videotube-54e1d",
  storageBucket: "videotube-54e1d.appspot.com",
  messagingSenderId: "809962818965",
  appId: "1:809962818965:web:47aa99553d7a431c8a3a9c"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);