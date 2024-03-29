const { Router } = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { UserModel } = require("../model/user.model");
require("dotenv").config();

const { BlacklistModel } = require("../model/blacklist.model");

const userRouter = Router();

const findOneWithTimeout = (query, timeout) => {
  return Promise.race([
    UserModel.findOne(query),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Operation timed out")), timeout)
    ),
  ]);
};

userRouter.post("/register", async (req, res) => {
  try {
    const email = req.body.email;

    const user = await findOneWithTimeout({ email }, 15000); // Set a longer timeout
    if (user) {
      res.status(400).json({ msg: "User Already Registered" });
    } else {
      bcrypt.hash(req.body.password, 10, async (error, hash) => {
        if (hash) {
          const newUser = new UserModel({
            ...req.body,
            password: hash,
          });
          await newUser.save();
          res.status(200).json({ msg: "User Registration Successful" });
        }
      });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

userRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await findOneWithTimeout({ email }, 15000); // Set a longer timeout
    if (user) {
      bcrypt.compare(password, user.password, (error, result) => {
        if (result) {
          var token = jwt.sign({ userID: user._id }, process.env.SECRET);
          res
            .status(200)
            .json({ msg: "User Logged in Successful", token });
        } else {
          res.status(200).json({ msg: "Incorrect Password" });
        }
      });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

userRouter.post("/logout", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1] || null;

    if (token) {
      await BlacklistModel.updateMany(
        {},
        { $push: { blacklist: [token] } }
      );
      res.status(200).send("Logout successful!");
    }
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

module.exports = { userRouter };
