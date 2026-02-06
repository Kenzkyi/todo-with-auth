const express = require("express");

const authRouter = express.Router();
const validatePassword = require("../hooks/validatePassword");
const User = require("../models/users");
const passport = require("passport");

authRouter.post("/sign-up", validatePassword, async (req, res) => {
  const newUser = req.body;
  if (!newUser.username.trim() || !newUser.password.trim()) {
    req.session.formError = {
      error: "Username and password are required",
      confirmPasswordNotMatch: false,
      passwordLengthNotValid: false,
    };
    return res.redirect("/sign-up");
  }
  try {
    await User.register(
      new User({ username: newUser.username.trim() }),
      newUser.password.trim(),
    );
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
  if (!req.body.username.trim() || !req.body.password.trim()) {
    req.session.formError = { error: "Username and password are required" };
    return res.redirect("/");
  }
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

authRouter.post("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      console.log(err);
      req.session.formError = { error: err.message };
      return res.redirect("/my-todo");
    }
    res.redirect("/"); // Redirect the user after successful logout
  });
});

module.exports = authRouter;
