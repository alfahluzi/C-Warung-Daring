const express = require("express");
const router = express.Router();
const { getDbResult } = require("../helper/db_helper");
const { getSession } = require("../helper/session_helper");
sess = getSession();
module.exports = router;

function adminAuth(req, res, next) {
  if (sess == false) res.redirect("/login");
  if (sess.role == 1) {
    console.log("kamu admin");
    return next();
  }
  console.log("kamu bukan admin");
  res.redirect("/home");
}

router.get("/laporan-penjualan-admin", adminAuth, (req, res) => {
  res.render("laporanPenjualanAdminPage", {});
});
