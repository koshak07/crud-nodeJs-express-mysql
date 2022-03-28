const mysql = require("mysql2");
const express = require("express");
const app = express();
const urlencodedParser = express.urlencoded({ extended: false });

const pool = mysql.createPool({
  connectionLimit: 5,
  host: "localhost",
  user: "root",
  database: "userdb2",
  password: "141512Er!",
});

app.set("view engine", "hbs");

app.get("/", function (req, res) {
  pool.execute("select * from users", function (err, data) {
    if (err) return console.log(err);
    res.render("index.hbs", {
      users: data,
    });
  });
});
app.get("/create", function (req, res) {
  res.render("create.hbs");
});

app.post("/create", urlencodedParser, function (req, res) {
  if (!req.body) return res.sendStatus(400);
  const name = req.body.name;
  const age = req.body.age;
  pool.execute(
    "insert into users (name, age) values (?, ?)",
    [name, age],
    function (err, data) {
      if (err) return console.log(err);
      res.redirect("/");
    }
  );
});

app.get("/edit/:id", function (req, res) {
  const id = req.params.id;
  pool.execute(`select * from users where id=?`, [id], function (err, data) {
    if (err) return console.log(err);
    res.render("edit.hbs", {
      user: data[0],
    });
  });
});

app.post("/edit", urlencodedParser, function (req, res) {
  if (!req.body) return sendStatus(400);
  const name = req.body.name;
  const age = req.body.age;
  const id = req.body.id;

  pool.execute(
    `update users set name=?, age=? where id=?`,
    [name, age, id],
    function (err, data) {
      if (err) return console.log(err);
      res.redirect("/");
    }
  );
});

app.post("/delete/:id", function (req, res) {
  const id = req.params.id;
  pool.execute(`delete from users where id=?`, [id], function (err, data) {
    if (err) return console.log(err);
    res.redirect("/");
  });
});

app.listen(3000, function () {
  console.log("Server expect connect...");
});
