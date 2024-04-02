// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCGcxYYzmHmdkcCghYixFhruObyR0D3hM4",
  authDomain: "today-s-memory.firebaseapp.com",
  projectId: "today-s-memory",
  storageBucket: "today-s-memory.appspot.com",
  messagingSenderId: "1006201986775",
  appId: "1:1006201986775:web:1da942d9924c0c87b21a92",
  measurementId: "G-HPBLP33Q9W",
};

// Initialize Firebase

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

const analytics = getAnalytics(app);
