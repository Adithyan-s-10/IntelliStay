// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBqSxRNw_jGGxvp2ElWka0mXVHnVm7aZXo",
  authDomain: "intellistay-1f610.firebaseapp.com",
  projectId: "intellistay-1f610",
  storageBucket: "intellistay-1f610.appspot.com",
  messagingSenderId: "1095715454581",
  appId: "1:1095715454581:web:ed99b350f4cf4276e6823c",
  measurementId: "G-K3ZEB8MFQK"
};

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig);