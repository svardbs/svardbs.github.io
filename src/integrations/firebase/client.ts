import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics, isSupported } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: 'AIzaSyCUGi0cGKY-61hxjD86lH-8g9pML-rGbU0',
  authDomain: 'game-stats-hub-2f1b9.firebaseapp.com',
  projectId: 'game-stats-hub-2f1b9',
  storageBucket: 'game-stats-hub-2f1b9.firebasestorage.app',
  messagingSenderId: '74047449672',
  appId: '1:74047449672:web:d08fbe8a51d7d65fc9867d',
  measurementId: 'G-JR8N0QRE2R',
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

isSupported().then((supported) => {
  if (supported) getAnalytics(app);
});
