const exp = require("express");
const app = exp();
require("dotenv").config(); //config method returns nothing
// in node js process is a global object. The Config method adds .env property for the process

const path = require("path");

// deploy react build in this server
app.use(exp.static(path.join(__dirname, "../client/build")));

const mc = require("mongodb").MongoClient;
mc.connect(process.env.DB_URL)
  .then((client) => {
    // get db Obj
    const blogdb = client.db("blogdb");
    // get collection Object
    const userscollection = blogdb.collection("userscollection");
    const articlescollection = blogdb.collection("articlescollection");
    const authorscollection = blogdb.collection("authorscollection");
    //share collection through out the express app
    app.set("userscollection", userscollection);
    app.set("articlescollection", articlescollection);
    app.set("authorscollection", authorscollection);
    //confirm db connection status
    console.log("DB connection success");
  })
  .catch((err) => {
    console.log("error in DB connection", err);
  });

// import API routes
const userApp = require("./API/user-api");
const adminApp = require("./API/admin-api");
const authorApp = require("./API/author-api");

// it can extract the body of the request object
app.use(exp.json());

// if path starts with user-api send request to userApp
app.use("/user-api", userApp);
// if path starts with author-api send request to authorApp
app.use("/author-api", authorApp);
// if path starts with admin-api send request to adminApp
app.use("/admin-api", adminApp);

// deals with page refresh
app.use((req, res, next) => {
  res.sendFile(path.join(__dirname, "../client/build/index.html"));
});

// express error handler
app.use((err, req, res, next) => {
  res.send({ message: "error", payload: err.message });
});

// assign port number
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// THis is BLOG app Set up
