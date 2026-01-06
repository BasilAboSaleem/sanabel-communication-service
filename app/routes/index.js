const express = require("express");
const router = express.Router();

// Landing Page route
router.get("/", (req, res) => {
  res.render("index"); 
});

module.exports = router;