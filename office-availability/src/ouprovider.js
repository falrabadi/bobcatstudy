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
  } from "firebase/firestore";
  import User from "./User.js";
import { isMobile } from "react-device-detect";

const OUProvider = (props) => {

    let curuser = new User();

    const [agree, setAgree] = useState(false);
    const [email, setEmail] = useState("");
    const [error, setError] = useState("")
    const EmailLink = ({history});


    const clearErrors = () => {
        setError("");
      };


    const canBeSubmitted = () => {
        const isValid = agree;

        if (isValid) {
            var doc = document.getElementById("submitButton");
            if ( doc != null )
            {
                doc.removeAttribute("disabled");
            }  
        } else {
            var doc = document.getElementById("submitButton");
            if ( doc != null )
            {
                document.getElementById("submitButton").setAttribute("disabled", true);
            }
        }
    };

    const auth = fire.auth();
    const sendVerifyEmail = () => {
        clearErrors();
        if (!/[a-z0-9]+@ohio.edu/.test(email)){
            setError("Must be a valid 'Ohio.edu' email address");
        }else{
            toast("A sign in link has been sent to your OU email, please follow the link to sign in");
            if(auth.isSignInWithEmailLink(window.location.href) && !!email){
                auth.sendSignInLinkToEmail(email, window.location.href).then((result) => {
                    history.replace('/');
                })
                .catch((err) => {
                    switch(err.code){
                        default:
                        setError("An unknown error has occured");
                    }
                });
            }else{
                auth.sendSignInLinkToEmail(email, {
                    url: "http://localhost:3000/ouconfirm",
                    handleCodeInApp: true,
                })
                .then(() => {
                    window.localStorage.setItem("emailForSignIn", email);
                })
                .catch((err) => {
                    switch(err.code){
                        default:
                        setError("An unknown error has occured");
                    }
                });
            }
        }

    }

    const handleDelete = () => {
        const user = fire.auth().currentUser;
        //window.location.href = '/';
        window.localStorage.clear();
        // Use .then to make sure signout finishes first
        fire.auth().signOut().then( () => window.location.href="/" );
    }
    
      useEffect(() => {
          const saved_email = window.localStorage.getItem("emailforSignIn");
          if(auth.isSignInWithEmailLink(window.location.href) && !!saved_email){
              auth.signInWithEmailLink(saved_email, window.location.href);
          }
      }, []);

      useEffect(() => canBeSubmitted());

    curuser = JSON.parse(window.localStorage.getItem("user"));

    // If user is not logged in, redirect to homepage
    if ( curuser == null )
    {
    console.log("user not logged in");
    return <Navigate to='/' />
    }

    if ( isMobile )
    {
        document.body.style.zoom = "80%";
    }
    
    return (
      <section className="login">
        <div className="loginContainer">
        <label className="passreset">Enter your Ohio Email</label>
        <div>
        <Toaster />
            <label className="emaillabel">Email</label>
            <input
                type="text"
                autoFocus
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <p className="errorMsg">{error}</p>
            <div className="btnContainer">
            <input className="chkbox"
                type="checkbox"
                name="agree"
                id="agree"
                onClick={(e) => setAgree(e.target.checked)}
              />
              <label className="chkboxlbl">I acknowledge that I have read and agree to the Bobcat Study <Link className='toslink' to={"/termsofservice"} target="blank"> Terms of Service </Link> </label>
              <button type="submit" id="submitButton" onClick={sendVerifyEmail}>Submit</button>
            </div>
        </div>
          <div>
              <p>
                <button type="submit" onClick={handleDelete}>Return</button>
              </p>
          </div>
          
        </div>
      </section>
    );
  };

export default OUProvider;