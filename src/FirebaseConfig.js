import { initializeApp } from "firebase/app";
import { getAuth, FacebookAuthProvider } from 'firebase/auth'

const firebaseConfig = {
    apiKey: "AIzaSyCNstjzHdMokamUSMoQD3bDHzaNSzC7-VE",
    authDomain: "fahasha-868a8.firebaseapp.com",
    projectId: "fahasha-868a8",
    storageBucket: "fahasha-868a8.appspot.com",
    messagingSenderId: "973847411286",
    appId: "1:973847411286:web:30ff7428441463337b99f7",
    measurementId: "G-H01XX7390R"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app)
const provider = new FacebookAuthProvider()

export { auth, provider }
