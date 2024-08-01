import React from "react";
import { NavLink } from "react-router-dom";
import "./Header.css";
import { useDispatch, useSelector } from "react-redux";
import { resetState } from "../../redux/slices/UserAuthorSlice";

function Header() {
  let { loginUserStatus, currentUser } = useSelector(
    (state) => state.UserAuthorLoginReducer
  );

  const dispatch = useDispatch();

  function signOut() {
    // remove token from local storage
    localStorage.removeItem("token");
    dispatch(resetState());
  }
  return (
    <div className="nav-bar p-3 fs-3">
      <div className="d-flex justify-content-between align-items-center container">
        <div className="logo">
          <img
            src="https://logo.com/image-cdn/images/kts928pd/production/d12dfdbd6b7501faf694ac42775f19451aee8805-324x328.png?w=1080&q=72"
            alt="logo"
            width="90"
            height="90"
          />
        </div>
        <ul className="nav justify-content-around w-50">
          {loginUserStatus === false ? (
            <>
              <li className="nav-item rounded">
                <NavLink className="nav-link" to="home">
                  Home
                </NavLink>
              </li>
              <li className="nav-item rounded">
                <NavLink className="nav-link" to="signin">
                  Signin
                </NavLink>
              </li>
              <li className="nav-item rounded">
                <NavLink className="nav-link" to="signup">
                  Signup
                </NavLink>
              </li>
            </>
          ) : (
            <>
              <h3 className="nav-item">Welcome {currentUser.username}</h3>
              <li className="nav-item rounded">
                <NavLink
                  className="nav-link signout"
                  to="/signin"
                  onClick={signOut}
                >
                  Sign Out
                </NavLink>
              </li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
}

export default Header;
