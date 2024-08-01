import React, { useState } from "react";
import { useForm } from "react-hook-form";
import "./Signup.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Signup() {
  let navigate = useNavigate();
  let {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  let [err, setErr] = useState("");
  async function handleFormSubmit(userObj) {
    // console.log(userObj);
    // make http post request
    if(userObj.userType==='user'){
      let res = await axios.post("http://localhost:4000/user-api/user", userObj);
      console.log(res);
      console.log(res.data.message);
      if (res.data.message === "user created") {
        //navigate to login
        navigate("/signin");
      } else {
        setErr(res.data.message);
      }
    }else if(userObj.userType==='author'){
      let res = await axios.post("http://localhost:4000/author-api/new-author",userObj)
      if(res.data.message==='author created'){
        navigate('/signin')
      }else{
        setErr(res.data.message)
      }
    }
  }
  return (
    <div className="for-image">
      <div className="hi signup p-3">
        <div className="p-3 mx-auto signup-div rounded m-4">
          <h1 className="login-heading display-3">Sign Up</h1>

          {/* Display user signup error message */}
          {err.length !== 0 && <p className="text-danger fs-3">{err}</p>}

          <form className="form" onSubmit={handleSubmit(handleFormSubmit)}>
            {/* Radio buttons */}
            <div
              className="form-group mb-3"
              style={{ display: "flex", justifyContent: "space-between" }}
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
              <div>
                <label>
                  <input
                    type="radio"
                    name="userType"
                    value="admin"
                    {...register("userType", { required: true })}
                  />{" "}
                  Admin
                </label>
              </div>
              {errors.userType && (
                <p className="text-danger">Please select user type</p>
              )}
            </div>

            {/* Username */}
            <div className="form-group">
              <label className="form-label" htmlFor="username">
                Username
              </label>
              <input
                type="text"
                name="username"
                id="username"
                className="form-control"
                {...register("username", { required: true })}
              />
              {errors.username?.type === "password" && (
                <p className="text-danger">Enter Username</p>
              )}
            </div>

            {/* Password */}
            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                type="password"
                name="password"
                id="password"
                className="form-control"
                {...register("password", { required: true })}
              />
            </div>

            {/* email */}
            <div className="form-group mb-3">
              <label className="form-label" htmlFor="email">
                Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                className="form-control"
                {...register("email", { required: true })}
              />
            </div>

            <button className="button rounded">Sign Up</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Signup;
