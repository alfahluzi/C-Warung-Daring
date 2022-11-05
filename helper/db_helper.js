const mysql = require("mysql");
//database pool

var pool = mysql.createPool({
  connectTimeout: 60 * 60 * 1000,
  acquireTimeout: 60 * 60 * 1000,
  timeout: 60 * 60 * 1000,
  host: "localhost",
  user: "root",
  password: "",
  database: "warung_online", //samain sama nama database di pc
});

module.exports = pool;

function disconnectDb() {
  pool.getConnection((err, conn) => {
    conn.release();
    return true;
  });
}
 
/**
 *
 * @function getResult
 * @param {string} query - Query String.
 * @param {any} pool - Sql pool class.
 * @param {function} callback (err, rows) => {}
 */
function getDbResult(query, callback) {
  executeQuery(query, (err, rows) => {
    if (!err) {
      callback(null, rows);
    } else {
      callback(err, null);
    }
  });
}

function executeQuery(query, callback) {
  pool.getConnection((err, connection) => {
    if (err) {
      return callback("Get Connection Error. Error:" + err, null);
    } else if (connection) {
      connection.query(query, (err, rows, fields) => {
        connection.release();
        if (err) {
          return callback("Err. " + err, null);
        }
        return callback(null, rows);
      });
    } else {
      return callback(true, "No Connection");
    }
  });
}

module.exports = { getDbResult };
