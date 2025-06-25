const express = require("express");

const User = require("../models/user");

const bcrypt = require("bcrypt");

const { validationResult } = require("express-validator");

const errorCall = (err, next) => {
  if (!err.statusCode) err.statusCode = 500;
  next(err);
};

const clientSideError = (message, errorCode) => {
  const error = new Error(message);
  error.statusCode = errorCode;
  throw error;
};

/**
 * @param {express.Request} req
 * @param {express.Response} res
 */

exports.signup = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error("Validation Failed");
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }
    const email = req.body.email;
    const name = req.body.name;
    const password = req.body.password;
    const hashedPass = await bcrypt.hash(password, 12);
    const user = new User({
      email: email,
      name: name,
      password: hashedPass,
    });
    const savedUser = await user.save();
    res
      .status(201)
      .json({ message: "created user successfully", userId: savedUser._id });
  } catch (err) {
    errorCall(err, next);
  }
};
