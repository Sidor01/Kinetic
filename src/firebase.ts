import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD1bPFzLwGY47fbfUXh04sSw5SQU5oUwXY",
  authDomain: "kinetic-f0a5c.firebaseapp.com",
  projectId: "kinetic-f0a5c",
  storageBucket: "kinetic-f0a5c.firebasestorage.app",
  messagingSenderId: "710208435474",
  appId: "1:710208435474:web:db48c5df7424c24d352fcb"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);