const express = require("express");
const { getDbResult } = require("../helper/db_helper");
const router = express.Router();
module.exports = router;

router.post("/detail-barang", (req, res) => {
  let id_barang = req.body.id_barang;
  if (id_barang != "") {
    getDbResult(
      `SELECT * FROM barang WHERE Barang_id = ${id_barang}`,
      (err, rows) => {
        if (!err) console.log("berhasil buka detail barang");
        else console.log(err);
        res.render("detailPage", { detailBarang: rows });
      }
    );
  } else {
    res.redirect("/home");
  }
});
