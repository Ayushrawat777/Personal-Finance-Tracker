import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import{getAuth, GoogleAuthProvider} from "firebase/auth";
import{getFirestore, doc,setDoc} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBWJsEMK8DtegmCLyOzdOdOgc9t7M5_tF0",
  authDomain: "personal-finance-tracker-3b481.firebaseapp.com",
  projectId: "personal-finance-tracker-3b481",
  storageBucket: "personal-finance-tracker-3b481.firebasestorage.app",
  messagingSenderId: "262815470329",
  appId: "1:262815470329:web:b160810a21828cd85d0828",
  measurementId: "G-S8BMJNJ898"
};

const app = initializeApp(firebaseConfig);
const analytics= getAnalytics(app);
const db=getFirestore(app);
const auth=getAuth(app);
const provider=new GoogleAuthProvider();
export {db,auth,provider,doc,setDoc}