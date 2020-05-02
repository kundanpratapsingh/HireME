const express = require("express");
const router = express.Router();

//Get api/posts
router.get("/", (req, res) => {
  res.send("Posts Route");
});

module.exports = router;
