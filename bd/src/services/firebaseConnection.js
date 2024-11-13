
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'


const firebaseConfig = {
  apiKey: "AIzaSyB5xqDT__BlqhzSQw5bg9ImlGbIq8KeWrg",
  authDomain: "projeto-test1-junsao.firebaseapp.com",
  projectId: "projeto-test1-junsao",
  storageBucket: "projeto-test1-junsao.appspot.com",
  messagingSenderId: "351193272013",
  appId: "1:351193272013:web:a40f673d30480eb5b8a384"
};

const firebaseApp = initializeApp(firebaseConfig);

const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);
const storage = getStorage(firebaseApp);

export { auth, db, storage };