const express = require("express");
const router = express.Router();
const { getDbResult } = require("../helper/db_helper");
module.exports = router;

router.get("/transaksi-admin", (req, res) => {
  res.render("transaksiAdminPage", {});
});
router.get("/kelola-barang-admin", (req, res) => {
  res.render("kelolaBarangAdminPage", {});
});
router.get("/laporan-penjualan-admin", (req, res) => {
  res.render("laporanPenjualanAdminPage", {});
});
