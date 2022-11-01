const express = require("express");
const router = express.Router();
const { getDbResult } = require("../helper/db_helper");
module.exports = router;
const toLogin = require("../routes/auth");

function sessionCheck(req, res, next) {
  if (!req.session.user.login) return res.render("/loginPage");
  else return next();
}

router.get("/home", sessionCheck, (req, res) => {
  getDbResult("SELECT * FROM barang", (err, rows) => {
    if (!err) console.log("home aman");
    else console.log(err);
    res.render("homePage", { user: req.session.user, barang: rows });
  });
});
