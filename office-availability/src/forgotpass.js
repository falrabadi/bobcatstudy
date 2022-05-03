import React, { useState } from "react";
import "./App.css";
import Login from "./Login";
import { BrowserRouter as Router, Routes, Route, Link, BrowserRouter } from "react-router-dom";
import fire from "./fire";
import { toast, Toaster } from "react-hot-toast";

const Forgotpass = (props) => {
    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState("");

    const handleSubmit = () => {
        if (!/[a-z0-9]+@ohio.edu/.test(email)){
            setEmailError("Must be a valid 'Ohio.edu' email address");
        }else{
        setEmailError("");
        fire.auth().sendPasswordResetEmail(email).then(() => {
            toast("A password reset email has been sent to the email provided");
        })
        .catch((err) => {
            switch (err.code) {
                case "auth/email-already-in-use":
                    setEmailError("This email address is already in use.");
                    break;
                case "auth/invalid-email":
                    setEmailError("Invalid email format, must be 'example@example.com'");
                    break;
                case "auth/user-not-found":
                    setEmailError("This email does not exist");
                    break;
            }
        });
    }
    }
  
    return (
      <section className="login">
        <div className="loginlogo">
            <img src="Logo.png" />
        </div>
        <div className="loginContainer">
        <label className="passreset">Password Reset</label>
        <div onSubmit={handleSubmit}>
        <Toaster />
            <label className="emaillabel">Email</label>
            <input
                type="text"
                autoFocus
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <p className="errorMsg">{emailError}</p>
            <div className="btnContainer">
                <button onClick={handleSubmit} type="submit">Reset Password</button>
            </div>
        </div>
          <div className="btnContainer">
              <p>
                <Link to={"/"}>
                    <button>Return</button>
                </Link>
              </p>
          </div>
          
        </div>
      </section>
    );
  };

export default Forgotpass;