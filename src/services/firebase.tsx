// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";
import {getAuth, useDeviceLanguage} from 'firebase/auth'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.X_FIREBASE_API_KEY,
  authDomain: import.meta.env.X_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.X_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.X_FIREBASE_STORAGE,
  messagingSenderId: import.meta.env.X_FIREBASE_MESSAGING,
  appId: import.meta.env.X_FIREBASE_APP_ID,
  measurementId: import.meta.env.X_FIREBASE_MEASUREMENT_ID,
  databaseURL : import.meta.env.X_FIREBASE_DATABASE
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

analytics.app.automaticDataCollectionEnabled = true;



const db = getDatabase(app);
const auth = getAuth(app);
useDeviceLanguage(auth)


export {db , auth}



