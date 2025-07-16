// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCWAoCDAmd7wR8ewgem8e8xSA6ZvS3AGQA",
  authDomain: "salud-y-belleza-b9d64.firebaseapp.com",
  projectId: "salud-y-belleza-b9d64",
  storageBucket: "salud-y-belleza-b9d64.firebasestorage.app",
  messagingSenderId: "643078981534",
  appId: "1:643078981534:web:218cb77d0d7664dd3bb88f",
  measurementId: "G-PWVEQ6W53R"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

export default {
    app,
    analytics,
    auth
};