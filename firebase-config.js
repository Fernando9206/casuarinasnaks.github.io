import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyCpdBpc6jH-iOUeRD4QRdkaqUSjmgIbmGU",
    authDomain: "casuarinasnaks-menu.firebaseapp.com",
    projectId: "casuarinasnaks-menu",
    storageBucket: "casuarinasnaks-menu.firebasestorage.app",
    messagingSenderId: "113253329955",
    appId: "1:113253329955:web:236baea1897109c6f85596"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
// Images are uploaded to Cloudinary — no Firebase Storage needed
