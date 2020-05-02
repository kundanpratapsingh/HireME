const express = require("express");
const Joi = require("joi");
const gravatar = require("gravatar");
const User = require("../../models/userModel");
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
    const saved = await user.save();
    if (saved) {
      return res.status(200).send("Sucessfully Registered");
    }
  } catch (err) {
    res.status(500).send("Internal server error");
  }
});

module.exports = router;
