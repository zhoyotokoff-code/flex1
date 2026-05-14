import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB1t7D6_6V69xjqt3wx7CkUfUXfhEiKZAg",
  authDomain: "speedy-precept-451516-t3.firebaseapp.com",
  projectId: "speedy-precept-451516-t3",
  storageBucket: "speedy-precept-451516-t3.firebasestorage.app",
  messagingSenderId: "182813929475",
  appId: "1:182813929475:web:03013aa31070da62a35e36"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
