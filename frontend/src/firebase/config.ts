// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCH37IFvMW5daEX5u6flyu7cWWcSlGl79k",
  authDomain: "voice-to-shareablememo-app.firebaseapp.com",
  projectId: "voice-to-shareablememo-app",
  storageBucket: "voice-to-shareablememo-app.firebasestorage.app",
  messagingSenderId: "280618739373",
  appId: "1:280618739373:web:5687480b1b2d7c2de84824",
  measurementId: "G-D63BP31QBL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
auth.languageCode = 'ja';
const analytics = getAnalytics(app);
const db = getFirestore(app);

export {auth, db, app};