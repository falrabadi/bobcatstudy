/* eslint-disable */
import React, { useState, useEffect } from "react";
import Table from "./index.js";
import User from "./User.js";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { lightTheme, darkTheme, GlobalStyles } from "./themes";
import { isMobile } from "react-device-detect";
import { slide as Menu } from "react-burger-menu";
import fire, { provider, db } from "./fire";
import {
    collection,
    getDocs,
    query,
    where,
    doc,
    setDoc,
    updateDoc,
  } from "firebase/firestore";
import { useLocation } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';

let curuser = new User();

const Hero = (props) => {

  curuser = JSON.parse(window.localStorage.getItem("user"));
  if (curuser == null) {
    const fbuilds = [];
    const frooms = [];
    curuser = new User("", "", frooms, fbuilds, false, false, "");
  }

  var state = JSON.parse(window.localStorage.getItem("theme"));
  const [theme, setTheme] = useState(state);

  const Inner = () => {
    
    var [open, setOpen] = useState();

    var accsettingsbutton = document.getElementsByClassName('navbtn')[0];
    var accsettingscog = document.getElementsByClassName('fa fa-cog')[0];

    window.addEventListener("click", function(event) {
        if (event.target == accsettingsbutton || event.target == accsettingscog || event.target.matches('.dropdown')) {
            if(open == true){;
                {open};
            }else{
                {open};
            }
        }else{
            if(open == true){
                open = false;
                setOpen(false);
            }
        }
    });

    const AccSettings = (props) => {
        return (
            <div className="nav-dropdown-button">
            <button className="navbtn" onClick={() => setOpen(!open)}>
                <i className="fa fa-cog" aria-hidden="true"></i>
            </button>

            {open && props.children}
            </div>
        );
    };

    const AccDropdownItem = (props) => {
      return <div className="accdropdown-menu-item">{props.children}</div>;
    };

    const navigate = useNavigate();

    const handlingLogout = () => {
      window.localStorage.clear();
      // Use .then to make sure signout finishes first
      fire.auth().signOut().then( () => navigate('/'));
    };

    const AccDropDownMenu = () => {
      return (
        <div className="dropdown">
          <AccDropdownItem>
            <Routes exact path="/settings" />
            <Link to={"/settings"}>
              <button className="settingsbtn">Account Settings</button>
            </Link>
          </AccDropdownItem>
          <AccDropdownItem>
            <button className="settingsbtn" onClick={handlingLogout} >
              Log out
            </button>
          </AccDropdownItem>
        </div>
      );
    };

    return (
        <AccSettings>
            <AccDropDownMenu />
        </AccSettings>
    );
  };

  const MobileDropdown = (props) => {

    const navigate = useNavigate();

    const handlingLogout = () => {
      window.localStorage.clear();
      // Use .then to make sure signout finishes first
      fire.auth().signOut().then( () => navigate('/'));
    };

    var bmstyle = {
      bmMenuWrap: {
        width: '80%'
      }
    }

    return (
      <Menu styles={ bmstyle } {...props}>
        <Link className={location.pathname === "/" ? "mobilenav current" : "mobilenav"} to="/">
          Favorite Rooms
        </Link>

        <Link className={location.pathname === "/allrooms" ? "mobilenav current" : "mobilenav"} to="/allrooms">
          All Rooms
        </Link>

        <Link className={location.pathname === "/about" ? "mobilenav current" : "mobilenav"} to="/about">
          About
        </Link>

        <Link className={location.pathname === "/settings" ? "mobilenav current" : "mobilenav"} to="/settings">Account Settings</Link>

        <a onClick={handlingLogout}>Log out</a>
      </Menu>
    );
  };

  const location = useLocation();
  console.log(location.pathname);

  if (!isMobile) {
    if (curuser.admin) {
      return (
        <ThemeProvider theme={theme === "light" ? lightTheme : darkTheme}>
          <GlobalStyles />
          <div>
            <section className="hero">
              <nav className="desktop">
                <Link className={location.pathname === "/" ? "leftnav active" : "leftnav"} to="/">
                  Favorite Rooms
                </Link>

                <Link className={location.pathname === "/allrooms" ? "leftnav active" : "leftnav"} to="/allrooms">
                  All Rooms
                </Link>

                <Link className={location.pathname === "/about" ? "leftnav active" : "leftnav"} to="/about">
                  About
                </Link>

                <div class="rightnav">
                  <Outer />
                  <Inner></Inner>
                </div>
              </nav>
            </section>
          </div>
        </ThemeProvider>
      );
    } else {
      return (
        <ThemeProvider theme={theme === "light" ? lightTheme : darkTheme}>
          <GlobalStyles />
          <div>
            <section className="hero">
              <nav className="desktop">
                <Link className={location.pathname === "/" ? "leftnav active" : "leftnav"} to="/">
                  Favorite Rooms
                </Link>

                <Link className={location.pathname === "/allrooms" ? "leftnav active" : "leftnav"} to="/allrooms">
                  All Rooms
                </Link>

                <Link className={location.pathname === "/about" ? "leftnav active" : "leftnav"} to="/about">
                  About
                </Link>

                <div class="rightnav">
                  <Inner></Inner>
                </div>
              </nav>
            </section>
          </div>
        </ThemeProvider>
      );
    }
  } else {
    if (curuser.admin) {
      return (
        <ThemeProvider theme={theme === "light" ? lightTheme : darkTheme}>
          <GlobalStyles />
          <div>
            <section className="hero">
              <nav className="mobile">
                <MobileDropdown pageWrapId={"app"} outerContainerId={"App"} />
              </nav>
            </section>
          </div>
        </ThemeProvider>
      );
    } else {
      return (
        <ThemeProvider theme={theme === "light" ? lightTheme : darkTheme}>
          <GlobalStyles />
          <div>
            <section className="hero">
              <nav className="mobile">
                <MobileDropdown pageWrapId={"app"} outerContainerId={"App"} />
              </nav>
            </section>
          </div>
        </ThemeProvider>
      );
    }
  }
};

function Outer(props) {
  var [openouter, setOuterOpen] = useState(false);

    var addroomsbutton = document.getElementsByClassName('navbutn2')[0];
    var addroomsplus = document.getElementsByClassName('fa fa-plus')[0];

    window.addEventListener("click", function(event) {
        if (event.target == addroomsbutton || event.target == addroomsplus || event.target.matches('.dropdown, .dropdown label, .dropdown input, .dropdown img, .dropdown div')) {
            if(openouter == true){;
                {openouter};
            }else{
                {openouter};
            }
        }else{
            if(openouter == true){
                openouter = false;
                setOuterOpen(false);
            }
        }
    });

  function AddRoom(props) {
    return (
      <div title="Add Room" className="nav-dropdown-button">
        <button className="navbutn2" onClick={() => setOuterOpen(!openouter)}>
          <i className="fa fa-plus" aria-hidden="true"></i>
        </button>
        {openouter && props.children}
      </div>
    );
  }

  function DropdownItem(props) {
    return <div className="dropdown-menu-item">{props.children}</div>;
  }

  function DropDownMenu() {
    const [building, setBuilding] = useState("");
    const [room, setRoom] = useState("");
    const [capacity, setCapacity] = useState("");
    const [info, setInfo] = useState("");
    const [whiteboard, setWhiteboard] = useState(false);
    const [blackboard, setBlackboard] = useState(false);
    const [projector, setProjector] = useState(false);
    const [tv, setTv] = useState(false);
    const [power, setPower] = useState(false);
    const db = firebase.firestore();

    function handleAddRoom() {
      var updatedInfo =
        (whiteboard ? "whiteboard, " : "") +
        (blackboard ? "blackboard, " : "") +
        (projector ? "projector, " : "") +
        (tv ? "tv, " : "") +
        (power ? "power" : "");
      db.collection("rooms")
        .doc(building + " " + room)
        .set({
          Building: building,
          Room: room,
          Info: updatedInfo,
          Capacity: capacity,
          Status: "Available",
        });
        setOuterOpen(!openouter);
    }

    return (
      <div class="dropdown">
        <label>Building </label>
        <DropdownItem>
          <input
            value={building}
            onInput={(e) => setBuilding(e.target.value)}
            type="text"
          />
        </DropdownItem>
        <label>Room </label>
        <DropdownItem>
          <input
            value={room}
            onInput={(e) => setRoom(e.target.value)}
            type="text"
          />
        </DropdownItem>
        <label>Capacity </label>
        <DropdownItem>
          <input
            value={capacity}
            onInput={(e) => setCapacity(e.target.value)}
            type="number"
          />
        </DropdownItem>
        <label>Info </label>
        <div className="icons">
          <DropdownItem>
            <img
              className="info-icons"
              title="This room has a whiteboard"
              width="30px"
              src="whiteboard.png"
            />
            <input
              className="checkbox"
              type="checkbox"
              checked={whiteboard}
              onInput={(e) => setWhiteboard(!e.target.checked)}
              onChange={(e) => ""}
            />
          </DropdownItem>
          <DropdownItem>
            <img
              className="info-icons"
              title="This room has a blackboard"
              width="30px"
              src="blackboard.png"
            />
            <input
              className="checkbox"
              type="checkbox"
              checked={blackboard}
              onInput={(e) => setBlackboard(!e.target.checked)}
              onChange={(e) => ""}
            />
          </DropdownItem>
          <DropdownItem>
            <img
              className="info-icons"
              title="This room has a projector"
              width="30px"
              src="projector.png"
            />
            <input
              className="checkbox"
              type="checkbox"
              checked={projector}
              onInput={(e) => setProjector(!e.target.checked)}
              onChange={(e) => ""}
            />
          </DropdownItem>
          <DropdownItem>
            <img
              className="info-icons"
              title="This room has a TV"
              width="30px"
              src="tv.png"
            />
            <input
              className="checkbox"
              type="checkbox"
              checked={tv}
              onInput={(e) => setTv(!e.target.checked)}
              onChange={(e) => ""}
            />
          </DropdownItem>
          <DropdownItem>
            <img
              className="info-icons"
              title="This room has power outlets"
              width="30px"
              src="power.png"
            />
            <input
              className="checkbox"
              type="checkbox"
              checked={power}
              onInput={(e) => setPower(!e.target.checked)}
              onChange={(e) => ""}
            />
          </DropdownItem>
        </div>
        <DropdownItem>
          <button onClick={handleAddRoom}>
            <i className="fa fa-check" aria-hidden="true"></i>
          </button>
        </DropdownItem>
      </div>
    );
  }

  return (
    <AddRoom>
      <DropDownMenu />
    </AddRoom>
  );
}

export default Hero;
