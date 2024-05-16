import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB13K6FNAhf_USdqwJAqvAlvQQcKjgaYwA",
  authDomain: "dev-arfara-8244d.firebaseapp.com",
  projectId: "dev-arfara-8244d",
  storageBucket: "dev-arfara-8244d.appspot.com",
  messagingSenderId: "840001960827",
  appId: "1:840001960827:web:67649074df9d17eea45bde",
  measurementId: "G-7WZRFWY32G"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
