const express = require("express");
const authRoute = express.Router();
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const config = require("config");
const User = require("../../models/userModel");

const auth = require("../../middleware/auth");

//Get api/auth
authRoute.post("/", async (req, res) => {
  const dataToValidate = {
    email: Joi.string()
      .email({ tlds: { allow: false } })
      .required(),
    password: Joi.string().min(3).max(15).required(),
  };
  const result = Joi.validate(req.body, dataToValidate);
  const { error } = result;
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  try {
    const { email, password } = req.body;
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).send("Invalid credentials");
    }
    const userpassword = await user.password;
    const useremail = await user.email;
    const isMatched = password == userpassword && email == useremail;
    if (!isMatched) {
      return res.status(400).send("Invalid credentials");
    }
    const payload = {
      user: { id: user.id },
    };

    jwt.sign(
      payload,
      config.get("jwtsecret"),
      { expiresIn: 500000 },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    res.status(500).send("Internal server error");
  }
});

authRoute.get("/", async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (user) {
      return res.send(user).status(200);
    }
    res.status(404).send({ message: "Invalid Token" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Internal server error");
  }
});

module.exports = authRoute;
