/* eslint-disable */
/**
 * 2022
 * @alias index.js
 * @author Program paladins
 * @abstract room list
 */

"use strict";

import React, { useState, useEffect, useCallback } from "react";
import ReactDOM from "react-dom";
import fire, { provider, db, requestForToken, onMessageListener } from "./fire";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import Room from "./Room.js";
import { confirm } from "react-confirm-box";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import User from "./User.js";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  collection,
  getDocs,
  getDoc,
  query,
  where,
  doc,
  setDoc,
  onSnapshot,
} from "firebase/firestore";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Allrooms from "./allrooms";
import About from "./about.js";
import Hero from "./Hero";
import Settings from "./settings.js";
import PassForm from "./passwordform.js";
import Forgotpass from "./forgotpass.js";
import TermsOfService from "./termsofservice";
import Reauth from "./reauth.js";
import toast, { Toaster } from "react-hot-toast";
import { isMobile } from "react-device-detect";
import OUProvider from "./ouprovider.js";
import OUConfirm from "./ouconfirm";

let rowHeader1 = [];
let rows1 = [];
//let title2 = []
let rowHeader2 = [];
let rows2 = [];
let curuser = new User();
let isTableLoading = true;
/**
 * @class Table
 * @abstract create the table class for room list.
 */
class Table extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rooms: [],
      rowNum: 0,
      colNum: 4,

      db: firebase.firestore(),
      isLoading: false, //used to not render page, until data is retrieved from firestore.
    };

    // Load rooms from firestore database here
    const roomsRef = collection(db, "rooms");
    const q = query(roomsRef);
    const querySnapshot = getDocs(q).then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        //push each room
        var info = " ";
        if (doc.data().Info != null) {
          info = doc.data().Info;
        }

        var infoparsed = this.parseRoomInfo(info);

        this.state.rooms.push(
          new Room(
            doc.data().Building,
            doc.data().Room,
            doc.data().Capacity,
            infoparsed,
            doc.data().Status,

            (
              <button
                className="favorite"
                value={doc.data().Building + " " + doc.data().Room}
                onClick={(e) => this.favoriteRoom(e)}
              >
                <i
                  value={doc.data().Building + " " + doc.data().Room}
                  className="fa fa-star"
                ></i>
              </button>
            ),
            (
              <button
                className="remove"
                value={doc.data().Building + " " + doc.data().Room}
                onClick={(e) => this.removeRoom(e)}
              >
                <i
                  value={doc.data().Building + " " + doc.data().Room}
                  className="fa fa-times"
                  aria-hidden="true"
                ></i>
              </button>
            ),
            (
              <button
                className="notifications"
                value={doc.data().Building + " " + doc.data().Room}
                onClick={(e) => this.notifyme(e)}
              >
                <i
                  value={doc.data().Building + " " + doc.data().Room}
                  className="fa fa-bell"
                  aria-hidden="true"
                ></i>
              </button>
            )
          )
        );
        ++this.state.rowNum;
      });
      this.forceUpdate();
    });

    this.state.db.collection("rooms").onSnapshot((querySnapshot) => {
      //console.log("CHANGING", Date.now() );
      //let cur = [];

      this.state.rooms = [];
      this.state.rowNum = 0;

      querySnapshot.forEach((doc) => {
        //push each room
        var info = " ";
        if (doc.data().Info != null) {
          info = doc.data().Info;
        }

        //var fav = false;
        var infoparsed = this.parseRoomInfo(info);
        //for(var j = 0; j < curuser.favoriteRooms.length; j++){
        /*if(curuser.favoriteBuildings[j] == doc.data().Building && curuser.favoriteRooms[j] == doc.data().Room){
          fav = true;
        this.state.rooms.push( new Room(doc.data().Building, doc.data().Room, 
          doc.data().Capacity, infoparsed, doc.data().Status, 

          
          <button className="favorited"value={doc.data().Building + " " + doc.data().Room} 
          onClick={e => this.favoriteRoom(e)}><i value={doc.data().Building + " " + 
          doc.data().Room} class="fa fa-star"></i></button>,
          

          <button class="remove" value={doc.data().Building + " " + doc.data().Room} 
            onClick={e => this.removeRoom(e)}><i value={doc.data().Building + " " + 
            doc.data().Room} class="fa fa-times" aria-hidden="true"></i></button> ));}
         }
         if(fav == false){*/
        this.state.rooms.push(
          new Room(
            doc.data().Building,
            doc.data().Room,
            doc.data().Capacity,
            infoparsed,
            doc.data().Status,

            (
              <button
                className="favorite"
                value={doc.data().Building + " " + doc.data().Room}
                onClick={(e) => this.favoriteRoom(e)}
              >
                <i
                  value={doc.data().Building + " " + doc.data().Room}
                  className="fa fa-star"
                ></i>
              </button>
            ),
            (
              <button
                className="remove"
                value={doc.data().Building + " " + doc.data().Room}
                onClick={(e) => this.removeRoom(e)}
              >
                <i
                  value={doc.data().Building + " " + doc.data().Room}
                  className="fa fa-times"
                  aria-hidden="true"
                ></i>
              </button>
            ),
            (
              <button
                className="notifications"
                value={doc.data().Building + " " + doc.data().Room}
                style={{ color: "  color: #024230" }}
                onClick={(e) => this.notifyme(e)}
              >
                <Toaster />
                <i
                  value={doc.data().Building + " " + doc.data().Room}
                  className="fa fa-bell"
                  aria-hidden="true"
                ></i>
              </button>
            )
          )
        );

        ++this.state.rowNum;
      });
      isTableLoading = false;
      this.forceUpdate();
    });

    /**
     *
     * @param {*} cells
     * @param {room number} col1
     * @param {devices} col2
     * @param {room status} col3
     * @param {favorite button} col4
     * @param {*} num
     */
    //read in user data (accounts for page refreshes)
    curuser = JSON.parse(window.localStorage.getItem("user"));
    if (curuser == null) {
      console.log("reloading user")
      const fbuilds = [];
      const frooms = [];
      curuser = new User("", "", frooms, fbuilds, false, false, "");

      //read user favorites in from firebase
      const usersRef = collection(db, "users");
      const u = query(usersRef, where("email", "==", curuser.email)); //find the firestore document that matches current user's email
      const userSnapshot = getDocs(u).then((userSnapshot) => {
        userSnapshot.forEach((doc) => {
          curuser.darkmode = doc.data().darkmode;
          curuser.admin = doc.data().admin;
          curuser.favoriteRooms = doc.data().favroom; //load favorite rooms into curuser
          curuser.favoriteBuildings = doc.data().favbuild; // load favorite buildings into curuser

          window.localStorage.setItem("user", JSON.stringify(curuser));
        });

        this.setState({ isLoading: false }); //state is no longer loading in firestore data
      });
    }
  }

  // Creates a row with 3 cells: col1, col2, col3, and col4
  create4Header(cells, col1, col2, col3, col4, num) {
    let cellID = `cell${num}-0`;
    cells.push(
      <th key={cellID} id={cellID}>
        {col1}
      </th>
    );
    cellID = `cell${num}-1`;
    cells.push(
      <th key={cellID} id={cellID}>
        {col2}
      </th>
    );
    cellID = `cell${num}-2`;
    cells.push(
      <th key={cellID} id={cellID}>
        {col3}
      </th>
    );
    cellID = `cell${num}-3`;
    cells.push(
      <th key={cellID} id={cellID}>
        {col4}
      </th>
    );
  }
  // Creates a row with 3 cells: col1, col2, col3, and col4
  create6Header(cells, col1, col2, col3, col4, col5, col6, num) {
    let cellID = `cell${num}-0`;
    cells.push(
      <th onClick={this.sortTable} key={cellID} id={cellID}>
        {col1}
      </th>
    );
    cellID = `cell${num}-1`;
    cells.push(
      <th onClick={this.sortTable} key={cellID} id={cellID}>
        {col2}
      </th>
    );
    cellID = `cell${num}-2`;
    cells.push(
      <th onClick={this.sortTable} key={cellID} id={cellID}>
        {col3}
      </th>
    );
    cellID = `cell${num}-3`;
    cells.push(
      <th key={cellID} id={cellID}>
        {col4}
      </th>
    );
    cellID = `cell${num}-4`;
    cells.push(
      <th onClick={this.sortTable} key={cellID} id={cellID}>
        {col5}
      </th>
    );
    cellID = `cell${num}-5`;
    cells.push(
      <th onClick={this.sortTable} key={cellID} id={cellID}>
        {col6}
      </th>
    );
  }

  // Creates a row with 3 cells: col1, col2, col3, and col4
  create7Header(cells, col1, col2, col3, col4, col5, col6, col7, num) {
    let cellID = `cell${num}-0`;
    cells.push(
      <th key={cellID} id={cellID}>
        {col1}
      </th>
    );
    cellID = `cell${num}-1`;
    cells.push(
      <th key={cellID} id={cellID}>
        {col2}
      </th>
    );
    cellID = `cell${num}-2`;
    cells.push(
      <th key={cellID} id={cellID}>
        {col3}
      </th>
    );
    cellID = `cell${num}-3`;
    cells.push(
      <th key={cellID} id={cellID}>
        {col4}
      </th>
    );
    cellID = `cell${num}-4`;
    cells.push(
      <th key={cellID} id={cellID}>
        {col5}
      </th>
    );
    cellID = `cell${num}-5`;
    cells.push(
      <th key={cellID} id={cellID}>
        {col6}
      </th>
    );
    cellID = `cell${num}-6`;
    cells.push(
      <th key={cellID} id={cellID}>
        {col7}
      </th>
    );
  }

  create8Header(cells, col1, col2, col3, col4, col5, col6, col7, col8, num) {
    let cellID = `cell${num}-0`;
    cells.push(
      <th key={cellID} id={cellID}>
        {col1}
      </th>
    );
    cellID = `cell${num}-1`;
    cells.push(
      <th key={cellID} id={cellID}>
        {col2}
      </th>
    );
    cellID = `cell${num}-2`;
    cells.push(
      <th key={cellID} id={cellID}>
        {col3}
      </th>
    );
    cellID = `cell${num}-3`;
    cells.push(
      <th key={cellID} id={cellID}>
        {col4}
      </th>
    );
    cellID = `cell${num}-4`;
    cells.push(
      <th key={cellID} id={cellID}>
        {col5}
      </th>
    );
    cellID = `cell${num}-5`;
    cells.push(
      <th key={cellID} id={cellID}>
        {col6}
      </th>
    );
    cellID = `cell${num}-6`;
    cells.push(
      <th key={cellID} id={cellID}>
        {col7}
      </th>
    );
    cellID = `cell${num}-7`;
    cells.push(
      <th key={cellID} id={cellID}>
        {col8}
      </th>
    );
  }

  // Creates a row with 4 cells: col1, col2, col3, and col4
  create4Row(cells, col1, col2, col3, col4, num) {
    let cellID = `cell${num}-0`;
    cells.push(
      <td key={cellID} id={cellID}>
        {col1}
      </td>
    );
    cellID = `cell${num}-1`;
    cells.push(
      <td key={cellID} id={cellID}>
        {col2}
      </td>
    );
    cellID = `cell${num}-2`;
    cells.push(
      <td key={cellID} id={cellID}>
        {col3}
      </td>
    );
    cellID = `cell${num}-3`;
    cells.push(
      <td key={cellID} id={cellID}>
        {col4}
      </td>
    );
  }

  // Creates a row with 5 cells: col1, col2, col3, col4, col5
  create6Row(cells, col1, col2, col3, col4, col5, col6, num) {
    let cellID = `cell${num}-0`;
    cells.push(
      <td key={cellID} id={cellID}>
        {col1}
      </td>
    );
    cellID = `cell${num}-1`;
    cells.push(
      <td key={cellID} id={cellID}>
        {col2}
      </td>
    );
    cellID = `cell${num}-2`;
    cells.push(
      <td key={cellID} id={cellID}>
        {col3}
      </td>
    );
    cellID = `cell${num}-3`;
    cells.push(
      <td key={cellID} id={cellID}>
        {col4}
      </td>
    );
    if(curuser.darkmode == true){
        if (col5 == "Available") {
            cellID = `cell${num}-4`;
            cells.push(
                <td style={{ color: "green", borderColor: "gray" }} key={cellID} id={cellID}>
                {col5}
                </td>
            );
        } else{
            cellID = `cell${num}-4`;
            cells.push(
                <td style={{ color: "red", borderColor: "gray" }} key={cellID} id={cellID}>
                {col5}
                </td>
            );
        }
    }else{
        if (col5 == "Available") {
            cellID = `cell${num}-4`;
            cells.push(
                <td style={{ color: "green", borderColor: "gray" }} key={cellID} id={cellID}>
                {col5}
                </td>
            );
        } else{
            cellID = `cell${num}-4`;
            cells.push(
                <td style={{ color: "red", borderColor: "gray" }} key={cellID} id={cellID}>
                {col5}
                </td>
            );
        }
    }
    cellID = `cell${num}-5`;
    cells.push(
      <td key={cellID} id={cellID}>
        {col6}
      </td>
    );
  }

  // Creates a row with 5 cells: col1, col2, col3, col4, col5
  create7Row(cells, col1, col2, col3, col4, col5, col6, col7, num) {
    let cellID = `cell${num}-0`;
    cells.push(
      <td key={cellID} id={cellID}>
        {col1}
      </td>
    );
    cellID = `cell${num}-1`;
    cells.push(
      <td key={cellID} id={cellID}>
        {col2}
      </td>
    );
    cellID = `cell${num}-2`;
    cells.push(
      <td key={cellID} id={cellID}>
        {col3}
      </td>
    );
    cellID = `cell${num}-3`;
    cells.push(
      <td key={cellID} id={cellID}>
        {col4}
      </td>
    );
    if(curuser.darkmode == true){
        if (col5 == "Available") {
            cellID = `cell${num}-4`;
            cells.push(
                <td style={{ color: "green", borderColor: "gray" }} key={cellID} id={cellID}>
                {col5}
                </td>
            );
        } else{
            cellID = `cell${num}-4`;
            cells.push(
                <td style={{ color: "red", borderColor: "gray" }} key={cellID} id={cellID}>
                {col5}
                </td>
            );
        }
    }else{
        if (col5 == "Available") {
            cellID = `cell${num}-4`;
            cells.push(
                <td style={{ color: "green", borderColor: "gray" }} key={cellID} id={cellID}>
                {col5}
                </td>
            );
        } else{
            cellID = `cell${num}-4`;
            cells.push(
                <td style={{ color: "red", borderColor: "gray" }} key={cellID} id={cellID}>
                {col5}
                </td>
            );
        }
    }
    cellID = `cell${num}-5`;
    cells.push(
      <td key={cellID} id={cellID}>
        {col6}
      </td>
    );
    cellID = `cell${num}-6`;
    cells.push(
      <td key={cellID} id={cellID}>
        {col7}
      </td>
    );
  }

  create8Row(cells, col1, col2, col3, col4, col5, col6, col7, col8, num) {
    let cellID = `cell${num}-0`;
    cells.push(
      <td key={cellID} id={cellID}>
        {col1}
      </td>
    );
    cellID = `cell${num}-1`;
    cells.push(
      <td key={cellID} id={cellID}>
        {col2}
      </td>
    );
    cellID = `cell${num}-2`;
    cells.push(
      <td key={cellID} id={cellID}>
        {col3}
      </td>
    );
    cellID = `cell${num}-3`;
    cells.push(
      <td key={cellID} id={cellID}>
        {col4}
      </td>
    );
    if(curuser.darkmode == true){
        if (col5 == "Available") {
            cellID = `cell${num}-4`;
            cells.push(
                <td style={{ color: "green", borderColor: "gray" }} key={cellID} id={cellID}>
                {col5}
                </td>
            );
        } else{
            cellID = `cell${num}-4`;
            cells.push(
                <td style={{ color: "red", borderColor: "gray" }} key={cellID} id={cellID}>
                {col5}
                </td>
            );
        }
    }else{
        if (col5 == "Available") {
            cellID = `cell${num}-4`;
            cells.push(
                <td style={{ color: "green", borderColor: "gray" }} key={cellID} id={cellID}>
                {col5}
                </td>
            );
        } else{
            cellID = `cell${num}-4`;
            cells.push(
                <td style={{ color: "red", borderColor: "gray" }} key={cellID} id={cellID}>
                {col5}
                </td>
            );
        }
    }
    cellID = `cell${num}-5`;
    cells.push(
      <td key={cellID} id={cellID}>
        {col6}
      </td>
    );
    cellID = `cell${num}-6`;
    cells.push(
      <td key={cellID} id={cellID}>
        {col7}
      </td>
    );
    cellID = `cell${num}-7`;
    cells.push(
      <td key={cellID} id={cellID}>
        {col8}
      </td>
    );
  }

  sortTable(e) {
    var n = e.target.id[e.target.id.length - 1];

    var table,
      rows,
      switching,
      i,
      x,
      y,
      shouldSwitch,
      dir,
      switchcount = 0;
    table = document.getElementById("simple-table2");
    switching = true;

    dir = "asc";

    if ( e.target.innerText.includes("▾") )
    {
      dir = "desc";
    }

    while (switching) {
      switching = false;
      rows = table.rows;

      for (i = 1; i < rows.length - 1; i++) {
        shouldSwitch = false;

        x = rows[i].getElementsByTagName("TD")[n];
        y = rows[i + 1].getElementsByTagName("TD")[n];

        
        // Convert numbers to ints so javascript doesn't do bad math
        if ( n == 1 || n == 2 )
        {
          if (dir == "asc") {
            if (parseInt(x.innerHTML) > parseInt(y.innerHTML)) {
              shouldSwitch = true;
              break;
            }
          } else if (dir == "desc") {
            if (parseInt(x.innerHTML) < parseInt(y.innerHTML)) {
              shouldSwitch = true;
              break;
            }
          }
        }
        else
        {
          if (dir == "asc") {
            if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
              shouldSwitch = true;
              break;
            }
          } else if (dir == "desc") {
            if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
              shouldSwitch = true;
              break;
            }
          }
        }
      }
      if (shouldSwitch) {
        rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
        switching = true;
        switchcount++;
      }
    }

    var headerRow = e.target.parentNode.children;

    for ( var i = 0; i < headerRow.length; ++i )
    {
      if ( headerRow[i].innerText.includes("▾") || headerRow[i].innerText.includes("▴") )
      {
        headerRow[i].innerText = headerRow[i].innerText.substring(0, headerRow[i].innerText.length - 2 );
      }
    }

    if ( dir == "asc" )
    {
      e.target.innerText = e.target.innerText + " ▾";
    }
    else
    {
      e.target.innerText = e.target.innerText + " ▴";
    }

    window.localStorage.setItem("sorted", dir + n );
  }

  sortTableUpdate() {
    var str = window.localStorage.getItem("sorted");

    if ( str == null || str == "" )
    {
      str = "asc0";
    }

    var n = str[str.length - 1];
    var e = document.getElementById("simple-table2").rows[0].children[n];

    var table,
      rows,
      switching,
      i,
      x,
      y,
      shouldSwitch,
      dir,
      switchcount = 0;
    table = document.getElementById("simple-table2");
    switching = true;

    dir = str.substring(0, str.length-1);

    while (switching) {
      switching = false;
      rows = table.rows;

      for (i = 1; i < rows.length - 1; i++) {
        shouldSwitch = false;

        x = rows[i].getElementsByTagName("TD")[n];
        y = rows[i + 1].getElementsByTagName("TD")[n];

        // Convert numbers to ints so javascript doesn't do bad math
        if ( n == 1 || n == 2 )
        {
          if (dir == "asc") {
            if (parseInt(x.innerHTML) > parseInt(y.innerHTML)) {
              shouldSwitch = true;
              break;
            }
          } else if (dir == "desc") {
            if (parseInt(x.innerHTML) < parseInt(y.innerHTML)) {
              shouldSwitch = true;
              break;
            }
          }
        }
        else
        {
          if (dir == "asc") {
            if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
              shouldSwitch = true;
              break;
            }
          } else if (dir == "desc") {
            if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
              shouldSwitch = true;
              break;
            }
          }
        }
      }
      if (shouldSwitch) {
        rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
        switching = true;
        switchcount++;
      }
    }

    var headerRow = e.parentNode.children;

    for ( var i = 0; i < headerRow.length; ++i )
    {
      if ( headerRow[i].innerText.includes("▾") || headerRow[i].innerText.includes("▴") )
      {
        headerRow[i].innerText = headerRow[i].innerText.substring(0, headerRow[i].innerText.length - 2 );
      }
    }

    if ( dir == "asc" )
    {
      e.innerText = e.innerText + " ▾";
    }
    else
    {
      e.innerText = e.innerText + " ▴";
    }
  }

  notifyme(e) {
    //
  }
  /**
   * remove a the room from favorite list
   * @param {*} e
   */
  removeRoom = async (e) => {
    var room = e.target.attributes.getNamedItem("value").value;
    window.scrollTo(0, 0);
    console.log("room to remove: ", room);
    console.log("tag name: ", e.target.tagName);
    console.log("inner html", e.target.innerHTML);
    console.log("attributes", e.target.attributes);
    console.log("attributes", e.target.attributes.getNamedItem("value").value);
    const options = {
      labels: {
        confirmable: "Delete " + room,
        cancellable: "Cancel",
        closeOnOverlayClick: true,
      },
    };
    const result = await confirm(
      "Are you sure you want to delete this room?",
      options
    );
    if (result) {
      this.state.db.collection("rooms").doc(room).delete();
    }
  };
  /**
   * add a room into favorite list
   * @param {*} e
   */
  favoriteRoom(e) {
    const { isLoading } = this.state;
    if (isLoading == false) {
      var broom = e.target.attributes.getNamedItem("value").value;
      let brooms = broom.split(" ");
      var build = brooms[0];
      var room = brooms[1];
      var found = false;
      var done = false;
      console.log("build to favorite: ", build);
      console.log("room to favorite: ", room);
      console.log("curuser: ", curuser.email);
      console.log("user fav builds: ", curuser.favoriteBuildings);
      console.log("user fav rooms: ", curuser.favoriteRooms);

      if (curuser.favoriteRooms != null) {
        for (var j = 0; j < curuser.favoriteRooms.length; j++) {
          if (
            curuser.favoriteBuildings[j] == build &&
            curuser.favoriteRooms[j] == room
          ) {
            found = true;
            curuser.favoriteBuildings.splice(j, 1);
            curuser.favoriteRooms.splice(j, 1);
            const userRef = doc(db, "users", curuser.email);
            setDoc(
              userRef,
              {
                favbuild: curuser.favoriteBuildings,
                favroom: curuser.favoriteRooms,
              },
              { merge: true }
            );
            for (var i = 0; i < this.state.rowNum; i++) {
              if (
                this.state.rooms[i].building == build &&
                this.state.rooms[i].number == room
              ) {
                this.state.rooms[i].favorite = (
                  <button
                    className="favorite"
                    value={build + " " + room}
                    onClick={(e) => this.favoriteRoom(e)}
                  >
                    <i value={build + " " + room} class="fa fa-star"></i>
                  </button>
                );
              }
            }
            this.forceUpdate();
          }
        }
        done = true;
      }
      if (found == false && done == true) {
        curuser.favoriteBuildings.push(build);
        curuser.favoriteRooms.push(room);
        const userRef = doc(db, "users", curuser.email);
        setDoc(
          userRef,
          {
            favbuild: curuser.favoriteBuildings,
            favroom: curuser.favoriteRooms,
          },
          { merge: true }
        );
        for (var i = 0; i < this.state.rowNum; i++) {
          if (
            this.state.rooms[i].building == build &&
            this.state.rooms[i].number == room
          ) {
            this.state.rooms[i].favorite = (
              <button
                className="favorited"
                value={build + " " + room}
                onClick={(e) => this.favoriteRoom(e)}
              >
                <i value={build + " " + room} class="fa fa-star"></i>
              </button>
            );
          }
        }
        this.forceUpdate();
      }
    }

    window.localStorage.setItem("user", JSON.stringify(curuser));
  }
  /**
   * update the room infomation.
   * @param {*} info
   * @returns ret
   */
  parseRoomInfo(info) {
    var ret = [];
    if (info == null) {
      return ret;
    }

    var arr = info.replace(/ /g, "").toLowerCase().split(",");

    if (arr.indexOf("whiteboard") != -1) {
      ret.push(
        <img
          className="info-icons"
          title="This room has a whiteboard"
          width="30px"
          src="whiteboard.png"
        />
      );
    }
    if (arr.indexOf("blackboard") != -1) {
      ret.push(
        <img
          className="info-icons"
          title="This room has a blackboard"
          width="30px"
          src="blackboard.png"
        />
      );
    }
    if (arr.indexOf("projector") != -1) {
      ret.push(
        <img
          className="info-icons"
          title="This room has a projector"
          width="30px"
          src="projector.png"
        />
      );
    }
    if (arr.indexOf("tv") != -1) {
      ret.push(
        <img
          className="info-icons"
          title="This room has a TV"
          width="30px"
          src="tv.png"
        />
      );
    }
    if (arr.indexOf("power") != -1) {
      ret.push(
        <img
          className="info-icons"
          title="This room has power outlets"
          width="30px"
          src="power.png"
        />
      );
    }

    return ret;
  }

  render() {
    const { isLoading } = this.state;
    rowHeader1 = [];
    rows1 = [];
    rowHeader2 = [];
    rows2 = [];

    let id = 0;
    let rowID = `row${0}`;
    let cells = [];

    //First Part of Table displays user's favorites
    id++;

    rowID = `row${id}`;
    cells = [];

    
    if (false) {
      this.create7Header(
        cells,
        "Building",
        "Room#",
        "Capacity",
        "Info",
        "Status",
        "Favorite",
        "Remove Room",
        0
      );
    } else {
      this.create6Header(
        cells,
        "Building",
        "Room#",
        "Capacity",
        (isMobile ? "Info" : "Information"),
        "Status",
        "Favorite",
        0
      );
    }
    rowHeader1.push(
      <tr key={id} id={rowID}>
        {cells}
      </tr>
    );
    id++;

    //Adds User's favorite rooms to the table
    if (isLoading == false) {
      //only load the table after firestore data is retrieved
      for (var i = 0; i < this.state.rowNum; i++) {
        let rowID = `row${id}`;
        let cells = [];
        if (curuser.favoriteRooms != null) {
          for (var j = 0; j < curuser.favoriteRooms.length; j++) {
            if (false) {
              //rows are only created if builing and room match one from the user's favorite list
              if (
                curuser.favoriteRooms[j] == this.state.rooms[i].number &&
                curuser.favoriteBuildings[j] == this.state.rooms[i].building
              ) {
                this.state.rooms[i].favorite = (
                  <button
                    className="favorited"
                    value={
                      this.state.rooms[i].building +
                      " " +
                      this.state.rooms[i].number
                    }
                    onClick={(e) => this.favoriteRoom(e)}
                  >
                    <i
                      value={
                        this.state.rooms[i].building +
                        " " +
                        this.state.rooms[i].number
                      }
                      class="fa fa-star"
                    ></i>
                  </button>
                );
                this.create7Row(
                  cells,
                  this.state.rooms[i].building,
                  this.state.rooms[i].number,
                  this.state.rooms[i].capacity,
                  this.state.rooms[i].info,
                  this.state.rooms[i].status,
                  this.state.rooms[i].favorite,
                  this.state.rooms[i].remove,
                  //this.state.rooms[i].notifications,
                  id
                );
                rows1.push(
                  <tr key={id} id={rowID}>
                    {cells}
                  </tr>
                );
                id++;
              }
            } else {
              if (
                curuser.favoriteRooms[j] == this.state.rooms[i].number &&
                curuser.favoriteBuildings[j] == this.state.rooms[i].building
              ) {
                this.state.rooms[i].favorite = (
                  <button
                    className="favorited"
                    value={
                      this.state.rooms[i].building +
                      " " +
                      this.state.rooms[i].number
                    }
                    onClick={(e) => this.favoriteRoom(e)}
                  >
                    <i
                      value={
                        this.state.rooms[i].building +
                        " " +
                        this.state.rooms[i].number
                      }
                      class="fa fa-star"
                    ></i>
                  </button>
                );
                this.create6Row(
                  cells,
                  this.state.rooms[i].building,
                  this.state.rooms[i].number,
                  this.state.rooms[i].capacity,
                  this.state.rooms[i].info,
                  this.state.rooms[i].status,
                  this.state.rooms[i].favorite,
                  //this.state.rooms[i].notifications,
                  id
                );
                rows1.push(
                  <tr key={id} id={rowID}>
                    {cells}
                  </tr>
                );
                id++;
              }
            }
          }
        }
      }
      rowID = `row${id}`;
      cells = [];

      //Next part of table displays list of all rooms
      id++;
      rowID = `row${id}`;
      cells = [];

      if (isMobile)
      {
        document.body.style.zoom = "56%";
      }

      if (curuser.favoriteRooms == null || curuser.favoriteRooms.length == 0 ) {
        return (
          <div className="container">
            <h1>You have no favorites</h1>
          </div>
        );
      } else {
        if (isMobile) {
          return (
            <div className="container">
              <p>Icons mean:</p>
              <p>
                <img className="info-icons" width="25px" src="whiteboard.png" />
                This icon means room has a white board{" "}
              </p>

              <p>
                <img className="info-icons" width="25px" src="blackboard.png" />
                This icon means room has a blackboard{" "}
              </p>

              <p>
                <img className="info-icons" width="25px" src="projector.png" />
                This icon means room has a projector
              </p>

              <p>
                <img className="info-icons" width="25px" src="tv.png" />
                This icon means room has a TV
              </p>

              <p>
                <img className="info-icons" width="25px" src="power.png" />
                This icon means room has a power outlets
              </p>
              <table
                className="room-table"
                id="simple-table2"
                border="1"
              >
                <caption>Favorite Rooms</caption>
                <thead>{rowHeader1}</thead>
                <tbody>{rows1}</tbody>
              </table>
            </div>
          );
        } else if ( rows1.length == 0 ) {
          return (
            <div className="container">
            </div>
          );
        } else {
          return (
            <div className="container">
              <table
                className="sortable room-table"
                id="simple-table2"
                border="1"
              >
                <caption>Favorite Rooms</caption>
                <thead>{rowHeader1}</thead>
                <tbody>{rows1}</tbody>
              </table>
            </div>
          );
        }
      }
    }
    //does not render page, if rooms are not yet retrieved from firestore database.
    else {
      return null;
    }
  }

  componentDidUpdate() {
    if (document.getElementById("simple-table2") != null) {
      this.sortTableUpdate();
    }
  }
}

ReactDOM.render(
  <BrowserRouter>
    <Routes>
      <Route exact path="//*" element={<App />} />
      <Route path="/allrooms/*" element={<Allrooms />} />
      <Route path="/about" element={<About />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/passchange" element={<PassForm />} />
      <Route path="/forgotpass" element={<Forgotpass />} />
      <Route path="/termsofservice" element={<TermsOfService />} />
      <Route path="/ouprovider" element={<OUProvider />} />
      <Route path="/deleteaccount" element={<Reauth />} />
      <Route path="/ouconfirm" element={<OUConfirm />} />
    </Routes>
  </BrowserRouter>,

  document.getElementById("root") || document.createElement("div") //for jest testing
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

export {Table};
