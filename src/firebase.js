import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAsjjmnv0Lq10CMxmZG548dGJGgM1Qdhxw",
  authDomain: "mma-react-852c1.firebaseapp.com",
  projectId: "mma-react-852c1",
  storageBucket: "mma-react-852c1.firebasestorage.app",
  messagingSenderId: "1089801481776",
  appId: "1:1089801481776:web:1341bf6942b51d297bc7f5",
  measurementId: "G-80GBS0GRBZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);

export { auth, firestore };