const express = require("express");
const { getDbResult } = require("../helper/db_helper");
const router = express.Router();
const bcrypt = require("bcrypt");
const { getSession } = require("../helper/session_helper");
const { isEmpty } = require("../helper/restric_helper");
const multer = require("multer");
const path = require("path");
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

const itemImageStorage = multer.diskStorage({
  // konfigurasi folder penyimpanan file
  destination: "public/assets/itemImages",
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const uploadSingle = multer({
  storage: itemImageStorage,
  // limits: { fileSize: 1000000 },
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
}).single("file");

function checkFileType(file, cb) {
  const fileTypes = /jpeg|jpg|png|gif/;
  const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimeType = fileTypes.test(file.mimetype);
  if (mimeType && extName) {
    return cb(null, true);
  } else {
    cb("Error: Images Only !!!");
  }
}

router.post("/finish-checkout", uploadSingle, sessionCheck, (req, res) => {
  let costumer_id = sess.id;
  let waktu = new Date().toLocaleString("id-ID").split(" ")[1];
  let tanggal = new Date().toLocaleString("id-ID").split(" ")[0];
  let total_harga = 10000;
  let foto = req.file.filename;
  let kode_resi =
    new Date().getTime() + Math.floor(Math.random() * 100000) + 100000;
  if (!isEmpty(costumer_id) || !isEmpty(kode_resi)) {
    //get jumlah total
    getDbResult(
      `SELECT SUM(harga * keranjang.kuantitas) AS q
      FROM keranjang
      JOIN barang ON barang.Barang_id = keranjang.barang_id
	    WHERE akun_id = ${costumer_id}`,
      (err, keranjang) => {
        if (!err) console.log("dapat jumlah total");
        else console.log(err);
        total_harga = keranjang[0].q;

        //buat transaksi
        getDbResult(
          `INSERT INTO 
          transaksi (customer_id, waktu, tanggal, total_harga_transaksi, foto_pembayaran, kode_resi, status_pembayaran)
        VALUES (${costumer_id},'${waktu}','${tanggal}',${total_harga},'${foto}',${kode_resi}, 'y');
        `,
          (err, rows) => {
            if (!err) console.log("berhasil finish checkout");
            else console.log(err);
            //buat datatabel penjualan
            getDbResult(
              `
            INSERT INTO penjualan (kode_resi, id_barang, nama_barang, detail_barang, kuantitas, harga_jual, harga_total)
            SELECT ${kode_resi}, keranjang.barang_id, barang.nama, barang.detail, keranjang.kuantitas, barang.harga, (barang.harga * keranjang.kuantitas) 
            FROM keranjang JOIN barang ON barang.Barang_id = keranjang.barang_id
            `,
              (err, rows) => {
                if (!err) console.log("berhasil buat penjualan");
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
    );
  }
});
