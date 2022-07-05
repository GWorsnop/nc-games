const connection = require("../../db/connection");

exports.selectComments = (review_id) => {
  return connection
    .query(
      `
          SELECT * FROM comments
          WHERE review_id = $1
            `,
      [review_id]
    )
    .then((result) => {
      return result.rows;
    });
};
