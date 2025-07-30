// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBUmeIsLqZl6S0AW4GH6WnW-OIt4DHWCpU",
  authDomain: "vistalite-42e0e.firebaseapp.com",
  projectId: "vistalite-42e0e",
  storageBucket: "vistalite-42e0e.firebasestorage.app",
  messagingSenderId: "23612463297",
  appId: "1:23612463297:web:d4dbcf9ef7647515c85c40",
  measurementId: "G-JXRJPGFLRC"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
