// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDJDT33XLSm76PVaUNM1egOy4zBcQ3XY3c",
  authDomain: "react-js-todo-ta.firebaseapp.com",
  projectId: "react-js-todo-ta",
  storageBucket: "react-js-todo-ta.appspot.com",
  messagingSenderId: "208448600512",
  appId: "1:208448600512:web:e7001b6c6a7f512270b025",
  databaseURL: "https://react-js-todo-ta-default-rtdb.firebaseio.com",
};

// Initialize Firebase
initializeApp(firebaseConfig);

export const db = getFirestore();

export const realDb = getDatabase();
