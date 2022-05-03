/* eslint-disable */
import React from "react";
import ReactDOM from "react-dom";
import fire, { provider, db, onMessageListener } from "./fire";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import Room from "./Room.js";
import { confirm } from "react-confirm-box";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import User from "./User.js";
import {
  getAdditionalUserInfo,
  getAuth,
  onAuthStateChanged,
} from "firebase/auth";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  setDoc,
} from "firebase/firestore";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import About from "./about.js";
import Hero from "./Hero";
import toast, { Toaster } from "react-hot-toast";
import { isMobile } from "react-device-detect";
import Fuse from "fuse.js";
import Outer from "./editroom.js";
import ReactDOMServer from "react-dom/server";

let rowHeader1 = [];
let rows1 = [];
//let title2 = []
let rowHeader2 = [];
let rows2 = [];
let curuser = new User();
let currentTheme = "light";

const handleLogout = () => {
  fire.auth().signOut();
};

class Allrooms extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rooms: [],
      rowNum: 0,
      colNum: 4,
      allrooms: [],
      allroomsNum: 0,
      db: firebase.firestore(),
      isLoading: false, //used to not render page, until data is retrieved from firestore.
      search: "",
    };


    currentTheme = JSON.parse(window.localStorage.getItem("theme"));

    // Load rooms from firestore database here
    if (this.state.search == "") {
      const roomsRef = collection(db, "rooms");
      const q = query(roomsRef);

      this.state.db.collection("rooms").onSnapshot((snapshot) => {
        var addedRooms = false;

        snapshot.docChanges().forEach((change) => {
          var doc = change.doc;
          if (change.type === "added") {
            addedRooms = true;

            var info = " ";
            if (doc.data().Info != null) {
              info = doc.data().Info;
            }

            var infoparsed = this.parseRoomInfo(info);
            var favoriteButton = this.createFavoriteButton(doc.data().Building, doc.data().Room, false);

            var addedRoom = new Room(
              doc.data().Building,
              doc.data().Room,
              doc.data().Capacity,
              infoparsed,
              doc.data().Status,
              favoriteButton,
              <Outer value={doc.data().Building + " " + doc.data().Room} />,
              (
                <button
                  className="notifications"
                  value={doc.data().Building + " " + doc.data().Room}
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
            );
            this.state.allrooms.push(addedRoom);
            this.state.rooms.push(addedRoom);

            ++this.state.rowNum;
            ++this.state.allroomsNum;
          }
          if (change.type === "modified") {
            for (var i = 0; i < this.state.allrooms.length; ++i) {
              if (
                this.state.allrooms[i].building == doc.data().Building &&
                this.state.allrooms[i].number == doc.data().Room
              ) {
                this.state.allrooms[i].capacity = doc.data().Capacity;
                this.state.allrooms[i].info = this.parseRoomInfo(
                  doc.data().Info
                );
                this.state.allrooms[i].status = doc.data().Status;
              }
            }
            this.forceUpdate();
          }
          if (change.type === "removed") {
            // Manually delete room to avoid refreshing page
            var roomRow = this.findRowByRoom(
              doc.data().Room,
              doc.data().Building
            );

            roomRow.parentNode.removeChild(roomRow);
          }
        });
        if (addedRooms) {
          this.forceUpdate();
        }
      });
    }
    //read in user data (accounts for page refreshes)
    curuser = JSON.parse(window.localStorage.getItem("user"));
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

  notifyme(e) {
    //
  }

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
    table = document.getElementById("simple-table1");
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
    var e = document.getElementById("simple-table1").rows[0].children[n];

    var table,
      rows,
      switching,
      i,
      x,
      y,
      shouldSwitch,
      dir,
      switchcount = 0;
    table = document.getElementById("simple-table1");
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

  findRowByRoom(room, building) {
    var rows = document.getElementsByTagName("tr");
    for (var i = 0; i < rows.length; ++i) {
      if (
        rows[i].children[0].innerText == building &&
        rows[i].children[1].innerText == room
      ) {
        return rows[i];
      }
    }
  }

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
                  this.createFavoriteButton(this.state.rooms[i].building, this.state.rooms[i].number, false)
                );
              }
            }

            // Manually update the classname to avoid refreshing page
            //var roomRow = this.findRowByRoom(room, build);
            //roomRow.children[5].children[0].className = "favorite";
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
              this.createFavoriteButton(build, room, true)
            );
          }
        }

        // Manually update the classname to avoid refreshing page
        //var roomRow = this.findRowByRoom(room, build);
        //roomRow.children[5].children[0].className = "favorited";
        this.forceUpdate();
      }
    }

    window.localStorage.setItem("user", JSON.stringify(curuser));
  }

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

  createFavoriteButton(building, room, favorited)
  {
    var star, coloring;
    if (currentTheme === "light")
    {
      coloring = "#024230"
    }
    else
    {
      coloring = "white"
    }
    if (favorited)
    {
      star = "fa fa-star"
      coloring = "yellow"
    }
    else
    {
      star = "fa fa-star-o"
    }

    return (
      <button
        className="favorite"
        style={{ color: coloring }}
        value={building + " " + room}
        onClick={(e) => this.favoriteRoom(e)}
      >
        <i value={building + " " + room} className={star}></i>
      </button>
    )
  }

  async updateSearchValue(evt) {
    const val = evt.target.value;
    let result = [];
    this.setState(
      {
        search: val,
        rooms: this.state.allrooms,
      },
      function () {
        //console.log(this.state.search);

        const fuse = new Fuse(this.state.rooms, {
          keys: ["building", "number"],
          threshold: 0.3,
        });
        if (this.state.search != "") {
          for (var i = 0; i < fuse.search(this.state.search).length; i++) {
            result.push(fuse.search(this.state.search)[i].item);
          }
          //console.log(this.state.rooms);
          //console.log(fuse.search(this.state.search).item);
          this.setState({
            rooms: result,
            rowNum: result.length,
          });
        } else {
          this.setState({
            rooms: this.state.allrooms,
            rowNum: this.state.allroomsNum,
          });
        }
      }
    );
  }

  render() {
    // If user is not logged in, redirect to homepage
    if (curuser == null) {
      console.log("user not logged in");
      return <Navigate to="/" />;
    }
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

    // if (curuser.admin) {
    //   this.create8Header(
    //     cells,
    //     "Building",
    //     "Room#",
    //     "Capacity",
    //     "Info",
    //     "Status",
    //     "Favorite",
    //     "Remove Room",
    //     "Notifications",
    //     0
    //   );
    // } else {
    //   this.create7Header(
    //     cells,
    //     "Building",
    //     "Room#",
    //     "Capacity",
    //     "Info",
    //     "Status",
    //     "Favorite",
    //     "Notifications",
    //     0
    //   );
    // }

    rowHeader1.push(
      <tr key={id} id={rowID}>
        {cells}
      </tr>
    );
    id++;

    //Adds User's favorite rooms to the table
    if (
      (isLoading == false && curuser.signedInWithEmailLink) ||
      (isLoading == false && curuser.provider != "google.com")
    ) {
      //only load the table after firestore data is retrieved
      for (var i = 0; i < this.state.rowNum; i++) {
        let rowID = `row${id}`;
        let cells = [];
        if (curuser.favoriteRooms != null) {
          for (var j = 0; j < curuser.favoriteRooms.length; j++) {
            if (curuser.admin) {
              //rows are only created if builing and room match one from the user's favorite list
              if (
                curuser.favoriteRooms[j] == this.state.rooms[i].number &&
                curuser.favoriteBuildings[j] == this.state.rooms[i].building
              ) {
                this.state.rooms[i].favorite = (
                  this.createFavoriteButton(this.state.rooms[i].building, this.state.rooms[i].number, true)
                );
                this.create8Row(
                  cells,
                  this.state.rooms[i].building,
                  this.state.rooms[i].number,
                  this.state.rooms[i].capacity,
                  this.state.rooms[i].info,
                  this.state.rooms[i].status,
                  this.state.rooms[i].favorite,
                  this.state.rooms[i].remove,
                  this.state.rooms[i].notifications,
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
                  this.createFavoriteButton(this.state.rooms[i].building, this.state.rooms[i].number, true)
                );
                this.create7Row(
                  cells,
                  this.state.rooms[i].building,
                  this.state.rooms[i].number,
                  this.state.rooms[i].capacity,
                  this.state.rooms[i].info,
                  this.state.rooms[i].status,
                  this.state.rooms[i].favorite,
                  this.state.rooms[i].notifications,
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

      // Check if user is admin
      if (curuser.admin) {
        this.create7Header(
          cells,
          "Building",
          "Room#",
          "Capacity",
          (isMobile ? "Info" : "Information"),
          "Status",
          "Favorite",
          "Edit Room",
          //"Notifications",
          id
        );
        rowHeader2.push(
          <tr key={id} id={rowID}>
            {cells}
          </tr>
        );
        id++;

        //Create table rows for all rooms
        for (i = 0; i < this.state.rowNum; i++, id++) {
          let rowID = `row${id}`;
          let cells = [];

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

          rows2.push(
            <tr key={id} id={rowID}>
              {cells}
            </tr>
          );
        }
      } else {
        this.create6Header(
          cells,
          "Building",
          "Room#",
          "Capacity",
          (isMobile ? "Info" : "Information"),
          "Status",
          "Favorite",
          //"Notifications",
          id
        );
        rowHeader2.push(
          <tr key={id} id={rowID}>
            {cells}
          </tr>
        );
        id++;

        //Create table rows for all rooms
        for (i = 0; i < this.state.rowNum; i++, id++) {
          let rowID = `row${id}`;
          let cells = [];
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
          rows2.push(
            <tr key={id} id={rowID}>
              {cells}
            </tr>
          );
        }
      }
      if (isMobile) {
        if (curuser.admin) {
          document.body.style.zoom = "40%";
        } else {
          document.body.style.zoom = "56%";
        }
        return (
          <div className="container">
            <Hero />
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
            <table className="sortable room-table">
            <caption>All Rooms</caption>
            </table>
            <input
              placeholder="Search for a building or room number"
              className="search"
              id="searchbar"
              defaultValue={this.state.inputValue}
              onBlur={(evt) => this.updateSearchValue(evt)}
            />
            <table
              className="room-table"
              id="simple-table1"
              border="1"
            >
              <thead>{rowHeader2}</thead>
              <tbody>{rows2}</tbody>
            </table>
          </div>
        );
      } else {
        return (
          <div className="container">
            <Hero />
            <table className="sortable room-table">
            <caption>All Rooms</caption>
            </table>
            <input
              placeholder="Search for a building or room number"
              className="search"
              id="searchbar"
              value={this.state.inputValue}
              onChange={(evt) => this.updateSearchValue(evt)}
            />
            <table
              className="sortable room-table"
              id="simple-table1"
              border="1"
            >
              <thead>{rowHeader2}</thead>
              <tbody>{rows2}</tbody>
            </table>
          </div>
        );
      }
    }
    //does not render page, if rooms are not yet retrieved from firestore database.
    else {
      // Return the header while page is loading so that the whole page doesn't flash in
      return <Hero />;
    }
  }

  componentDidUpdate() {
    if (document.getElementById("simple-table1") != null) {
      console.log("updating")
      this.sortTableUpdate();
    }
  }
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
export { handleLogout, reportWebVitals };
export default Allrooms;
