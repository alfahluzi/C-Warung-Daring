const express = require("express");
const { urlencoded } = require("express");
const app = express();

app.use(express.static("public"));
app.use(urlencoded(express.urlencoded({ extended: false })));
app.set("views", "./views");
app.set("view engine", "ejs");

// const Pool = require("pg").Pool;
// const pool = new Pool({
//   user: "admin",
//   host: "194.233.91.96",
//   database: "perpustakaan",
//   password: "admin",
//   port: 3333,
// });

app.get("/", (req, res) => {
  //   pool.query("select * from app.buku", (error, result) => {
  //     if (error) {
  //       throw error;
  //     }
  //   });
  res.render("index", { daftarBuku: "" });
});

// app.get("/prepare-buku", (req, res) => {
//   res.render("tambah_buku");
// });

app.post("/tambah", (req, res) => {
  //   pool.query(
  //     "insert into app.buku (nama_buku) values($1)",
  //     [req.body.nama_buku],
  //     (error, result) => {
  //       if (error) throw error;

  //       res.redirect("/");
  //     }
  //   );
  res.render("");
});

let port = 3000;
app.listen(port, () => {
  console.log("Server running on port: " + port);
});
