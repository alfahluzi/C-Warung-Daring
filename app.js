const express = require("express");
const { urlencoded } = require("express");
const { dirname } = require("path");
const mysql = require("mysql");
const app = express();

app.use(express.static("public"));
app.use(urlencoded(express.urlencoded({ extended: false })));
app.set("views", "./views");
app.set("view engine", "ejs");

app.use("/css", express.static("node_modules/bootstrap/dist/css"));
app.use("/js", express.static("node_modules/bootstrap/dist/js"));
app.use("/js", express.static("node_modules/jquery/dist"));

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "warung_online", //samain sama nama database di pc
});

con.connect(function (err) {
  if (err) throw err;
  console.log("DB Connected!");
});

app.get("/", (req, res) => {
  res.render("index", { daftarBuku: "" });
});

app.post("/tambah", (req, res) => {
  res.render("");
});

let port = 3000;
app.listen(port, () => {
  console.log("Server running on port: " + port);
});
