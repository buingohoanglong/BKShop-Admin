import firebase from 'firebase';
import 'firebase/firestore';


// Initialize Cloud Firestore through Firebase
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAhlakkyM1cVMJn2ZzcoqYg3YoQPrycSKc",
    authDomain: "e-commerce-7953b.firebaseapp.com",
    databaseURL: "https://e-commerce-7953b-default-rtdb.firebaseio.com",
    projectId: "e-commerce-7953b",
    storageBucket: "e-commerce-7953b.appspot.com",
    messagingSenderId: "71732121836",
    appId: "1:71732121836:web:0615ae20c3eb59bc10d5c9",
    measurementId: "G-K27NFGT617"
};

// firebase.initializeApp(firebaseConfig)

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
} else {
    firebase.app(); // if already initialized, use that one
}

var db = firebase.firestore();
var storage = firebase.storage();

export default db;
export { storage, firebase }
export const auth = firebase.auth()