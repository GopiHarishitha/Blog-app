const exp = require("express");
const userApp = exp.Router();
const bcryptjs = require("bcryptjs");
const expressAsyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const verifyToken = require("../middlewares/verifyToken.js");
require("dotenv").config();

// get users collection object and articles collection
let userscollection, articlescollection;
userApp.use((req, res, next) => {
  userscollection = req.app.get("userscollection");
  articlescollection = req.app.get("articlescollection");
  next();
});

// User Registration Route
userApp.post(
  "/user",
  expressAsyncHandler(async (req, res) => {
    //get user resource from client
    let newUser = req.body;
    // checking for duplicate user based on username
    let dbUser = await userscollection.findOne({ username: newUser.username });
    //if user found in db
    if (dbUser != null) {
      res.send({ message: "User existed" });
    } else {
      // hash the password
      let hashedPassword = await bcryptjs.hash(newUser.password, 6);
      //replace the hashed password
      newUser.password = hashedPassword;
      //create user
      let dbres = await userscollection.insertOne(newUser);
      if (dbres.acknowledged === true) {
        res.send({ message: "user created" });
      } else {
        res.send({ message: "unable to create user" });
      }
    }
  })
);

// User Login
userApp.post(
  "/login",
  expressAsyncHandler(async (req, res) => {
    //take user Object
    let userCred = req.body;
    // check for username
    let dbUser = await userscollection.findOne({ username: userCred.username });
    if (dbUser == null) {
      res.send({ message: "Invalid username" });
    } else {
      // check for password
      const status = await bcryptjs.compare(userCred.password, dbUser.password);
      if (status == false) {
        res.send({ message: "Invalid password" });
      } else {
        const signedToken = jwt.sign(
          { username: dbUser.username },
          process.env.SECRET_KEY,
          { expiresIn: "1d" }
        );
        //user response
        res.send({
          message: "login success",
          token: signedToken,
          user: dbUser,
        });
      }
    }
    // create JWT token and encode it
    // send response
  })
);

// get articles of all users
userApp.get(
  "/articles",
  verifyToken,
  expressAsyncHandler(async (req, res) => {
    const articlescollection = req.app.get("articlescollection");
    const articlesList = await articlescollection
      .find({ status: true })
      .toArray();
    res.send({ message: "all articles", payload: articlesList });
  })
);

// post comments for an article by article id
userApp.post(
  "/comment/:articleId",
  verifyToken,
  expressAsyncHandler(async (req, res) => {
    const articleId = Number(req.params.articleId);
    // get the comment
    const userComment = req.body;
    // insert userComment object to comments array of article by id
    console.log(articleId, userComment);
    const dbres = await articlescollection.updateOne(
      { articleId: articleId },
      { $addToSet: { comments: userComment } }
    );
    if (dbres.acknowledged == true) {
      res.send({ message: "comment added" });
    }
  })
);

//export
module.exports = userApp;
