// js/firebase-config.js
// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAiv-mbHNGNc3ZkY-Wsi9Ickgh_ChgC7T0",
    authDomain: "crm1-5d9d4.firebaseapp.com",
    projectId: "crm1-5d9d4",
    storageBucket: "crm1-5d9d4.appspot.com",
    messagingSenderId: "300931242315",
    appId: "1:300931242315:web:987e1d5fc50d862fa2b0ce"
  };
  
  // Inicialización de Firebase
  firebase.initializeApp(firebaseConfig);
  const auth = firebase.auth();
  const db = firebase.firestore();  