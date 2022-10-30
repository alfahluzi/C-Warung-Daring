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
    resave: false,
  })
);
app.use(express.json());
app.use(express.static("public"));
app.use(urlencoded(express.urlencoded({ extended: false })));
app.use(express.json());
app.use("/css", express.static("node_modules/bootstrap/dist/css"));
app.use("/js", express.static("node_modules/bootstrap/dist/js"));
app.use("/js", express.static("node_modules/jquery/dist"));
app.set("views", "./views");
app.set("view engine", "ejs");

var session;
module.exports = session;

// routes
const home_r = require("./routes/home");
app.use("/", home_r);

const auth_r = require("./routes/auth");
app.use("/", auth_r);

const checkout_r = require("./routes/checkout");
app.use("/", checkout_r);

const details_r = require("./routes/details");
app.use("/", details_r);

const keranjang_r = require("./routes/keranjang");
app.use("/", keranjang_r);

const dahsboardAdmin_r = require("./routes/dashboardAdmin");
app.use("/", dahsboardAdmin_r);

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
