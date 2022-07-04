const connection = require("../../db/connection");

exports.selectUsers = () => {
  return connection.query("SELECT * FROM users").then((result) => {
    return result.rows;
  });
};
