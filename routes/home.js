const express = require("express");
const router = express.Router();
const { getDbResult } = require("../helper/db_helper");
module.exports = router;
const { getSession } = require("../helper/session_helper");
const { isEmpty } = require("../helper/restric_helper");
sess = getSession();

function sessionCheck(req, res, next) {
  if (sess) {
    console.log(sess);
    return next();
  } else {
    return res.redirect("/login");
  }
}

router.get("/home", sessionCheck, (req, res) => {
  getDbResult("SELECT * FROM barang", (err, rows) => {
    if (!err) console.log("home aman");
    else console.log(err);
    res.render("homePage", { user: sess, barang: rows });
  });
});

router.post("/tambah-keranjang", sessionCheck, (req, res) => {
  console.log("asdasd");
  let akun_id = sess.id;
  let barang_id = req.body.barang_id;
  console.log(akun_id);
  console.log(barang_id);
  if (!isEmpty(akun_id) || !isEmpty(barang_id)) {
    getDbResult(
      `
    SELECT * 
    FROM keranjang
    WHERE keranjang.akun_id = ${akun_id} AND keranjang.barang_id = ${barang_id}
    `,
      (err, rows) => {
        if (rows.length > 0) {
          getDbResult(
            `UPDATE keranjang
            SET kuantitas = kuantitas + 1
            WHERE keranjang.akun_id = ${akun_id} AND keranjang.barang_id = ${barang_id}`,
            (err, rows) => {
              if (!err) console.log("berhasil tambah keranjang");
              else console.log(err);
              res.redirect("/home");
            }
          );
        } else {
          getDbResult(
            `INSERT INTO keranjang (akun_id, barang_id)
        VALUES (${akun_id}, ${barang_id})`,
            (err, rows) => {
              if (!err) console.log("berhasil tambah keranjang");
              else console.log(err);
              res.redirect("/home");
            }
          );
        }
      }
    );
  } else {
    console.log("gagal tambah keranjang");
    res.redirect("/home");
  }
});
