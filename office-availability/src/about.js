import React from "react";

import "firebase/compat/auth";
import "firebase/compat/firestore";
import { Navigate } from "react-router-dom";
import { isMobile } from "react-device-detect";

import Hero from "./Hero";

function About() {
  let curuser = JSON.parse(window.localStorage.getItem("user"));

  // If user is not logged in, redirect to homepage
  if (curuser == null) {
    console.log("user not logged in");
    return <Navigate to="/" />;
  }

  if (isMobile) {
    document.body.style.zoom = "60%";
  }

  return (
    <div>
      <Hero />
      <div class="about">
        <h1 align="center">Overview</h1>
        <p align="center">
          This is a student project being worked on by the group Programming
          Paladins. Its goal is to create a website, iOS, and Android app that
          Ohio University students can use to find available study rooms. It
          will use sensors installed in various study rooms to determine if they
          are occupied or not and display that information on the website and
          mobile apps.
        </p>
      </div>
      <div class="about">
        <h1 align="center">Technologies Used</h1>
        <p align="center">
          Data Storage was done through the Firebase Firestore database.
          Programming was done in ReactJS. We wrote mostly in JavaScript and
          wrote python scripts for our motion sensors and raspberry pi. We used
          Apache to host our website and Cloudflare to create a more secure and
          private connection. Finally, we used PIR sensors, or Passive Infrared
          sensors to detect motion in each room, which gets sent back to the
          database and changes the room status from “Available” to “Occupied”.
        </p>
      </div>
      <div class="about">
        <h1 align="center">Conclusion</h1>
        <p align="center">
          The objective of this project was to make a low cost, low maintenance
          application that students can use to know what rooms are available
          before they step foot outside their dorm rooms. This service was made
          based off the input and feedback of our peers and client and optimized
          the application to meet their standards.
        </p>
      </div>
      <div class="about">
        <ul>
          <li>Team Leader: Alex Neargarder - an435818@ohio.edu</li>
          <li>Documentation Manager: Fadi Alrabadi - fa979119@ohio.edu</li>
          <li>Release Manger: Zelin Zhang - zz125016@ohio.edu</li>
          <li>Quality Assurance Manager: Noah Glazier - ng190817@ohio.edu</li>
        </ul>
      </div>
    </div>
  );
}

export default About;
