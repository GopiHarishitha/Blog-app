import React from "react";
import "./UserProfile.css";
import { useSelector } from "react-redux";
import Header from "../Header/Header";
import { Outlet } from "react-router-dom";
import { NavLink } from "react-router-dom";
import "./UserProfile.css";

function UserProfile() {
  let { currentUser } = useSelector((state) => state.UserAuthorLoginReducer);
  console.log(currentUser);
  return (
    <div className="user-profile">
      <Header />
      <NavLink to="articles" className="fs-4 nav-link center userprof">
        Articles
      </NavLink>
      <div style={{ minHeight: "100vh" }}>
        <Outlet />
      </div>
    </div>
  );
}

export default UserProfile;
