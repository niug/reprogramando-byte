import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCqZ5cNMmoqUDSKP1hQulZ4_YjwpJHoXAk",
  authDomain: "reprogramando-byte.firebaseapp.com",
  projectId: "reprogramando-byte",
  storageBucket: "reprogramando-byte.firebasestorage.app",
  messagingSenderId: "694642916762",
  appId: "1:694642916762:web:1e98cd04735cdab6a9ce23",
  measurementId: "G-LYY7KSJ75K"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);