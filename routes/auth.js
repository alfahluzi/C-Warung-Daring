const express = require("express");
const router = express.Router();
const { getDbResult } = require("../helper/db_helper");
const { isEmpty } = require("../helper/restric_helper");
const bcrypt = require("bcrypt");
const {
  getSession,
  setSession,
  removeSession,
} = require("../helper/session_helper");
module.exports = router;

sess = getSession();
router.get("/login", (req, res) => {
  res.render("loginPage", {});
});

router.get("/regis", (req, res) => {
  res.render("regisPage", {});
});
router.get("/logout", (req, res) => {
  removeSession();
  req.session.destroy();
  res.clearCookie();
  res.redirect("/login");
});

router.post("/submit-login", (req, res) => {
  let name = req.body.name;
  let password = req.body.password;
  if (isEmpty(name) || isEmpty(password)) return res.redirect("/login");
  try {
    getDbResult(
      `SELECT * FROM akun WHERE akun.nama = '${name}'`,
      async (err, rows) => {
        if (err) return console.log("error " + err);
        if (isEmpty(rows.length)) return res.redirect("/login");
        else console.log("found rows");

        if (await bcrypt.compare(password, rows[0].password)) {
          if (sess) removeSession();

          setSession(
            JSON.stringify({
              id: rows[0].Akun_id,
              name: name,
              role: rows[0].role,
            })
          );
          res.redirect("/home");
        } else res.send("not success");
      }
    );
  } catch (error) {
    console.log(error);
    res.redirect("home");
  }
});
router.post("/submit-regis", async (req, res) => {
  let name = req.body.name;
  let phone = req.body.phone;
  let password = req.body.password;
  if (isEmpty(name) || isEmpty(phone) || isEmpty(password)) {
    console.log("ada form kosong");
    res.redirect("/regis");
  } else {
    try {
      const hashPass = await bcrypt.hash(password, 2);

      getDbResult(
        `INSERT INTO akun (nama, nomor_hp, password) VALUES ('${name}', '${phone}', '${hashPass}')`,
        (err, rows) => {
          if (!err) console.log("berhasil regis");
          else console.log(err);
          res.redirect("/login");
        }
      );
    } catch (error) {
      console.log(error);
      res.redirect("/regis");
    }
  }
});
