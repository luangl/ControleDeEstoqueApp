// src/firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyAnqEt84M8V_Cq0iBHJOkGHZ5vSSDEsBhk",
    authDomain: "controledeestoqueapp-42d39.firebaseapp.com",
    projectId: "controledeestoqueapp-42d39",
    storageBucket: "controledeestoqueapp-42d39.appspot.com",
    messagingSenderId: "174710331347",
    appId: "1:174710331347:web:f0ee1bcbd358292f488126",
    measurementId: "G-NZNTSQK9M8",
}

let firebaseApp;

if (!firebaseApp) {
  firebaseApp = initializeApp(firebaseConfig);
}

const auth = getAuth(firebaseApp);

export { auth };
