const connection = require("../../db/connection");
const { selectCategoryByQuery } = require("../models/categories-model");
const { checkType } = require("../utility/check-type");

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
  if (isNaN(Number(limit))) {
    return Promise.reject({
      status: 400,
      errorMessage: "Bad request, limit must be a number",
    });
  }
  if (isNaN(Number(p))) {
    return Promise.reject({
      status: 400,
      errorMessage: "Bad request, p must be a number",
    });
  } else {
    const offset = p * limit - limit;
    const methods = ["sort_by", "order", "category", "limit", "p"];
    const queryArr = [];
    let errorFound = false;
    const request = Object.keys(input);
    request.forEach((element) => {
      if (!methods.includes(element)) {
        errorFound = true;
      }
    });
    if (errorFound === true) {
      return Promise.reject({
        status: 400,
        errorMessage: "Bad request, incorrect method",
      });
    } else {
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
      if (category) {
        return selectCategoryByQuery(category)
          .then((result) => {
            if (result.length > 0) {
              queryArr.push(category);
              queryArr.push(limit, offset);
            }
            return connection.query(
              `
          SELECT *, count(*) OVER()::INT AS total_count
          FROM reviews
          WHERE category = $1
          ORDER BY ${sort_by} ${order}
          LIMIT $2
          OFFSET $3
            `,
              queryArr
            );
          })
          .then((result) => {
            return result.rows;
          });
      } else queryArr.push(limit, offset);
      return connection
        .query(
          `
        SELECT *, count(*) OVER()::INT AS total_count
        FROM reviews
        ORDER BY ${sort_by} ${order}
        LIMIT $1
        OFFSET $2
          `,
          queryArr
        )
        .then((result) => {
          return result.rows;
        });
    }
  }
};

exports.insertReview = (newReview, next) => {
  const { owner, title, review_body, designer, category } = newReview;
  if (owner && title && review_body && designer && category) {
    return checkType(newReview)
      .then((checkedReview) => {
        return connection.query(
          `INSERT INTO reviews
            (owner, title, review_body, designer, category)
            VALUES
            ($1, $2, $3, $4, $5)
            RETURNING *`,
          [owner, title, review_body, designer, category]
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
