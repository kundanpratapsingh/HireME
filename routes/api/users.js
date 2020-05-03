const express = require("express");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const auth = require("../../middleware/auth");
const User = require("../../models/userModel");
const config = require("config");
const router = express.Router();

//Get api/users
router.post("/", async (req, res) => {
  const dataToValidate = {
    name: Joi.string().min(3).required(),
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

  const { name, email, password } = req.body;
  try {
    let user = await User.findOne({ name });
    if (user) {
      return res.status(400).send("User Already Exists");
    }
    const avatar = gravatar.url(email, {
      s: "200",
      r: "pg",
      d: "mm",
    });
    user = new User({ name, email, avatar, password });
    const payload = {
      user: { id: user.id },
    };
    const saved = await user.save();
    if (saved)
      return res.send({ message: "User Resgisterd Sucessfully" }).status(200);
    // jwt.sign(
    //   payload,
    //   config.get("jwtsecret"),
    //   { expiresIn: 500000 },
    //   (err, token) => {
    //     if (err) throw err;
    //     res.json({ token });
    //   }
    // );
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal server error");
  }
});

router.get("/", auth, async (req, res) => {
  try {
    let Users = await User.find();
    if (Users) {
      return res.status(200).send(Users);
    }
    return res.send("No Users");
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;
