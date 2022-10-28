const express = require("express");
const { getDbResult } = require("../helper/db_helper");
const router = express.Router();
const bcrypt = require("bcrypt");
module.exports = router;

router.get("/", (req, res) => {
  res.render("index", {});
});

router.post("/submit-login", (req, res) => {
  console.log("body");
  console.log(req.body.name);
  console.log(req.body.password);
  try {
    getDbResult(
      `SELECT * FROM akun WHERE akun.nama = '${req.body.name}'`,
      async (err, rows) => {
        if (err) return console.log("error " + err);

        console.log("rows " + rows[0]);
        if (rows[0] === undefined) return;
        if (await bcrypt.compare(req.body.password, rows[0].password)) {
          res.redirect("/home");
        } else res.send("not success");
      }
    );
  } catch (error) {
    console.log(error);
  }
});
router.post("/submit-regis", async (req, res) => {
  try {
    const hashPass = await bcrypt.hash(req.body.password, 2);

    con.query(
      `INSERT INTO Customer (nama, nomor_hp, password) VALUES ('${req.body.name}', '${req.body.phone}', '${hashPass}')`,
      (err, res) => {
        console.log(err);
        console.log(res);
      }
    );

    res.status(201).send();
  } catch (error) {
    res.status(500);
  }
});
