const connection = require("../../db/connection");

exports.selectCategories = () => {
  return connection.query("SELECT * FROM categories").then((result) => {
    return result.rows;
  });
};
