const express = require("express");
const router = express.Router();
const { getDbResult } = require("../helper/db_helper");
const toLogin = require("../routes/auth");
module.exports = router;
const { getSession } = require("../helper/session_helper");
sess = getSession();

function sessionCheck(req, res, next) {
  if (sess) {
    console.log(sess);
    return next();
  } else {
    return res.render("loginPage");
  }
}

router.get("/home", sessionCheck, (req, res) => {
  getDbResult("SELECT * FROM barang", (err, rows) => {
    if (!err) console.log("home aman");
    else console.log(err);
    res.render("homePage", { user: sess, barang: rows });
  });
});
