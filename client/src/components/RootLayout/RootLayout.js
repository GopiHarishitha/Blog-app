import React from "react";
import { Outlet } from "react-router-dom";
import "./RootLayout.css";
import Footer from "../Footer/Footer";
import "./RootLayout.css";
import Header from "../Header/Header";

function RootLayout() {
  return (
    <div className="rootlayout">
      <Header />
      <div style={{ minHeight: "80vh" }} className="outlet">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}

export default RootLayout;
