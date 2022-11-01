const express = require("express");
const router = express.Router();
const { getDbResult } = require("../helper/db_helper");
const { isEmpty } = require("../helper/restric_helper");
const bcrypt = require("bcrypt");
const session = require("express-session");
module.exports = router;

router.get("/login", (req, res) => {
  res.render("loginPage", {});
});

// module.exports = function toLogin(routerApp) {
//   routerApp.get("/login", (req, res) => {
//     res.render("loginPage", {});
//   });
// };

router.get("/regis", (req, res) => {
  res.render("regisPage", {});
});
router.get("/logout", (req, res) => {
  req.session.destroy();
  res.clearCookie();
  res.redirect("/login");
});

router.post("/submit-login", (req, res) => {
  let name = req.body.name;
  let password = req.body.password;
  try {
    getDbResult(
      `SELECT * FROM akun WHERE akun.nama = '${name}'`,
      async (err, rows) => {
        if (err) return console.log("error " + err);
        if (rows[0] === undefined) return;
        if (await bcrypt.compare(password, rows[0].password)) {
          if (req.session.authenticated) {
            console.log(req.session);
          } else {
            req.session.authenticated = true;
            req.session.user = {
              id: rows[0].Akun_id,
              name: name,
              role: rows[0].role,
              login: true,
            };
            req.session.save();
          }
          console.log(req.session);
          res.redirect("/home");
        } else res.send("not success");
      }
    );
  } catch (error) {
    console.log(error);
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
