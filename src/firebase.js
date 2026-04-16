import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";



const firebaseConfig = {
  apiKey: "AIzaSyC2WS7zXLbVeYC-dzFijZwdERKdCRPSIwg",
  authDomain: "recourcify.firebaseapp.com",
  databaseURL: "https://recourcify-default-rtdb.firebaseio.com",
  projectId: "recourcify",
  storageBucket: "recourcify.firebasestorage.app",
  messagingSenderId: "757914024247",
  appId: "1:757914024247:web:934b1a88404c359b0642b2",
  measurementId: "G-YZPNHP45KW"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);