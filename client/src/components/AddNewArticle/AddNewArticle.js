import React, { useState } from "react";
import "./AddNewArticle.css";
import { set, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";

function AddNewArticle() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  let { loginUserStatus, currentUser } = useSelector(
    (state) => state.UserAuthorLoginReducer
  );
  let navigate = useNavigate();
  let [err, setErr] = useState("");
  let token = localStorage.getItem("token");

  // create axois with token
  const axiosWithToken = axios.create({
    headers: { Authorization: `Bearer ${token}` },
  });

  const handleFormSubmit = async (article) => {
    article.articleId = Date.now(); // returns the timestamp
    article.dateOfCreation = new Date();
    article.dateOfModification = new Date();
    article.username = currentUser.username;
    article.comments = [];
    article.status = true;
    // make HTTP post requsest
    let res = await axiosWithToken.post(
      "http://localhost:4000/author-api/article",
      article
    );
    if (res.data.message === "new article created") {
      navigate(`/authorprofile/articles-by-author/${currentUser.username}`);
    } else {
      console.log(res);
      setErr(res.data.message);
    }
  };

  return (
    <div className="add-div">
      <form onSubmit={handleSubmit(handleFormSubmit)} className="add-div2">
        <input
          type="text"
          className="input"
          placeholder="Title of the Article"
          {...register("title", { required: true })}
        />
        <select className="input" {...register("category", { required: true })}>
          <option value="">Select Category</option>
          <option value="programming">Programming</option>
          <option value="webdevlopment">Web Development</option>
          <option value="gamedevelopment">Game Development</option>
        </select>
        <textarea
          id="textarea"
          className="rounded"
          rows="5"
          placeholder="Your Article goes on..."
          {...register("content", { required: true })}
        />
        {err.length != 0 && <p className="text-danger fs-3">{err}</p>}
        <button className="button m-4 p-3 post" type="submit">
          Post
        </button>
      </form>
    </div>
  );
}

export default AddNewArticle;
