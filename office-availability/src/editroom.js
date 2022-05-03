import React, { useState, useEffect } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import { confirm } from "react-confirm-box";

function Outer(props) {
  var [open, setOpen] = useState(false);

  var editroomsbutton = document.getElementsByClassName(props.value)[0];
  var editroomspencil = document.getElementsByClassName(props.value + " fa fa-pencil")[0];

    window.addEventListener("click", function(event) {
        if (event.target == editroomsbutton || event.target == editroomspencil || event.target.matches('.editdropdown, .editdropdown label, .editdropdown div, .editdropdown input, .editdropdown img')) {
            if(open == true){;
                open = true;
            }else{
                open = true;
            }
        }else{
            if(open == true){
                open = false;
                setOpen(false);
            }
        }
    });

  function AddRoom(props) {
    var currentTheme = JSON.parse(window.localStorage.getItem("theme"));
    return (
      <div title="Edit Room" className="edit-dropdown-buttons">
        <button
          style={{ color: (currentTheme == "light" ? "" : "white"), backgroundColor: "transparent"}}
          id={props.value + " editroom"}
          className={props.value}
          onClick={() => setOpen(!open)}
        >
          <i class={props.value + " fa fa-pencil"} aria-hidden="true"></i>
        </button>
        {open && props.children}
      </div>
    );
  }

  function DropdownItem(props) {
    return <div className="dropdown-menu-item">{props.children}</div>;
  }

  function DropDownMenu(props) {
    const [building, setBuilding] = useState("");
    const [room, setRoom] = useState("");
    const [capacity, setCapacity] = useState("");
    const [info, setInfo] = useState("");
    const [whiteboard, setWhiteboard] = useState(false);
    const [blackboard, setBlackboard] = useState(false);
    const [projector, setProjector] = useState(false);
    const [tv, setTv] = useState(false);
    const [power, setPower] = useState(false);
    const [loaded, setLoaded] = useState("");
    const [status, setStatus] = useState("");
    const db = firebase.firestore();

    if (loaded == "") {
      db.collection("rooms")
        .doc(props.value)
        .get()
        .then((doc) => {
          if (doc.exists) {
            setBuilding(doc.data().Building);
            setRoom(doc.data().Room);
            setCapacity(doc.data().Capacity);
            setInfo(doc.data().Info);

            var arr = doc
              .data()
              .Info.replace(/ /g, "")
              .toLowerCase()
              .split(",");
            if (arr.indexOf("whiteboard") != -1) {
              setWhiteboard(true);
            }
            if (arr.indexOf("blackboard") != -1) {
              setBlackboard(true);
            }
            if (arr.indexOf("projector") != -1) {
              setProjector(true);
            }
            if (arr.indexOf("tv") != -1) {
              setTv(true);
            }
            if (arr.indexOf("power") != -1) {
              setPower(true);
            }

            setStatus(doc.data().Status);
            setLoaded("done");
          } else {
            console.log("DOESN'T EXIST: " + props.value);
          }
        });
    }

    function handleUpdateRoom() {
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
          Status: status,
        });
      setOpen(!open);
    }

    function handleCloseRoom() {
      db.collection("rooms")
        .doc(building + " " + room)
        .set({
          Building: building,
          Room: room,
          Info: info,
          Capacity: capacity,
          Status: status == "Closed" ? "Available" : "Closed",
        });
      setOpen(!open);
    }

    function handleDeleteRoom() {
      db.collection("rooms").doc(props.value).delete();
      setOpen(!open);
    }

    var button = document.getElementById(props.value + " editroom");

    var rect = button.getBoundingClientRect();

    return (
      <div
        className="editdropdown"
        style={{
          top: rect.top + 40 + window.scrollY,
          left: rect.left + window.scrollX,
        }}
      >
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
          <button className="settingsbtn" onClick={handleUpdateRoom}>Apply Changes</button>
        </DropdownItem>
        <DropdownItem>
          <button className="settingsbtn" onClick={handleCloseRoom}>Open / Close Room</button>
        </DropdownItem>
        <DropdownItem>
          <button className="settingsbtn" onClick={handleDeleteRoom}>Delete Room</button>
        </DropdownItem>
      </div>
    );
  }

  return (
    <AddRoom value={props.value}>
      <DropDownMenu value={props.value} />
    </AddRoom>
  );
}

export default Outer;
