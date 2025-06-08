// Import the functions you need from the SDKs you need
import { initializeApp,getApp,getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDvgaB1UIuRoCVRWCzK---n_szhcdpTjsQ",
  authDomain: "prep2crack-1e68e.firebaseapp.com",
  projectId: "prep2crack-1e68e",
  storageBucket: "prep2crack-1e68e.firebasestorage.app",
  messagingSenderId: "1084825525825",
  appId: "1:1084825525825:web:4d1a8ac9115dc4f6c430c0",
  measurementId: "G-G2M3NCRTQY"
};

// Initialize Firebase
const app = !getApps.length ? initializeApp(firebaseConfig): getApp();
export const auth = getAuth(app);
export const db = getFirestore(app);