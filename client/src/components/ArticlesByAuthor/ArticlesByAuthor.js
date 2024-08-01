import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function ArticlesByAuthor() {
  let { currentUser } = useSelector((state) => state.UserAuthorLoginReducer);
  let [articlesList, setArticlesList] = useState([]);
  let token = localStorage.getItem("token");
  let navigate = useNavigate();

  const axiosWithToken = axios.create({
    headers: { Authorization: `Bearer ${token}` },
  });

  const getArticlesByCurrentAuthor = async () => {
    try {
      let res = await axiosWithToken.get(
        `http://localhost:4000/author-api/articles/${currentUser.username}`
      );
      console.log(res);
      setArticlesList(res.data.payload);
    } catch (err) {
      console.log("error in fetching the articles", err);
    }
  };
  useEffect(() => {
    getArticlesByCurrentAuthor();
  }, []);

  function readArticleByArticleId(article) {
    navigate(`../article/${article.articleId}`, { state: article });
  }

  return (
    <div className="p-3">
      {articlesList?.length === 0 ? (
        <h2 className="text-center">
          It seems you haven't created any articles.
          <br />
          Start doing it now.
        </h2>
      ) : (
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4 mt-5">
          {articlesList.map((article) => (
            <div className="col" key={article.articleId}>
              <div className="card shadow h-100">
                <div className="card-body">
                  <h5 className="card-title">{article.title}</h5>
                  <p className="card-text">
                    {article.content.substring(0, 80) + "..."}
                  </p>
                  <button
                    className="button btn-4"
                    onClick={() => readArticleByArticleId(article)}
                  >
                    Read more
                  </button>
                </div>
                <div className="card-footer">
                  <small className="text-body-secondary">
                    Last updated on {article.dateOfModification}
                  </small>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ArticlesByAuthor;
