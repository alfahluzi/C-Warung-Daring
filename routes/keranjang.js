/** @format */

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
    return res.redirect("/login");
  }
}

router.get("/keranjang", sessionCheck, (req, res) => {
  let user_id = sess.id;
  getDbResult(
    `SELECT barang.nama as nama, barang.detail as detail, barang.harga as harga, keranjang.kuantitas as kuantitas 
  FROM keranjang 
    JOIN barang ON barang.Barang_id = keranjang.barang_id
  WHERE akun_id = ${user_id}`,
    (err, rows) => {
      if (!err) console.log("keranjang aman");
      else console.log(err);
      res.render("keranjangPage", { user: sess, barang: rows });
    }
  );
});
