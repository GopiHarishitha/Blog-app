import React, { useState } from "react";
import "./Article.css";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { FcClock } from "react-icons/fc";
import { CiEdit } from "react-icons/ci";
import { MdDelete } from "react-icons/md";
import { FcCalendar } from "react-icons/fc";
import { MdRestore } from "react-icons/md";
import axios from "axios";

function Article() {
  const { register: registerEdit, handleSubmit: handleSubmitEdit } = useForm();
  const { register: registerComment, handleSubmit: handleSubmitComment } =
    useForm();
  let { err, setErr } = useState("");
  let { state } = useLocation();
  let { currentUser } = useSelector((state) => state.UserAuthorLoginReducer);
  let token = localStorage.getItem("token");
  let [comment, setComment] = useState("");
  let [articleEditStatus, setArticleEditStatus] = useState(false);
  let [articleDeletedStatus, setArticleDeletedStatus] = useState(false);
  let [currentArticle, setCurrentArticle] = useState(state || {});
  let navigate = useNavigate();

  const axiosWithToken = axios.create({
    headers: { Authorization: `Bearer ${token}` },
  });

  // write or add comment to an article by user
  async function writeComment(commentObj) {
    console.log("from Article.js", state);
    console.log(commentObj);
    try {
      commentObj.username = currentUser.username;
      console.log("comment is", commentObj);
      let res = await axiosWithToken.post(
        `http://localhost:4000/user-api/comment/${state.articleId}`,
        commentObj
      );
      if (res.data.message === "comment added") {
        setComment(commentObj.comment);
      }
    } catch (err) {
      console.log("error in writeComment", err);
    }
  }

  const enableEditState = () => {
    setArticleEditStatus(true);
    // let art = { ...currentArticle };
    // delete art._id;
    // let res = await axiosWithToken.put(
    //   `http://localhost:4000/author-api/article/${currentArticle.articleId}`,
    //   art
    // );
    // console.log(res);
    // if (res.data.message === "article deleted") {
    //   setCurrentArticle({ ...currentArticle, status: res.data.payload });
    //   setArticleDeletedStatus(false);
    // }
  };

  const saveModifiedArticle = async (editedArticle) => {
    let modifiedArticle = { ...state, ...editedArticle };
    // change date of modification
    modifiedArticle.dateOfModification = new Date();
    // remove id
    delete modifiedArticle._id;
    console.log(modifiedArticle);
    // make HTTP req to save modified article in database
    let res = await axiosWithToken.put(
      "http://localhost:4000/author-api/article",
      modifiedArticle
    );
    if (res.data.message === "article modified") {
      setArticleEditStatus(false);
      navigate(`/authorprofile/article/${modifiedArticle.articleId}`, {
        state: res.data.article,
      });
    }
  };

  const deleteArticle = async () => {
    let art = { ...currentArticle };
    delete art._id;
    let res = await axiosWithToken.put(
      `http://localhost:4000/author-api/article/${currentArticle.articleId}`,
      art
    );
    if (res.data.message === "article deleted") {
      setCurrentArticle({ ...currentArticle, status: res.data.payload });
    }
  };

  const restoreArticle = async () => {
    let art = { ...currentArticle };
    delete art._id;
    let res = await axiosWithToken.put(
      `http://localhost:4000/author-api/article/${currentArticle.articleId}`,
      art
    );
    if (res.data.message === "article restored") {
      setCurrentArticle({ ...currentArticle, status: res.data.payload });
    }
  };

  return (
    <div className="article m-5">
      {articleEditStatus === false ? (
        <div>
          <div className="card shadow p-4 pt-4">
            <div className="d-flex justify-content-between p-4">
              <div>
                <p className="display-3 me-4 p-2">{currentArticle.title}</p>
                <span className="py-3">
                  <small className=" text-secondary me-4">
                    <FcCalendar className="fs-4" />
                    Created on:{currentArticle.dateOfCreation}
                  </small>
                  <small className=" text-secondary">
                    <FcClock className="fs-4" />
                    Modified on: {currentArticle.dateOfModification}
                  </small>
                </span>
              </div>
              <div>
                {currentUser.userType === "author" && (
                  <div className="d-flex justify-content-around">
                    <button
                      className="me-2 btn-warning"
                      onClick={enableEditState}
                    >
                      <CiEdit className="fs-2" />
                    </button>
                    {currentArticle.status === true ? (
                      <button
                        className="me-2 btn-danger"
                        onClick={deleteArticle}
                      >
                        <MdDelete className="fs-2" />
                      </button>
                    ) : (
                      <button
                        className="me-2 btn-info"
                        onClick={restoreArticle}
                      >
                        <MdRestore className="fs-2" />
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
            <h4 className="pl-3">{currentArticle.category}</h4>
            <p className="card-body" style={{ whiteSpace: "pre-line" }}>
              {currentArticle.content}
            </p>
            {currentUser.userType === "user" && (
              <div className="comment w-100">
                <form
                  onSubmit={handleSubmitComment(writeComment)}
                  className="row"
                >
                  <input
                    type="text"
                    className="comment-input col-10"
                    placeholder="Add a comment..."
                    {...registerComment("comment", { required: true })}
                  />
                  <button className="cmt-button rounded col-1" type="submit">
                    Post
                  </button>
                </form>
              </div>
            )}
          </div>

          {comment.length !== 0 && (
            <div className="card p-2 m-2">
              <p className="lead">{currentUser.username}</p>
              <p className="lead">{comment}</p>
            </div>
          )}

          {/* read existing comments */}
          {currentArticle.comments && currentArticle.comments.length == 0 ? (
            <h1 className="pt-4">No comments yet</h1>
          ) : (
            <div>
              {currentArticle.comments.map((comment) => (
                <div className="card pt-1">
                  <h3 className="lead px-3 pt-2">{comment.username}</h3>
                  <p className="lead px-4">{comment.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="add-div">
          <form
            onSubmit={handleSubmitEdit(saveModifiedArticle)}
            className="add-div2"
          >
            <input
              type="text"
              className="input"
              placeholder="Title of the Article"
              defaultValue={currentArticle.title}
              {...registerEdit("title", { required: true })}
            />
            <select
              className="input"
              defaultValue={currentArticle.category}
              {...registerEdit("category", { required: true })}
            >
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
              defaultValue={currentArticle.content}
              {...registerEdit("content", { required: true })}
            />
            {err?.length !== 0 && <p className="text-danger fs-3">{err}</p>}
            <button className="button m-4 p-3 post" type="submit">
              Save
            </button>
          </form>
        </div>
      )}  
    </div>
  );
}

export default Article;
