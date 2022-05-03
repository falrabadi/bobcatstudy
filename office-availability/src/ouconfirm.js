import "./App.css";
import React, {useState, useEffect} from 'react';
import { BrowserRouter as history, Router, Routes, Route, Link, BrowserRouter, Navigate } from "react-router-dom";
import fire, {db} from "./fire";
import { getAuth, isSignInWithEmailLink, signInWithEmailLink, sendSignInLinkToEmail } from "firebase/auth";
import { toast, Toaster } from "react-hot-toast";
import {
    collection,
    addDoc,
    doc,
    deleteDoc,
    setDoc,
    getDocs,
    query,
    where,
    updateDoc,
  } from "firebase/firestore";
  import User from "./User.js";

  let curuser = new User();

const OUConfirm = () => {

    curuser = JSON.parse(window.localStorage.getItem("user"));

    // If user is not logged in, redirect to homepage
    if ( curuser == null )
    {
      console.log("user not logged in");
      return <Navigate to='/' />
    }

    curuser.signedInWithEmailLink = true;

    window.localStorage.setItem("user", JSON.stringify(curuser));

    fire.auth().onAuthStateChanged((user) => {
        if(user){
            console.log("user: ", user.auth.currentUser.email);
            const userRef = doc(db, "users", user.auth.currentUser.email);
            updateDoc(userRef, {
                signedInWithEmailLink: true
            });
            console.log(user.auth.currentUser.email.signedInWithEmailLink);
        }
    })

    return (
      <section className="login">
        <div className="loginContainer">
        <label className="passreset">Thank you for confirming your Ohio.edu Email</label>
        <label className="passreset"> You can now return to the website below </label>
        <div>
            <Link to={"/allrooms"}>
                <button>Return</button>
            </Link>
        </div>
        </div>
      </section>
    );
  };

export default OUConfirm;