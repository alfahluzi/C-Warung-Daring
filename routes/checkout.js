const express = require("express");
const { getDbResult } = require("../helper/db_helper");
const router = express.Router();
const bcrypt = require("bcrypt");
const { getSession } = require("../helper/session_helper");
const { isEmpty } = require("../helper/restric_helper");
module.exports = router;

sess = getSession();

function sessionCheck(req, res, next) {
  if (sess) {
    console.log(sess);
    return next();
  } else {
    return res.redirect("/login");
  }
}

router.get("/checkout", sessionCheck, (req, res) => {
  res.render("checkoutPage", {});
});

router.post("/finish-checkout", sessionCheck, (req, res) => {
  let costumer_id = sess.id;
  let waktu = new Date().toLocaleString("id-ID").split(" ")[1];
  let tanggal = new Date().toLocaleString("id-ID").split(" ")[0];
  let total_harga = 10000;
  let foto = "hehe";
  let kode_resi = Math.floor(Math.random() * 100000) + 100000;
  if (!isEmpty(costumer_id) || !isEmpty(kode_resi)) {
    //get jumlah total
    getDbResult(
      `SELECT SUM(harga * keranjang.kuantitas) AS q
      FROM keranjang
      JOIN barang ON barang.Barang_id = keranjang.barang_id
	    WHERE akun_id = ${costumer_id}`,
      (err, rows) => {
        if (!err) console.log("dapat jumlah total");
        else console.log(err);
        total_harga = rows[0].q;

        //buat transaksi
        getDbResult(
          `INSERT INTO 
          transaksi (customer_id, waktu, tanggal, total_harga_transaksi, foto_pembayaran, kode_resi)
        VALUES (${costumer_id},'${waktu}','${tanggal}',${total_harga},'${foto}',${kode_resi})
        `,
          (err, rows) => {
            if (!err) console.log("berhasil finish checkout");
            else console.log(err);

            //clear keranjang
            getDbResult(
              `DELETE FROM keranjang WHERE akun_id = ${costumer_id};`,
              (err, rows) => {
                if (!err)
                  console.log("berhasil delete keranjang finish checkout");
                else console.log(err);
                res.redirect("home");
              }
            );
          }
        );
      }
    );
  }
});
