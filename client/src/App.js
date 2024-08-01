import "./App.css";
import { lazy, Suspense } from "react";
import RootLayout from "./components/RootLayout/RootLayout";
import Signin from "./components/Signin/Signin";
import Signup from "./components/Signup/Signup";
import Home from "./components/Home/Home";
import AddNewArticle from "./components/AddNewArticle/AddNewArticle";
import Article from "./components/Article/Article";
import ArticlesByAuthor from "./components/ArticlesByAuthor/ArticlesByAuthor";
import ErrorElement from "./components/ErrorElement/ErrorElement";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";

// Dynamic import of articles
const Articles = lazy(() => import("./components/Articles/Articles"));
const UserProfile = lazy(() => import("./components/UserProfile/UserProfile"));
const AuthorProfile = lazy(() =>
  import("./components/AuthorProfile/AuthorProfile")
);

function App() {
  let router = createBrowserRouter([
    {
      path: "/",
      element: <RootLayout />,
      errorElement: <ErrorElement />,
      children: [
        {
          path: "/home",
          element: <Home />,
        },
        {
          path: "signin",
          element: <Signin />,
        },
        {
          path: "signup",
          element: <Signup />,
        },
      ],
    },
    {
      path: "userprofile",
      element: <UserProfile />,
      children: [
        {
          path: "articles",
          element: (
            <Suspense fallback="loading...">
              <Articles />
            </Suspense>
          ),
        },
        {
          path: "article/:articleId",
          element: <Article />,
        },
        {
          path: "",
          element: <Navigate to="/userprofile/articles" />,
        },
      ],
    },
    {
      path: "authorprofile",
      element: <AuthorProfile />,
      children: [
        {
          path: "addnewarticle",
          element: <AddNewArticle />,
        },
        {
          path: "articles-by-author/:author",
          element: <ArticlesByAuthor />,
        },
        {
          path: "article/:articleId",
          element: <Article />,
        },
        {
          path: "",
          element: <Navigate to="/authorprofile/articles-by-author/:author" />,
        },
      ],
    },
  ]);

  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
