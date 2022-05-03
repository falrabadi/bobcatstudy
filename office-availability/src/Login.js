import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, BrowserRouter } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";


const Login = (props) => {
  const {
    email,
    setEmail,
    password,
    setPassword,
    handleLogin,
    signInWithGooglePopup,
    handleSignup,
    hasAccount,
    setHasAccount,
    emailError,
    passwordError,
  } = props;

  const [agree, setAgree] = useState(false);

  const canBeSubmitted = () => {
    const isValid = agree;

    if(!hasAccount){
      if (isValid) {
        document.getElementById("submitButton").removeAttribute("disabled");
      } else {
        document.getElementById("submitButton").setAttribute("disabled", true);
      }
    }
    
  };

  useEffect(() => canBeSubmitted());

  return (
    <section className="login">
        <div className="loginlogo">
            <img src="Logo.png" />
        </div>
      <div className="loginContainer">
        <label className="loginlbl">Email</label>
        <input
          type="text"
          autoFocus
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <p className="errorMsg">{emailError}</p>
        <label className="loginlbl">Password</label>
        <input
          type="password"
          requiredvalue={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <p className="errorMsg">{passwordError}</p>
        <div className="btnContainer">
        <Toaster />
          {hasAccount ? (
            <>
              <button onClick={handleLogin}>Sign in</button>
              <p>
                Don't have an account?{" "}
                <span onClick={() => setHasAccount(!hasAccount)}>Sign up</span>
              </p>
                <Routes exact path="/forgotpass" />
                <Link style={{textDecoration: 'none'}} to={"/forgotpass"}>
                  <p>
                    <span>Forgot password?</span>
                  </p>
                </Link>
              
            </>
          ) : (
            <>
              <input className="chkbox"
                type="checkbox"
                name="agree"
                id="agree"
                onClick={(e) => setAgree(e.target.checked)}
              />
              <label className="chkboxlbl">I acknowledge that I have read and agree to the Bobcat Study <Link className='toslink' to={"/termsofservice"} target="blank"> Terms of Service </Link> </label>
              <br />
              <button type="submit" id="submitButton" onClick={handleSignup} >Sign up</button>
              <p>
                Already have an account?{" "}
                <span onClick={() => setHasAccount(!hasAccount) & setAgree(false)}>Sign in</span>
              </p>
            </>
          )}
        </div>
        
        <div className="GoogleAuth">
          <label className="loginlbl">OR</label>
          <button onClick={signInWithGooglePopup}>Sign in with Google</button>
        </div>
      </div>
    </section>
  );
};

export default Login;
