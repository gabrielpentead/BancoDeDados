import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCGLf69ewiG2DlaINOp7CozBd73dPj8kfk",
  authDomain: "bancodatumrab.firebaseapp.com",
  projectId: "bancodatumrab",
  storageBucket: "bancodatumrab.appspot.com",
  messagingSenderId: "526981541331",
  appId: "1:526981541331:web:6f6520cb1b3b8178a4d326"
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);

export { db, auth };
