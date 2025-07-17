
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyDE6xjKWukXbbAidKY4iQXqUzCFCgMURXI",
    authDomain: "waitlist-6cf53.firebaseapp.com",
    projectId: "waitlist-6cf53",
    storageBucket: "waitlist-6cf53.appspot.com",
    messagingSenderId: "969436626923",
    appId: "1:969436626923:web:1c35ea9f20860db688a3ae"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get Firestore instance
const db = getFirestore(app);

export { db };
