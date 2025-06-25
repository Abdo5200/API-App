const express = require("express");

const { body } = require("express-validator");

const router = express.Router();

const feedController = require("../controller/feed");

//GET /feed/posts
router.get("/posts", feedController.getPosts);

//POST /feed/post --> to create a new post
router.post(
  "/post",
  [
    body("title").trim().isLength({ min: 5 }),
    body("content").trim().isLength({ min: 5 }),
  ],
  feedController.createPost
);

//GET /feed/post/:postId --> to view a single post
router.get("/post/:postId", feedController.getPost);

//PUT /feed/post/:postId --> for updating post
router.put(
  "/post/:postId",
  [
    body("title").trim().isLength({ min: 5 }),
    body("content").trim().isLength({ min: 5 }),
  ],
  feedController.updatePost
);

router.delete("/post/:postId", feedController.deletePost);

module.exports = router;
