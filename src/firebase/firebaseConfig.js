// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBRgeTxERwA1KKU6rb7I8uHacG0Ntk8YNc",
  authDomain: "mobileclass-f595b.firebaseapp.com",
  projectId: "mobileclass-f595b",
  storageBucket: "mobileclass-f595b.firebasestorage.app",
  messagingSenderId: "22025453875",
  appId: "1:22025453875:web:54c17f33a07e4c259efe46",
  measurementId: "G-BS4XVRBB3D"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
const analytics = getAnalytics(app);