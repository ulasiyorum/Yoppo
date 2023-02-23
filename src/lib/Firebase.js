// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore"

const process = import.meta.env;
const firebaseConfig = {
    apiKey: process.VITE_FIREBASE_APIKEY,
    authDomain: process.VITE_FIREBASE_AUTHDOMAIN,
    projectId: process.VITE_FIREBASE_PROJECTID,
    storageBucket: process.VITE_FIREBASE_STORAGEBUCKET,
    messageSenderId: process.VITE_FIREBASE_MESSAGESENDERID,
    appId: process.VITE_FIREBASE_APPID,
    measurementId: process.VITE_FIREBASE_MEASUREMENTID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const auth = getAuth(app);