const express = require("express");
const router = express.Router();

//Get api/profiles
router.get("/", (req, res) => {
  res.send("Profile Route");
});

module.exports = router;
