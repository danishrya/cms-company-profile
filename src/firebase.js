import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCAvk0wZfOpkP3ReJE8AD07Ms679L5GXj0",
  authDomain: "cms-company-profile-ef004.firebaseapp.com",
  projectId: "cms-company-profile-ef004",
  storageBucket: "cms-company-profile-ef004.firebasestorage.app",
  messagingSenderId: "893082711158",
  appId: "1:893082711158:web:0012ac231a438af2f75b57",
  measurementId: "G-GH0CCYR116"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
