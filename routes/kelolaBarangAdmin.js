const express = require("express");
const router = express.Router();
const { getDbResult, pool } = require("../helper/db_helper");
const multer = require("multer");
const path = require("path");
const { getSession } = require("../helper/session_helper");
sess = getSession();
module.exports = router;

let daftarBarang;
let daftarJenis;
let daftarKategori;

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

function adminAuth(req, res, next) {
  if (sess == false) res.redirect("/login");
  if (sess.role == 1) {
    console.log("kamu admin");
    return next();
  }
  console.log("kamu bukan admin");
  res.redirect("/home");
}

router.get("/kelola-barang-admin", adminAuth, (req, res) => {
  getDbResult("select * from jenis_barang", (err, rowsJenis) => {
    if (err) return console.log(err);
    daftarJenis = rowsJenis;
    getDbResult("select * from kategori_barang", (err, rowsKategori) => {
      if (err) return console.log(err);
      daftarKategori = rowsKategori;
      getDbResult(`select * from barang`, (err, rowsBarang) => {
        if (err) return console.log(err);
        daftarBarang = rowsBarang;

        res.render("kelolaBarangAdminPage", {
          barang: daftarBarang,
          jenis: daftarJenis,
          kategori: daftarKategori,
        });
      });
    });
  });
});

router.post("/search-kelola-barang-admin", adminAuth, (req, res) => {
  keywoard = req.body.keywoard;
  getDbResult("select * from jenis_barang", (err, rowsJenis) => {
    if (err) return console.log(err);
    daftarJenis = rowsJenis;
    getDbResult("select * from kategori_barang", (err, rowsKategori) => {
      if (err) return console.log(err);
      daftarKategori = rowsKategori;
      getDbResult(
        `select * from barang where barang.nama = '%${keywoard}%'`,
        (err, rowsBarang) => {
          if (err) return console.log(err);
          daftarBarang = rowsBarang;

          res.render("kelolaBarangAdminPage", {
            barang: daftarBarang,
            jenis: daftarJenis,
            kategori: daftarKategori,
          });
        }
      );
    });
  });
});

router.post("/tambah-kategori", adminAuth, (req, res) => {
  nama = req.body.namaKategori;
  if (nama !== undefined) {
    getDbResult(
      `INSERT INTO kategori_barang (kategori)
      SELECT '${nama}'
      WHERE '${nama}' NOT IN (SELECT LOWER(kategori) FROM kategori_barang)`,
      (err, rows) => {
        if (!err) console.log("insert kategori success");
        else console.log(err);
        res.redirect("/kelola-barang-admin");
      }
    );
  } else {
    res.redirect("/kelola-barang-admin");
  }
});

router.post("/tambah-jenis", adminAuth, (req, res) => {
  nama = req.body.namaJenis;
  kategori_id = req.body.jenisKategori;
  if (nama !== undefined) {
    getDbResult(
      `INSERT INTO jenis_barang (jenis, kategori_id)
      SELECT '${nama}', '${kategori_id}'
      WHERE '${nama}' NOT IN (SELECT LOWER(jenis) FROM jenis_barang)`,
      (err, rows) => {
        console.log("kategori id: " + kategori_id);
        if (!err) console.log("insert jenis success");
        else console.log(err);
        res.redirect("/kelola-barang-admin");
      }
    );
  } else {
    res.redirect("/kelola-barang-admin");
  }
});

router.post("/tambah-barang-baru", uploadSingle, adminAuth, (req, res) => {
  nama = req.body.namaBarangBaru;
  detail = req.body.detailBarangBaru;
  gambar = req.file.filename;
  harga = req.body.hargaBarangBaru;
  kuantitas = req.body.kuantitasBarangBaru;
  jenis = req.body.jenisBarangBaru;

  if (nama !== undefined) {
    if (!gambar) gambar = "test aja";
    getDbResult(
      `INSERT INTO barang (nama, detail, kuantitas, foto, jenis, harga)
      VALUES('${nama}', '${detail}', ${kuantitas}, '${gambar}', ${jenis}, ${harga})`,
      (err, rows) => {
        if (!err) console.log("insert barang baru success");
        else console.log(err);
        res.redirect("/kelola-barang-admin");
      }
    );
  } else {
    res.redirect("/kelola-barang-admin");
  }
});

router.post("/hapus-kategori", adminAuth, (req, res) => {
  kategori_id = req.body.kategori_id_todelete;
  if (kategori_id !== undefined) {
    getDbResult(
      `DELETE FROM kategori_barang WHERE Kategori_barang_id = ${kategori_id};`,
      (err, rows) => {
        if (!err) console.log("hapus kategori success");
        else console.log(err);
        res.redirect("/kelola-barang-admin");
      }
    );
  } else {
    res.redirect("/kelola-barang-admin");
  }
});

router.post("/hapus-barang", adminAuth, (req, res) => {
  barang_id = req.body.barang_id_todelete;
  if (barang_id !== undefined) {
    getDbResult(
      `DELETE FROM barang WHERE Barang_id = ${barang_id};`,
      (err, rows) => {
        if (!err) console.log("hapus barang success");
        else console.log(err);
        res.redirect("/kelola-barang-admin");
      }
    );
  } else {
    console.log("ada masalah");
    res.redirect("/kelola-barang-admin");
  }
});

router.post("/edit-jenis", adminAuth, (req, res) => {
  jenis_id = req.body.jenis_id_toedit;
  namaJenis = req.body.nama_jenis_toedit;
  kategori_id = req.body.jenis_kategori_toedit;

  if (kategori_id === undefined) kategori_id = req.body.kategori_terpasang;
  if (namaJenis == "") kategori_id = req.body.nama_terpasang;

  if (jenis_id !== undefined) {
    getDbResult(
      `UPDATE jenis_barang
      SET jenis = '${namaJenis}', kategori_id= ${kategori_id}
      WHERE Jenis_barang_id=${jenis_id};`,
      (err, rows) => {
        if (!err) console.log("edit jenis success");
        else console.log(err);
        res.redirect("/kelola-barang-admin");
      }
    );
  } else {
    res.redirect("/kelola-barang-admin");
  }
});

router.post("/edit-barang", adminAuth, (req, res) => {
  id_barang = req.body.idbarang_edit_barang;

  nama = req.body.nama_edit_barang;
  if (nama == "") nama = req.body.nama_last_data;

  detail = req.body.detail_edit_barang;
  if (detail == "") detail = req.body.detail_last_data;

  kuantitas = req.body.kuantitas_edit_barang;
  if (kuantitas == "") kuantitas = req.body.kuantitas_last_data;

  foto = req.body.gambar_edit_barang;
  if (foto == "") foto = req.body.foto_last_data;

  harga = req.body.harga_edit_barang;
  if (harga == "") harga = req.body.harga_last_data;

  jenis = req.body.jenis_edit_barang;

  if (id_barang !== undefined) {
    getDbResult(
      `UPDATE barang
      SET nama = '${nama}', detail= '${detail}', kuantitas= ${kuantitas}, foto= '${foto}', jenis= ${jenis}, harga= ${harga}
      WHERE Barang_id=${id_barang};`,
      (err, rows) => {
        if (!err) console.log("edit barang success");
        else console.log(err);
        res.redirect("/kelola-barang-admin");
      }
    );
  } else {
    console.log("somethink wrong");
    res.redirect("/kelola-barang-admin");
  }
});
