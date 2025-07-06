// src/firebase/firebase.js
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { firebaseConfig } from "./firebaseConfig";

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage };
