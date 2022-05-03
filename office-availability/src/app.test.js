import {
  deleteAccount,
  deleteAccountConfirm,
  themeToggler,
} from "./settings.js";

it("deleteAccount", () => {
  expect(deleteAccount).toBeCalled;
});

it("deleteAccountConfirm", () => {
  expect(deleteAccountConfirm).toBeCalled;
});

it("themeToggler", () => {
  expect(themeToggler).toBeCalled;
});

const App = require("./App.js").default;
it("App", () => {
  expect(App).toBeCalled;
  expect(App).toHaveReturned;
});

const Allrooms = require("./Allrooms.js").default;
it("Allrooms", () => {
  expect(Allrooms).toBeCalled;
  expect(Allrooms).toHaveReturned;
  expect(Allrooms).toBeNull;
});

import { handleLogout, reportWebVitals } from "./Allrooms.js";
it("handleLogout", () => {
  expect(handleLogout).toBeCalled;
});

it("reportWebVitals", () => {
  expect(reportWebVitals).toBeCalled;
});

const Forgotpass = require("./forgotpass.js").default;
it("Forgotpass", () => {
  expect(Forgotpass).toBeCalled;
  expect(Forgotpass).toHaveReturned;
});

const Table = require("./index.js").default;
it("Table", () => {
  expect(Table).toBeCalled;
  expect(Table).toHaveReturned;
  expect(Table).toBeNull;
});

const About = require("./about.js").default;
it("About", () => {
  expect(About()).toStrictEqual(<div>
    <Hero />
    <div class="about">
      <p>
        This is a student project being worked on by the group Programming
        Paladins. Its goal is to create a website, iOS, and Android app that
        Ohio University students can use to find available study rooms. It
        will use sensors installed in various study rooms to determine if they
        are occupied or not and display that information on the website and
        mobile apps.
      </p>
      <ul>
        <li>Team Leader: Alex Neargarder - an435818@ohio.edu</li>
        <li>Documentation Manager: Fadi Alrabadi - fa979119@ohio.edu</li>
        <li>Release Manger: Zelin Zhang - zz125016@ohio.edu</li>
        <li>Quality Assurance Manager: Noah Glazier - ng190817@ohio.edu</li>
      </ul>
    </div>
  </div>);
});

const PassForm = require("./passwordform.js").default;
it("PassForm", () => {
  expect(PassForm).toBeCalled;
  expect(PassForm).toHaveReturned;
});

const Login = require("./Login.js").default;
it("Login", () => {
  expect(Login).toBeCalled;
  expect(Login).toHaveReturned;
});

const Hero = require("./Hero.js").default;
it("Hero", () => {
  expect(Hero).toBeCalled;
  expect(Hero).toHaveReturned;
});
