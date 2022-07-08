const connection = require("../../db/connection");
const { checkType } = require("../utility/check-type");

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

exports.insertCategory = (newCategory) => {
  const { slug, description } = newCategory;
  if (slug && description) {
    return checkType(newCategory)
      .then((checkedCategory) => {
        return connection.query(
          `INSERT INTO categories
            (slug, description)
            VALUES
            ($1, $2)
            RETURNING *`,
          [slug, description]
        );
      })
      .then((result) => {
        return result.rows[0];
      });
  } else {
    return Promise.reject({
      status: 400,
      errorMessage: "Bad Request - Missing fields",
    });
  }
};
