import { auth as a, initializeApp, firestore, apps } from 'firebase';


if (apps.length < 1) {
    initializeApp({
        apiKey: "AIzaSyByO4KbKnBBfkalLGOYqi7HwJbg2GgfI7Q",
        authDomain: "wakeapp-20d3b.firebaseapp.com",
        databaseURL: "https://wakeapp-20d3b.firebaseio.com",
        projectId: "wakeapp-20d3b",
        storageBucket: "wakeapp-20d3b.appspot.com",
        messagingSenderId: "1031820381925"
    });
}
export const db = firestore();
export const auth = a();
export const firebase = firestore