const connection = require("../../db/connection");

exports.selectReviewById = (review_id) => {
  return connection
    .query(
      `
        SELECT reviews.*, COUNT(comments.body)::int AS comment_count FROM reviews
        LEFT JOIN comments ON reviews.review_id = comments.review_id
        WHERE reviews.review_id = $1
        GROUP BY reviews.review_id;
          `,
      [review_id]
    )

    .then((result) => {
      if (result.rows.length > 0) {
        return result.rows[0];
      } else {
        return Promise.reject({
          status: 404,
          errorMessage: "Bad Request - review_id does not exist",
        });
      }
    });
};

exports.updateReviewVotes = (inc_votes, review_id) => {
  return connection
    .query(
      "UPDATE reviews SET votes = votes + $1 WHERE review_id = $2 RETURNING *",
      [inc_votes, review_id]
    )
    .then((result) => {
      if (result.rows.length > 0) {
        return result.rows[0];
      } else {
        return Promise.reject({
          status: 404,
          errorMessage: "Bad Request - review_id does not exist",
        });
      }
    });
};
