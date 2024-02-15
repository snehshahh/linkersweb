// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBaFxFtY1MUEVywG0GEjEflxa4L4PkE4qA",
  authDomain: "linkersdb-firestore.firebaseapp.com",
  projectId: "linkersdb-firestore",
  storageBucket: "linkersdb-firestore.appspot.com",
  messagingSenderId: "948306998721",
  appId: "1:948306998721:web:001b9c324a55eb77dcab40"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


export default app;