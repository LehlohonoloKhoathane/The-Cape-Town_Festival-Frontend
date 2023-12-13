// firebaseConfig.js

// import firebase from 'firebase/app';
// import 'firebase/auth'; // Include specific Firebase services you need
// import 'firebase/firestore'; // Firestore if you're using it

import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyANlIcf-W1hlcKc19Q45XiuPe3pxdz9dtw",
    authDomain: "uct-assessment.firebaseapp.com",
    databaseURL: "https://uct-assessment-default-rtdb.firebaseio.com",
    projectId: "uct-assessment",
    storageBucket: "uct-assessment.appspot.com",
    messagingSenderId: "205350835816",
    appId: "1:205350835816:web:3f96a61a11860ae7728ddd",
    measurementId: "G-GNR4G85L0G"
};

// // Initialize Firebase app
// firebase.initializeApp(firebaseConfig);
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { app, database };
// export default firebase;
