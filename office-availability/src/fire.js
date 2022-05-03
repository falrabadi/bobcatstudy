/**
 * 2022
 * @alias fire.js
 * @author Program paladins
 * @abstract firebase configuration.
 */

// Import the functions you need from the SDKs you need
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import { getFirestore } from "firebase/firestore";
import toast from 'react-hot-toast';

//const functions = require('firebase-functions');

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA5wFfs4vKbKj0_TkNu-s3MRoUqaxiifnQ",
  authDomain: "bobcatstudy-56325.firebaseapp.com",
  projectId: "bobcatstudy-56325",
  storageBucket: "bobcatstudy-56325.appspot.com",
  messagingSenderId: "448574606606",
  appId: "1:448574606606:web:bb6e1f522033cc0c729b5f",
  databaseURL:
    "https://console.firebase.google.com/u/1/project/bobcatstudy-56325/firestore/data/~2F",
};

// Initialize Firebase
const fire = firebase.initializeApp(firebaseConfig);

export default fire;
export const provider = new firebase.auth.GoogleAuthProvider();
export const db = getFirestore();