const express = require("express");
const router = express.Router();
const { getDbResult } = require("../helper/db_helper");

module.exports = router;

router.get("/transaksi-admin", (req, res) => {
  getDbResult(
    `SELECT * 
    FROM transaksi
    LEFT JOIN akun ON akun.Akun_id = transaksi.customer_id
    WHERE transaksi.status_pembayaran != 'c'`,
    (err, transaksiMasuk) => {
      if (err) console.log(err);
      getDbResult(
        `SELECT * FROM transaksi
        LEFT JOIN akun ON akun.Akun_id = transaksi.customer_id
      WHERE transaksi.status_pembayaran = 'c' AND transaksi.status_pengambilan = 'n'`,
        (err, menungguPengambilan) => {
          if (err) console.log(err);
          console.log(transaksiMasuk);

          res.render("transaksiAdminPage", {
            transaksiMasuk: transaksiMasuk,
            menungguPengambilan: menungguPengambilan,
          });
        }
      );
    }
  );
});

router.post("/detail-konfirmasi-pembayaran", (req, res) => {
  let transaksi_id = req.body.transaksiId;
  if (transaksi_id != "" || transaksi_id != undefined) {
    console.log(transaksi_id);
    getDbResult(
      `SELECT * 
    FROM penjualan
    LEFT JOIN transaksi ON transaksi.Transaksi_id = penjualan.transaksi_id
    WHERE penjualan.transaksi_id = ${transaksi_id}`,
      (err, rows) => {
        if (!err) console.log("detail konfirmasi pembayaran didapat");
        else return console.log(err);
        res.json({
          data: rows,
        });
      }
    );
  }
});

router.post("/cek-resi", (req, res) => {
  let resi = req.body.resi;
  if (resi != "" || resi !== undefined) {
    getDbResult(
      `SELECT * FROM transaksi WHERE kode_resi = '${resi}' AND status_pembayaran = 'c' AND status_pengambilan = 'n'`,
      (err, rows) => {
        if (!err) console.log("cek resi didapat");
        else return console.log(err);
        res.json({
          data: rows,
        });
      }
    );
  }
});

router.post("/konfirmasi-pembayaran", (req, res) => {
  let id = req.body.id_konfirmasi_pembayaran;
  console.log(id);

  if (id == "" || id === undefined) {
    res.redirect("/transaksi-admin");
  } else {
    getDbResult(
      `UPDATE transaksi
      SET status_pembayaran = 'c'
      WHERE Transaksi_id = ${id}`,
      (err, rows) => {
        if (!err) console.log("berhasil konfirmasi pembayaran");
        else return console.log(err);
        res.redirect("/transaksi-admin");
      }
    );
  }
});
router.post("/konfirmasi-pengambilan", (req, res) => {
  let resi = req.body.resi_konfirmasi;
  let id = req.body.id_konfirmasi;
  console.log(resi);
  console.log(id);

  if ((id == "" || id === undefined) && (resi == "" || resi === undefined)) {
    res.redirect("/transaksi-admin");
  } else {
    getDbResult(
      `UPDATE transaksi
      SET status_pengambilan = 'y'
      WHERE Transaksi_id = ${id} AND kode_resi = '${resi}' AND status_pembayaran = 'c'`,
      (err, rows) => {
        if (!err) console.log("berhasil konfirmasi pengambilan");
        else return console.log(err);
        res.redirect("/transaksi-admin");
      }
    );
  }
});
