import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import "./Signin.css";
import { useNavigate } from "react-router-dom";
import { userAuthorLoginThunk } from "../../redux/slices/UserAuthorSlice";
import { useDispatch, useSelector } from "react-redux";

function Signin() {
  let navigate = useNavigate();
  let {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  let { loginUserStatus, currentUser, errorOccured, errMsg } = useSelector(
    (state) => state.UserAuthorLoginReducer
  );
  let dispatch = useDispatch();

  function handleFormSubmit(userObj) {
    dispatch(userAuthorLoginThunk(userObj));
  }
  useEffect(() => {
    if (loginUserStatus === true) {
      if (currentUser.userType === "user") {
        navigate("/userprofile");
      } else {
        navigate(`/authorprofile`);
      }
    }
  }, [loginUserStatus]);

  return (
    <div className="hi signin">
      <div className="mx-auto p-3 login-div rounded">
        <h1 className="display-3 p-2">Signin</h1>
        <form className="form" onSubmit={handleSubmit(handleFormSubmit)}>
          {errorOccured === true && <p className="text-danger">{errMsg}</p>}
          {/* radio buttons */}
          <div
            className="form-group mb-3"
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: "large",
            }}
          >
            <div style={{ marginRight: "10px" }}>
              <label>
                <input
                  type="radio"
                  name="userType"
                  value="user"
                  {...register("userType", { required: true })}
                />{" "}
                User
              </label>
            </div>
            <div style={{ marginRight: "10px" }}>
              <label>
                <input
                  type="radio"
                  name="userType"
                  value="author"
                  {...register("userType", { required: true })}
                />{" "}
                Author
              </label>
            </div>
            {/* <div>
              <label>
                <input
                  type="radio"
                  name="userType"
                  value="admin"
                  {...register("userType", { required: true })}
                />{" "}
                Admin
              </label>
            </div> */}
            {errors.userType && (
              <p className="text-danger">Please select user type</p>
            )}
          </div>

          {/* Username */}
          <div className="form-group mb-3">
            <input
              type="text"
              name="username"
              id="username"
              className="form-control siginin-input"
              placeholder="Your name"
              {...register("username", { required: true })}
            />
            {errors.username?.type === "required" && (
              <p className="text-danger">Enter Username</p>
            )}
          </div>

          {/* Password */}
          <div className="form-group mb-3">
            <input
              type="password"
              name="password"
              id="password"
              className="form-control siginin-input"
              placeholder="Password"
              {...register("password", { required: true })}
            />
            {errors.password?.type === "required" && (
              <p className="text-danger">Enter Password</p>
            )}
          </div>

          <button className="rounded button" type="submit">
            Signin
          </button>
        </form>
      </div>
    </div>
  );
}

export default Signin;
