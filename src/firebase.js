import firebase from 'firebase'

const config = {
	apiKey: "AIzaSyD3xQP8HYecN0_XOw-xFKxAwnc7P__dNU0",
    authDomain: "trace-2fdd2.firebaseapp.com",
    databaseURL: "https://trace-2fdd2-default-rtdb.firebaseio.com",
    projectId: "trace-2fdd2",
    storageBucket: "trace-2fdd2.appspot.com",
    messagingSenderId: "514150577849",
    appId: "1:514150577849:web:a9abfd0d0f7c2acde8cd68"
};

firebase.initializeApp(config);

export default firebase