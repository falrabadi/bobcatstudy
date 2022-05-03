import React, { useState, useEffect } from "react";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import Hero from "./Hero";
import {
  getAuth,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  BrowserRouter,
} from "react-router-dom";
import fire from "./fire";
import { Navigate } from 'react-router-dom';
import { toast, Toaster } from "react-hot-toast";

const PassForm = (props) => {
  const [newPassword, setNewPassword] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");


  function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
  }

  const handleSubmit = () => {
    const auth = getAuth();
    const user = auth.currentUser;
    const credential = EmailAuthProvider.credential(user.email, oldPassword);
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.{8,})/.test(newPassword)) {
      setPasswordError(
        "Password does not meet requirements (At least 8 characters long, one upper case & one lower case letter)"
      );
      return;
    }
    reauthenticateWithCredential(user, credential)
      .then(() => {
        updatePassword(user, newPassword)

        .then(() => {
          toast("Successfully changed password");
          delay(2500).then(() => window.location.href = "/settings");
          
        })
        .catch((error) => {
          alert("error changing passwword: ", error);
        });
        
      })
      .catch((error) => {
        setPasswordError("Current Password is Incorrect");
      });
  };


  return (
    <section className="login">
      <div className="loginContainer">
        <Toaster />
        <label className="passreset">Change Password</label>
        <div onSubmit={handleSubmit}>
          <label className="emaillabel">Current Password</label>
          <input
            type="password"
            autoFocus
            required
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />
          <label className="emaillabel">New Password</label>
          <input
            type="password"
            required
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <p className="errorMsg">{passwordError}</p>
          <div className="btnContainer">
            <button onClick={handleSubmit} type="submit">
              Change Password
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

export default PassForm;
