import React, { useState, useEffect } from "react";
import fire, { provider, db } from "./fire";
import Login from "./Login";
import Hero from "./Hero";
import "./App.css";
import {
  collection,
  addDoc,
  doc,
  setDoc,
  getDocs,
  deleteDoc,
  query,
  where,
} from "firebase/firestore";
import {
  getAuth,
  onAuthStateChanged,
  sendEmailVerification,
  updatePassword,
  emailVerified,
  sendPasswordResetEmail,
  additionalUserInfo
} from "firebase/auth";
import User from "./User.js";
import { Table } from "./index.js";
import { useNavigate } from "react-router";
import { toast, Toaster } from "react-hot-toast";
import { BrowserRouter as Router, Routes, Route, Link, BrowserRouter } from "react-router-dom";
import OUProvider from "./ouprovider";
import { isMobile } from "react-device-detect";

//current user. to be exported after user's email is filled in
const fbuilds = [];
const frooms = [];
var curuser = new User("", "", frooms, fbuilds, false);

const App = () => {
  const [user, setUser] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [hasAccount, setHasAccount] = useState("");

  const clearInputs = () => {
    setEmail("");
    setPassword("");
  };

  const clearErrors = () => {
    setEmailError("");
    setPasswordError("");
  };

  const handleLogin = () => {
    clearErrors();
    fire
      .auth()
      .signInWithEmailAndPassword(email, password)
      .catch((err) => {
        switch (err.code) {
          case "auth/invalid-email":
            setEmailError("This email is badly formatted");
            break;
          case "auth/user-disabled":
            setEmailError("User disabled");
            break;
          case "auth/user-not-found":
            setEmailError("This email does not exist");
            break;
          case "auth/wrong-password":
            setPasswordError("Incorrect password");
            break;
        }
      });
  };

  const handleSignup = () => {
    clearErrors();
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.{8,})/.test(password)) {
      setPasswordError(
        "Password does not meet requirements (At least 8 characters long, one upper case & one lower case letter)"
      );
    }else if (!/[a-z0-9]+@ohio.edu/.test(email)){
        setEmailError("Must be a valid 'Ohio.edu' email address");
    }else {
      fire
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
          const username = email.split("@");
          let name = username[0];
          userCredential.user
            .updateProfile({
              displayName: name,
            })
            .then(function () {
              userCredential.user.sendEmailVerification();
              fire.auth().signOut();
            });
          try {
            //add user to firestore database
            const docRef = setDoc(doc(db, "users", email), {
              admin: false,
              darkmode: false,
              email: email,
              favbuild: fbuilds,
              favroom: frooms,
            });
          } catch (e) {
            console.error("Error adding document: ", e);
          }
        })
        .catch((err) => {
            switch (err.code) {
              case "auth/email-already-in-use":
                setEmailError("This email address is already in use.");
                break;
              case "auth/invalid-email":
                setEmailError(
                  "Invalid email format, must be 'example@example.com'"
                );
                break;
              case "auth/weak-password":
                setPasswordError("The password connected to this email is invalid");
                break;
            }
          });
    }
  };

  const handleLogout = () => {
    fire.auth().signOut();
  };

  const signInWithGooglePopup = () => {
    fire
    .auth()
    .signInWithPopup(provider)
    .catch((err) => {
        switch (err.code) {
            case "auth/email-already-in-use":
            setEmailError("This email address is already in use.");
            break;
            case "auth/invalid-email":
            setEmailError(
                "Invalid email format, must be 'example@example.com'"
            );
            break;
            case "auth/weak-password":
            setPasswordError("The password connected to this email is invalid");
            break;
        }
    });

    //find if google user is first time user
    const auth = getAuth();

    onAuthStateChanged(auth, (user) => {
      if (user) {
        const email = user.email;
        const uid = user.uid;
        //console.log("user is signed in: %s", user.email);
        const usersRef = collection(db, "users");

        //compare email to emails already in user database
        const q = query(usersRef, where("email", "in", [email]));
        const querySnapshot = getDocs(q).then((querySnapshot) => {
          //if matched emails is 0, they are a new user
          if (querySnapshot.size == 0) {
            //console.log("this is a new user. adding to database");

            //add user to firestore database
            try {
              const docRef = setDoc(doc(db, "users", email), {
                admin: false,
                darkmode: false,
                email: email,
                favbuild: fbuilds,
                favroom: frooms,
                signedInWithEmailLink: false,
              });
                const auth = getAuth();
                const user = auth.currentUser;
                console.log(user);
            } catch (e) {
              console.error("Error adding document: ", e);
            }
          }
        });
      } else {
        console.log("user is logged out");
      }
    })
  };

  const authListener = () => {
    fire.auth().onAuthStateChanged((user) => {
      if (user) {
        var isVerified = user.emailVerified;
        if (isVerified) {
          clearInputs();
          setUser(user);
          curuser.email = user.email;
          //window.localStorage.setItem("user", JSON.stringify(curuser));
        } else {
            toast(
                "A message has been sent to your email address, please verify before signing in"
            );
          fire.auth().signOut();
        }
      } else {
        setUser("");
      }
    });
  };

  useEffect(() => {
    authListener();
  }, []);

  const navigate = useNavigate();

  //read in user data, this lets us check if we've already loaded the user
  curuser = JSON.parse(window.localStorage.getItem("user"));

  if ( isMobile )
  {
    document.body.style.zoom = "80%";
  }

  // If the user is authenticated, then we attempt to load the user data from the database
  if (user || (curuser && curuser.loaded)) {
    if (curuser && curuser.loaded) {
      return (
        <div id="app" className="App">
          <>
            <Hero handleLogout={handleLogout} />
            <Table />
          </>
        </div>
      );
    } else {
      curuser = new User("", "", frooms, fbuilds, false);
      curuser.email = user.email;

      //read user favorites in from firebase
      const usersRef = collection(db, "users");
      const u = query(usersRef, where("email", "==", curuser.email)); //find the firestore document that matches current user's email
      user.providerData.forEach((profile) => {
        curuser.provider = profile.providerId;
        //console.log("Sign-in provider: " + profile.providerId);
        //console.log("  Provider-specific UID: " + profile.uid);
      });
      const userSnapshot = getDocs(u).then((userSnapshot) => {
        // Check if user is already in database
        if (userSnapshot.size > 0) {
          userSnapshot.forEach((doc) => {
            curuser.darkmode = doc.data().darkmode;
            curuser.admin = doc.data().admin;
            curuser.favoriteRooms = doc.data().favroom; //load favorite rooms into curuser
            curuser.favoriteBuildings = doc.data().favbuild; // load favorite buildings into curuser
            curuser.signedInWithEmailLink = doc.data().signedInWithEmailLink;
            curuser.loaded = true;
            

            window.localStorage.setItem("user", JSON.stringify(curuser));
            window.localStorage.setItem(
              "theme",
              JSON.stringify(curuser.darkmode ? "dark" : "light")
            );

            console.log(curuser.signedInWithEmailLink )
            // If user hasn't verified their email yet, send them to the verification page
            if ( curuser.signedInWithEmailLink == false && curuser.provider == "google.com" )
            {
              navigate("/ouprovider");
            }
            // If user has favorites, send them to favorites page
            else if (curuser.favoriteRooms && curuser.favoriteRooms.length > 0) {
              navigate("/");
            }
            // Otherwise, send them to the all rooms page
            else {
              console.log("navigating to allrooms");
              navigate("allrooms");
            }
          });
        } else {
          // User isn't in database, need to add them
          //add user to firestore database
          try {
            console.log("email" + user.email);
            const docRef = setDoc(doc(db, "users", user.email), {
              admin: false,
              darkmode: false,
              email: user.email,
              favbuild: fbuilds,
              favroom: frooms,
              signedInWithEmailLink: false,
            }).then(function () {
              curuser.darkmode = false;
              curuser.admin = false;
              curuser.favoriteRooms = frooms; //load favorite rooms into curuser
              curuser.favoriteBuildings = fbuilds; // load favorite buildings into curuser
              curuser.loaded = true;
              curuser.signedInWithEmailLink = false;

              window.localStorage.setItem("user", JSON.stringify(curuser));
              window.localStorage.setItem(
                "theme",
                JSON.stringify(curuser.darkmode ? "dark" : "light")
              );

              // If user has favorites, send them to favorites page
              if (curuser.favoriteRooms && curuser.favoriteRooms.length > 0) {
                navigate("/");
              }
              // Otherwise, send them to the all rooms page
              else if (curuser.signedInWithEmailLink == false && curuser.provider == "google.com") {
                console.log("going to ouprovider");
                window.location.href = '/ouprovider';
              } else {
                console.log("navigating to allrooms");
                navigate("allrooms");
              }
            });
          } catch (e) {
            console.error("Error adding document: ", e);
          }
        }
      });

      return (
        <div id="app" className="App">
          <Login
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            handleLogin={handleLogin}
            handleSignup={handleSignup}
            signInWithGooglePopup={signInWithGooglePopup}
            hasAccount={hasAccount}
            setHasAccount={setHasAccount}
            emailError={emailError}
            passwordError={passwordError}
          />
        </div>
      );
    }
  } else {
    return (
      <div id="app" className="App">
        <Login
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          handleLogin={handleLogin}
          handleSignup={handleSignup}
          signInWithGooglePopup={signInWithGooglePopup}
          hasAccount={hasAccount}
          setHasAccount={setHasAccount}
          emailError={emailError}
          passwordError={passwordError}
        />
      </div>
    );
  }
};

export default App;
export { curuser }; //export the current user
