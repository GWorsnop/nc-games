const connection = require("../../db/connection");

exports.selectCategories = () => {
  return connection.query("SELECT * FROM categories").then((result) => {
    //console.log(result.rows);
    return result.rows;
  });
};
