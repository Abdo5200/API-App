const express = require("express");
/**
 * @param {express.Request} req
 * @param {express.Response} res
 */
exports.getPosts = (req, res, next) => {
  res.status(200).json({
    posts: [{ title: "First Post", content: "This is the first post" }],
  });
};

/**
 * @param {express.Request} req
 * @param {express.Response} res
 */

exports.createPost = (req, res, next) => {
  const title = req.body.title;
  const content = req.body.content;
  res.status(201).json({
    message: "Created Post successfully",
    post: { id: new Date().toISOString(), title: title, content: content },
  });
};
