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
      console.log(result.rows);
      if (result.rows.length > 0) {
        return result.rows;
      } else {
        return Promise.reject({
          status: 404,
          errorMessage: "Bad Request - review_id does not exist",
        });
      }
    });
};
