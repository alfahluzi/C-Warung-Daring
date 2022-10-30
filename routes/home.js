const express = require("express");
const router = express.Router();
const { getDbResult } = require("../helper/db_helper");
module.exports = router;

router.get("/home", (req, res) => {
  res.render("homePage", {});
});
