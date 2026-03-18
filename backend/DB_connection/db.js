const mysql = require("mysql2/promise");

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "farmer_db",
  port: 3306,
});

db.getConnection()
  .then((conn) => {
    // console.log(" DB Connected Successfully");
    conn.release();
  })
  .catch((err) => {
    // console.log(" DB Connection Failed");
    console.error(err.message);
  });


module.exports = db;
