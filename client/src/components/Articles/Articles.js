import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Articles() {
  let [articles, setArticles] = useState([]);
  let navigate = useNavigate();
  let token = localStorage.getItem("token");

  const axiosWithToken = axios.create({
    headers: { Authorization: `Bearer ${token}` },
  });

  const getAllArticles = async () => {
    let res = await axiosWithToken.get(
      "http://localhost:4000/user-api/articles"
    );
    console.log(
      "response in getAllArticles",
      res,
      res.data.message,
      res.data.payload
    );
    setArticles(res.data.payload);

    console.log(articles);
  };

  const readArticleByArticleId = (articleobj) => {
    console.log(articleobj)
    navigate(`/userprofile/article/${articleobj.articleId}`, {
      state: articleobj,
    });
  };

  useEffect(() => {
    getAllArticles();
  }, []);

  return (
    <div>
      <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4 mt-5">
        {articles.map((article) => (
          <div className="col" key={article.articleId}>
            <div className="card shadow h-100">
              <div className="card-body">
                <h3>{article.title}</h3>
                <h4>{article.category}</h4>
                <p style={{ whiteSpace: "pre-line" }}>
                  {article.content.substring(0, 80) + "..."}
                </p>
                <button
                  className="button"
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
    </div>
  );
}

export default Articles;
