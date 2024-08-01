import React from "react";
import { NavLink } from "react-router-dom";
import { Outlet } from "react-router-dom";
import Header from "../Header/Header";
import "./AuthorProfile.css";

function AuthorProfile() {
  return (
    <div>
      <Header />
      <ul className="nav d-flex justify-content-center auth-prof">
        <li className="li">
          <NavLink
            to="/authorprofile/articles-by-author/:author"
            className="nav-link my-nav-link"
          >
            Articles
          </NavLink>
        </li>
        <li className="li">
          <NavLink
            to="/authorprofile/addnewarticle"
            className="nav-link my-nav-link"
          >
            Add New Article
          </NavLink>
        </li>
      </ul>
      <div style={{ minHeight: "100vh" }}>
        <Outlet />
      </div>
    </div>
  );
}

export default AuthorProfile;
