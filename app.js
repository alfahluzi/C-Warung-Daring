const express = require("express");
const { urlencoded } = require("express");
const { dirname } = require("path");
const app = express();
const bcrypt = require("bcrypt");
const sessions = require("express-session");
const ejs = require("ejs");

ejs.delimiter = "?";

app.use(
  sessions({
    secret: "inirahasiabanget",
    saveUninitialized: true,
    resave: true,
  })
);
app.use(express.json());
app.use(express.static("public"));
app.use(urlencoded(express.urlencoded({ extended: false })));
app.use("/css", express.static("node_modules/bootstrap/dist/css"));
app.use("/js", express.static("node_modules/bootstrap/dist/js"));
app.use("/js", express.static("node_modules/jquery/dist"));
app.set("views", "./views");
app.set("view engine", "ejs");

// routes
const home_r = require("./routes/home");
const auth_r = require("./routes/auth");
const checkout_r = require("./routes/checkout");
const details_r = require("./routes/details");
const keranjang_r = require("./routes/keranjang");
app.use("/", home_r);
app.use("/", auth_r);
app.use("/", checkout_r);
app.use("/", details_r);
app.use("/", keranjang_r);

const transaksiAdmin_r = require("./routes/transaksiAdmin");
const kelolaBarangAdmin_r = require("./routes/kelolaBarangAdmin");
const laporanAdmin_r = require("./routes/laporanAdmin");

app.use("/", transaksiAdmin_r);
app.use("/", kelolaBarangAdmin_r);
app.use("/", laporanAdmin_r);

// post route func ----------------------------
app.post("/tambah", (req, res) => {
  res.render("");
});

// api route func ----------------------------
let users = [];
app.get("/testget", (req, res) => {
  res.json(users);
});
app.post("/testpost", async (req, res) => {
  try {
    const salt = await bcrypt.genSalt();
    const hashPass = await bcrypt.hash(req.body.password, salt);
    const a = { name: req.body.name, password: hashPass };
    users.push(a);
    res.status(201).send();
  } catch (error) {
    res.status(500);
  }
});

let port = 3000;
app.listen(port, () => {
  console.log("Server running on port: " + port);
});
