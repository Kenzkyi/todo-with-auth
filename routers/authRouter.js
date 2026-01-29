const express = require("express");

const authRouter = express.Router();
const validatePassword = require("../hooks/validatePassword");
const User = require("../models/users");
const passport = require("passport");

authRouter.post("/sign-up", validatePassword, async (req, res) => {
  const newUser = req.body;
  try {
    const user = await User.register(
      new User({ username: newUser.username }),
      newUser.password,
    );
    console.log(user);
    req.session.formError = {
      error: null,
      confirmPasswordNotMatch: false,
      passwordLengthNotValid: false,
      successMsg: "User registered successfully. Please login.",
    };
    res.redirect("/");
  } catch (error) {
    console.log(error);
    req.session.formError = {
      error: error.message,
      confirmPasswordNotMatch: false,
      passwordLengthNotValid: false,
    };
    return res.redirect("/sign-up");
  }
});
authRouter.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      req.session.formError = { error: info?.message || "Invalid credentials" };
      return res.redirect("/");
    }
    req.logIn(user, (loginErr) => {
      if (loginErr) return next(loginErr);
      return res.redirect("/my-todo");
    });
  })(req, res, next);
});

module.exports = authRouter;
