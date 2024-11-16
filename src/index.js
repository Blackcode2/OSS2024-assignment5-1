import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import Header from "./components/Header";
import Crud from "./components/Crud";

const myCompponent = (
  <div className="App">
    <Header />
    <Crud />
  </div>
);
const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(myCompponent);
