import firebase from "firebase";

const firebaseConfig = {
    apiKey: "AIzaSyDKN8JtRQqWPys7TmqS1fq5sQLNcSstwac",
    authDomain: "whatsapp-clone-dbb9e.firebaseapp.com",
    projectId: "whatsapp-clone-dbb9e",
    storageBucket: "whatsapp-clone-dbb9e.appspot.com",
    messagingSenderId: "639267147538",
    appId: "1:639267147538:web:1dd4ce4ff5bcf8a24d2dcb"
};

const app = !firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app();

// Access to the database
const db = app.firestore();

// Access to the Authentication
const auth = app.auth();

// Access to the Provider
const provider = new firebase.auth.GoogleAuthProvider();

export { db, auth, provider };