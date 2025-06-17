import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyBvshs7Bqem_j8pk3K_GZv9rhpt5VUR6qw",
  authDomain: "team-scheduler-5a7e1.firebaseapp.com",
  projectId: "team-scheduler-5a7e1",
  storageBucket: "team-scheduler-5a7e1.firebasestorage.app",
  messagingSenderId: "236438484699",
  appId: "1:236438484699:web:739868071555e7da563efe"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)