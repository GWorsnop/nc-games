const connection = require("../../db/connection");
const { selectCategoryByQuery } = require("../models/categories-model");

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
          errorMessage: "Not Found - review_id does not exist",
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
          errorMessage: "Not Found - review_id does not exist",
        });
      }
    });
};

exports.selectReviews = (input) => {
  const {
    sort_by = "created_at",
    order = "DESC",
    category,
    limit = 10,
    p = 1,
  } = input;
  const methods = ["sort_by", "order", "category", "limit", "p"];
  const queryArr = [];
  let whereStr = "";
  let errorFound = false;
  if (errorFound === true) {
    return res.status(400).send({ message: "Bad request, incorrect method" });
  }

  if (sort_by) {
    let sortByOptions = [
      "review_id",
      "title",
      "category",
      "designer",
      "owner",
      "review_body",
      "review_img_url",
      "created_at",
      "votes",
      "comment_count",
    ];
    if (!sortByOptions.includes(sort_by)) {
      return Promise.reject({
        status: 400,
        errorMessage: "Bad request, incorrect sort_by",
      });
    }
  }
  if (order) {
    let orderOptions = ["asc", "desc", "ASC", "DESC"];
    if (!orderOptions.includes(order)) {
      return Promise.reject({
        status: 400,
        errorMessage: "Bad request, incorrect order",
      });
    }
  }
  console.log("hello!");
  if (category) {
    return selectCategoryByQuery(category)
      .then((result) => {
        if (result.length > 0) {
          whereStr = `WHERE category = $1`;
          queryArr.push(category);
        }
        return connection.query(
          `
            SELECT *, COUNT(review_id) AS total_count
            FROM reviews
            ${whereStr}
            GROUP BY review_id
            ORDER BY ${sort_by} ${order}
            LIMIT ${limit}
            OFFSET (${p} * ${limit} - ${limit})
            `,
          queryArr
        );
      })
      .then((result) => {
        return result.rows;
      });
  } else
    return connection
      .query(
        `
        SELECT *, SELECT (COUNT(*)::INT) AS total_count
        FROM reviews
        ORDER BY ${sort_by} ${order}
        LIMIT ${limit}
        OFFSET (${p} * ${limit} - ${limit})
  `
      )
      .then((result) => {
        return result.rows;
      });
};
