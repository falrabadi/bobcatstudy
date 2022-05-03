import React, { useState } from "react";
import "firebase/compat/auth";
import "firebase/compat/firestore";
//import { lightTheme, darkTheme, GlobalStyles } from './themes';
import User from "./User.js";
import Hero from "./Hero";
import fire, { provider, db } from "./fire";
import { confirm } from "react-confirm-box";
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
  GoogleAuthProvider,
} from "firebase/auth";
import firebase from "firebase/compat/app";
import PassForm from "./passwordform.js";
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import { isMobile } from "react-device-detect";

let curuser = new User();
curuser = JSON.parse(window.localStorage.getItem("user"));
if (curuser == null) {
  const fbuilds = [];
  const frooms = [];
  curuser = new User("", "", frooms, fbuilds, false, false, "");
}

var state = "light";
if (curuser.darkmode) {
  state = "dark";
}

const deleteAccount = () => {
  curuser = JSON.parse(window.localStorage.getItem("user"));

  const user = fire.auth().currentUser;

  var provider = new firebase.auth.GoogleAuthProvider();
  provider.addScope("profile");
  provider.addScope("email");
  // Reauthenticate with popup:
  user.reauthenticateWithPopup(provider).then(
    function (result) {
      deleteDoc(doc(db, "users", curuser.email)).then(() => {
        user
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
    },
    function (error) {
      alert("ERROR DELETING ACCOUNT");
    }
  );
};

const deleteAccountConfirm = async () => {
  const options = {
    labels: {
      confirmable: "Delete Account",
      cancellable: "Cancel",
      closeOnOverlayClick: true,
    },
  };
  const result = await confirm(
    <p style={{color: "black"}}>Are you sure you want to delete your account?</p>,
    options
  );
  if (result) {
    deleteAccount();
    return;
  }
};

const themeToggler = () => {
  curuser = JSON.parse(window.localStorage.getItem("user"));
  state = (curuser.darkmode ? "dark" : "light");

  if (state === "light") {
    try {
      console.log("theme is light, setting to dark");
      const docRef = setDoc(
        doc(db, "users", curuser.email),
        {
          darkmode: true,
        },
        {
          merge: true,
        }
      ).then(function () {
        window.location.reload();
      });
    } catch (e) {
      console.error("Error adding document: ", e);
    }

    curuser.darkmode = true;
    state = "dark";
    window.localStorage.setItem("user", JSON.stringify(curuser));
    window.localStorage.setItem("theme", JSON.stringify(state));
  } else {
    try {
      console.log("theme is dark, setting to light");
      const docRef = setDoc(
        doc(db, "users", curuser.email),
        {
          darkmode: false,
        },
        {
          merge: true,
        }
      ).then(function () {
        window.location.reload();
      });
    } catch (e) {
      console.error("Error adding document: ", e);
    }
    curuser.darkmode = false;
    state = "light";
    window.localStorage.setItem("user", JSON.stringify(curuser));
    window.localStorage.setItem("theme", JSON.stringify(state));
  }
};

function Settings() {
  //const userP = fire.auth().currentUser;
  //var up;
  //if (userP !== null) {
  //  userP.providerData.forEach((profile) => {
  //    up = profile.providerId;
  //    console.log("Sign-in provider: " + profile.providerId);
  //    console.log("  Provider-specific UID: " + profile.uid);
  //  });
  //}
  //change password option only shows up if youre signed in with email and not google.
  curuser = JSON.parse(window.localStorage.getItem("user"));

  // If user is not logged in, redirect to homepage
  if ( curuser == null )
  {
    console.log("user not logged in");
    return <Navigate to='/' />
  }

  if ( isMobile )
  {
    document.body.style.zoom = "60%";
  }
  
  if (curuser.provider != null && curuser.provider == "google.com") {
    return (
      <div>
        <Hero />
        <div>
          <tt class="settings">
            <button className="ttbtn" onClick={() => themeToggler()}>
              {" "}
              Light/Dark Mode{" "}
            </button>
            <button className="ttbtn" onClick={() => deleteAccountConfirm()}>
              {" "}
              Delete Account{" "}
            </button>
          </tt>
        </div>
      </div>
    );
  } else {
    return (
      <div>
        <Hero />
        <div>
          <tt class="settings">
            <button className="ttbtn" onClick={() => themeToggler()}>
              {" "}
              Light/Dark Mode{" "}
            </button>
            <Link to={"/passchange"}>
              <button className="ttbtn">Change Password</button>
            </Link>
            <Link to={"/deleteaccount"}>
              <button className="ttbtn">Delete Account</button>
            </Link>
          </tt>
        </div>
      </div>
    );
  }
}
export { themeToggler };
export default Settings;
