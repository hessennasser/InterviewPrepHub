// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCAkJUnJENyIW9CsttSUBYRu4LN8-mrsKE",
    authDomain: "interviewprephub-2f841.firebaseapp.com",
    projectId: "interviewprephub-2f841",
    storageBucket: "interviewprephub-2f841.appspot.com",
    messagingSenderId: "147221997490",
    appId: "1:147221997490:web:7ef4717ba17969955a66ab"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export default app;