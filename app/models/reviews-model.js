const connection = require("../../db/connection");

exports.selectReviewById = (review_id) => {
  return connection
    .query(
      `
          SELECT * FROM reviews
          WHERE reviews.review_id = $1
          `,
      [review_id]
    )
    .then((result) => {
      if (result.rows.length > 0) {
        return result.rows[0];
      } else {
        return Promise.reject({
          status: 400,
          errorMessage: "Bad Request - review_id does not exist",
        });
      }
    });
};
