// import { FIRE_CONFIG } from './src/fireConfig'
// const firebase = require('firebase');
// firebase.initializeApp(FIRE_CONFIG);
// const db = firebase.firestore();

let myItem = { name: "Ikey", userName: "benzakn", email: 'Yea' }
let updates = { name: "Twat", age: 19 }
let moreUpdates = { name: 'HelloKitty' }
myItem = { ...myItem, ...updates, ...moreUpdates }
console.log(myItem);