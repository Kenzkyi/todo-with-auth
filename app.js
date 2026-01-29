const express = require("express");
const connectToDB = require("./db");
const userRouter = require("./routers/userRouter");
const authRouter = require("./routers/authRouter");
const session = require("express-session");
const passport = require("passport");
const User = require("./models/users");
const connectEnsureLogin = require("connect-ensure-login");
require("dotenv").config();

const app = express();

// parse application/x-www-form-urlencoded (HTML form submissions)
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");

const PORT = process.env.PORT;

app.use(
  session({
    saveUninitialized: true,
    resave: false,
    secret: process.env.SESSION_SECRET,
    cookie: {
      maxAge: 60 * 60 * 1000,
    },
  }),
);

app.use(passport.initialize());
app.use(passport.session());

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use("/v1/auth", authRouter);
app.use("/v1/users", userRouter);

app.get("/", (req, res) => {
  const errorObj =
    req.session && req.session.formError ? req.session.formError : null;
  if (req.session) delete req.session.formError;
  res.render("login", {
    error: errorObj?.error || null,
    successMsg: errorObj?.successMsg || null,
  });
});

app.get("/sign-up", (req, res) => {
  const errorObj =
    req.session && req.session.formError ? req.session.formError : null;
  if (req.session) delete req.session.formError;
  res.render("sign-up", {
    error: errorObj?.error || null,
    passwordLengthNotValid: errorObj?.passwordLengthNotValid || false,
    confirmPasswordNotMatch: errorObj?.confirmPasswordNotMatch || false,
    successMsg: errorObj?.successMsg || null,
  });
});

app.get("/my-todo", connectEnsureLogin.ensureLoggedIn("/"), (req, res) => {
  res.render("todo-app");
});

app.use((err, req, res, next) => {
  console.log(req.url, err);
  res.status(500).send("Something went wrong");
});

connectToDB();

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
