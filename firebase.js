// firebase.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import {
    getAuth,
    GoogleAuthProvider,
    signInWithPopup,
    signOut
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyDybnJpzhPnRHYqseVbSskxnME-nAR7_KM",
    authDomain: "roadfix-3b359.firebaseapp.com",
    projectId: "roadfix-3b359",
    storageBucket: "roadfix-3b359.firebasestorage.app",
    messagingSenderId: "874230826839",
    appId: "1:874230826839:web:3f7aaca513028145d32012",
    measurementId: "G-VYY1THG66W"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const provider = new GoogleAuthProvider();

provider.setCustomParameters({
    prompt: "select_account"
});

// Make available to login.js
window.firebaseAuth = auth;
window.googleProvider = provider;
window.signInWithPopup = signInWithPopup;
window.signOutFirebase = signOut;