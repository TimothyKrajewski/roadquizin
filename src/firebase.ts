import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDyRB7Ut6dBpdp4bsltbmQkOVeD_yY5puc",
  authDomain: "roadquizin-50048.firebaseapp.com",
  projectId: "roadquizin-50048",
  storageBucket: "roadquizin-50048.appspot.com",
  messagingSenderId: "1007381935783",
  appId: "1:1007381935783:web:0979b913aa3a3d0ce6cd82",
  measurementId: "G-ZCK02EZVQP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage };