const connection = require("../../db/connection");

exports.selectCategories = () => {
  return connection.query("SELECT * FROM categories").then((result) => {
    return result.rows;
  });
};

exports.selectCategoryByQuery = (category) => {
  return connection
    .query(
      `
SELECT * FROM categories
WHERE slug = $1
`,
      [category]
    )
    .then((result) => {
      return result.rows;
    });
};
