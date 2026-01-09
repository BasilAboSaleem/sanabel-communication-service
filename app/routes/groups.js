const express = require("express");
const router = express.Router();

// صفحة إدارة المجموعات
router.get("/", async (req, res) => {
  try {
    res.render("groups", { user: req.user });
  } catch (error) {
    res.status(500).render("error", { error: error.message });
  }
});

module.exports = router;
