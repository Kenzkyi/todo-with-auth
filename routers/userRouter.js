const express = require("express");

const userRouter = express.Router();
const User = require("../models/users");

userRouter.get("/", async (req, res) => {
  try {
    const allUsers = await User.find({});
    res.status(200).send({
      message: "All users retrieved successfully",
      data: allUsers,
    });
  } catch (error) {
    res.status(500).send({
      data: null,
      message: "Failed to retrieved all users",
    });
  }
});

module.exports = userRouter;
