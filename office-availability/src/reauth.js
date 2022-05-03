import React, { useState } from "react";
import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  BrowserRouter,
  Navigate,
} from "react-router-dom";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import User from "./User.js";
import fire, { provider, db } from "./fire";
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
import {
  getAuth,
  onAuthStateChanged,
  sendEmailVerification,
  updatePassword,
  emailVerified,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";

let curuser = new User();
curuser = JSON.parse(window.localStorage.getItem("user"));
if (curuser == null) {
  const fbuilds = [];
  const frooms = [];
  curuser = new User("", "", frooms, fbuilds, false, false, "");
}


const Reauth = (props) => {
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleSubmit = () => {
    //need to add alternate option for google accounts
    //make it a password field so its censored
    const auth = getAuth();
    const user = auth.currentUser;
    const credential = EmailAuthProvider.credential(user.email, password);
    reauthenticateWithCredential(user, credential)
      .then(() => {
        curuser = JSON.parse(window.localStorage.getItem("user"));

        console.log(curuser.email);

        const deleteuser = fire.auth().currentUser;
        deleteDoc(doc(db, "users", curuser.email)).then(() => {
          deleteuser
            .delete()
            .then(() => {
              console.log("user deleted from authentication");
              window.localStorage.clear();
              window.location.href = "/";
            })
            .catch((error) => {
              console.log("couldnt delete user. ", error);
            });
        });
      })
      .catch((error) => {
        setPasswordError("ERROR: Incorrect Password");
        console.log("ERROR: incorrect password: " + error)
      });
  };

  curuser = JSON.parse(window.localStorage.getItem("user"));

  // If user is not logged in, redirect to homepage
  if ( curuser == null )
  {
    console.log("user not logged in");
    return <Navigate to='/' />
  }

  return (
    <section className="login">
      <div className="loginContainer">
        <label className="passreset">Delete Account Confirmation</label>
        <div onSubmit={handleSubmit}>
          
          <label className="emaillabel">Password</label>
          <input
            type="password"
            autoFocus
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <p className="errorMsg">{passwordError}</p>
          <div className="btnContainer">
            <button onClick={handleSubmit} type="submit">
              Delete Account
            </button>
          </div>
        </div>
        <div className="btnContainer">
          <p>
            <Link to={"/settings"}>
              <button>Return</button>
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Reauth;
