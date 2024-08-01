// Create author api
const exp = require("express");
const authorApp = exp.Router();
const bcryptjs = require("bcryptjs");
const expressAsyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const verifyToken = require("../middlewares/verifyToken.js");

let authorscollection;
let articlescollection;
authorApp.use((req, res, next) => {
  authorscollection = req.app.get("authorscollection");
  articlescollection = req.app.get("articlescollection");
  next();
});

// Author Registration
authorApp.post(
  "/new-author",
  expressAsyncHandler(async (req, res) => {
    // get new author objext
    const newAuthor = req.body;
    // check for duplication of username
    const dbUser = await authorscollection.findOne({
      username: newAuthor.username,
    });
    if (dbUser != null) {
      // if a username already exists
      res.send({ message: "Username already exists, use another one" });
    } else {
      // if username is unique
      //hash password
      const hashedPassword = await bcryptjs.hash(newAuthor.password, 6);
      newAuthor.password = hashedPassword;
      const dbres = await authorscollection.insertOne(newAuthor);
      if (dbres.acknowledged === true) {
        res.send({ message: "author created" });
      } else {
        res.send({ message: "Unable to register Author" });
      }
    }
  })
);

//login
authorApp.post(
  "/login",
  expressAsyncHandler(async (req, res) => {
    // get author object
    const authorObj = req.body;
    // verify username
    const dbUser = await authorscollection.findOne({
      username: authorObj.username,
    });
    if (dbUser == null) {
      res.send({ message: "Invalid Username" });
    } else {
      // verify password
      const status = await bcryptjs.compare(
        authorObj.password,
        dbUser.password
      );
      if (status === false) {
        res.send({ message: "Invalid password" });
      } else {
        // create and issue token
        const signedToken = jwt.sign(
          { username: dbUser.username },
          process.env.SECRET_KEY
          // { expiresIn: "1d" }
        );
        res.send({
          message: "login success",
          token: signedToken,
          user: dbUser,
        });
      }
    }
  })
);

// adding new article by author
authorApp.post(
  "/article",
  verifyToken,
  expressAsyncHandler(async (req, res) => {
    // get new article from client
    const newArticle = req.body;
    const dbres = await articlescollection.insertOne(newArticle);
    if (dbres.acknowledged == true) {
      res.send({ message: "new article created" });
    } else {
      res.send({ message: "There is some error in uploading the article" });
    }
  })
);

// modify article by author
authorApp.put(
  "/article",
  verifyToken,
  expressAsyncHandler(async (req, res) => {
    // get modified article from client
    const modifiedArticle = req.body;
    // update by article id
    const dbres = await articlescollection.updateOne(
      { articleId: modifiedArticle.articleId },
      { $set: { ...modifiedArticle } }
    );
    const latestArticle = await articlescollection.findOne({
      articleId: modifiedArticle.articleId,
    });
    if (dbres.acknowledged == true) {
      res.send({ message: "article modified", article: latestArticle });
    } else {
      res.send({ message: "error in updating" });
    }
  })
);

// delete an article by article id
// soft delete
authorApp.put(
  "/article/:articleId",
  verifyToken,
  expressAsyncHandler(async (req, res) => {
    // get article id
    const id = Number(req.params.articleId);
    // get article
    const articletodelete = req.body;
    // update article status to false
    if(articletodelete.status===true){
      let modifiedArt= await articlescollection.findOneAndUpdate({articleId:id},{$set:{...articletodelete,status:false}},{returnDocument:"after"})
      res.send({message:"article deleted",payload:modifiedArt.status})
   }
   if(articletodelete.status===false){
       let modifiedArt= await articlescollection.findOneAndUpdate({articleId:id},{$set:{...articletodelete,status:true}},{returnDocument:"after"})
       res.send({message:"article restored",payload:modifiedArt.status})
   }
  })
);

// read articles of author
authorApp.get(
  "/articles/:authorName",
  verifyToken,
  expressAsyncHandler(async (req, res) => {
    // get author name
    const authorName = req.params.authorName;
    // get articles of author
    const articlesList = await articlescollection
      .find({ username: authorName })
      .toArray();
    res.send({ message: "all articles", payload: articlesList });
  })
);

// exporting the mini express app authorApp
module.exports = authorApp;
