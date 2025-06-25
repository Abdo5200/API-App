const express = require("express");

const fs = require("fs");
const path = require("path");

const { validationResult } = require("express-validator");

const Post = require("../models/post");
const { totalmem } = require("os");

const errorCall = (err, next) => {
  if (!err.statusCode) err.statusCode = 500;
  next(err);
};

const clientSideError = (message, errorCode) => {
  const error = new Error(message);
  error.statusCode = errorCode;
  throw error;
};

const removeImage = (imagePath) => {
  imagePath = path.join(__dirname, "..", imagePath);
  fs.unlink(imagePath, (err) => {
    console.log(err);
  });
};

const NUM_OF_POSTS_PER_PAGE = 2;

/**
 * @param {express.Request} req
 * @param {express.Response} res
 */

exports.getPosts = async (req, res, next) => {
  try {
    const currentPage = req.query.page || 1;
    const numOfPosts = await Post.find().countDocuments();
    const posts = await Post.find()
      .skip((currentPage - 1) * NUM_OF_POSTS_PER_PAGE)
      .limit(NUM_OF_POSTS_PER_PAGE);
    res.status(200).json({
      message: "Fetched Posts successfully",
      posts: posts,
      totalItems: numOfPosts,
    });
  } catch (err) {
    errorCall(err, next);
  }
};

/**
 * @param {express.Request} req
 * @param {express.Response} res
 */
exports.createPost = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      clientSideError("validation failed, entered data is incorrect", 422);
    }
    if (!req.file) clientSideError("No image provided", 422);
    const title = req.body.title;
    const content = req.body.content;
    const imageUrl = req.file.path.replace("\\", "/");
    const post = new Post({
      title: title,
      content: content,
      creator: { name: "Abdelrahman" },
      imageUrl: imageUrl,
    });
    const savedPost = await post.save();
    res.status(201).json({
      message: "Created Post successfully",
      post: savedPost,
    });
  } catch (err) {
    errorCall(err, next);
  }
};

/**
 * @param {express.Request} req
 * @param {express.Response} res
 */

exports.getPost = async (req, res, next) => {
  try {
    const postId = req.params.postId;
    const post = await Post.findById(postId);
    if (!post) {
      clientSideError("Could not found post", 404);
    }
    res.status(200).json({ message: "Post found Successfully", post: post });
  } catch (err) {
    errorCall(err, next);
  }
};

/**
 * @param {express.Request} req
 * @param {express.Response} res
 */

exports.updatePost = async (req, res, next) => {
  try {
    const postId = req.params.postId;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      clientSideError("validation failed, entered data is incorrect", 422);
    }
    const updatedTtitle = req.body.title;
    const updatedContent = req.body.content;
    let updatedImageUrl = req.body.image;
    if (req.file) {
      updatedImageUrl = req.file.path.replace("\\", "/");
    }
    if (!updatedImageUrl) {
      clientSideError("Image was not picked", 422);
    }
    const post = await Post.findById(postId);
    if (!post) {
      clientSideError("Couldn't find post", 404);
    }
    if (updatedImageUrl !== post.imageUrl) removeImage(post.imageUrl);
    post.title = updatedTtitle;
    post.content = updatedContent;
    post.imageUrl = updatedImageUrl;
    const savedPost = await post.save();
    res
      .status(200)
      .json({ message: "Updated Post successfullt", post: savedPost });
  } catch (err) {
    errorCall(err, next);
  }
};

/**
 * @param {express.Request} req
 * @param {express.Response} res
 */

exports.deletePost = async (req, res, next) => {
  try {
    const postId = req.params.postId;
    const post = await Post.findById(postId);
    if (!post) {
      clientSideError("Post could not be found", 404);
    }
    removeImage(post.imageUrl);
    await Post.findOneAndDelete(postId);
    res.status(200).json({ message: "Deleted Post successfully" });
  } catch (err) {
    errorCall(err, next);
  }
};
