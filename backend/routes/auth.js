const express = require("express");

const router = express.Router();

const { body } = require("express-validator");

const User = require("../models/user");

const authController = require("../controller/auth");

router.put(
  "/signup",
  [
    body("name").trim().isAlphanumeric().not().isEmpty(),
    body("email")
      .isEmail()
      .withMessage("Please Enter a valid email")
      .custom(async (value, { req }) => {
        try {
          const user = await User.find({ email: value });
          if (user) {
            return new Promise.reject("Email already exist");
          }
        } catch (err) {
          console.log(err);
        }
      })
      .normalizeEmail(),
    body("password").trim().isLength({ min: 5 }),
  ],
  authController.signup
);

module.exports = router;
