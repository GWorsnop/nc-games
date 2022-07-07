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

exports.selectReviews = (query = { sort_by: "created_at" }) => {
  let methods = ["sort_by", "order", "category"];
  let searchSort_by = "created_at";
  let searchOrder = "DESC";
  let whereStr = "";
  const queryArr = [];
  if ("sort_by" in query) {
    const sort_by = query.sort_by;
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
    searchSort_by = sortByOptions.find(
      (elem) => elem.toLowerCase() === sort_by
    );
    if (!sortByOptions.includes(sort_by)) {
      return Promise.reject({
        status: 400,
        errorMessage: "Bad request, incorrect sort_by",
      });
    }
  }
  if ("order" in query) {
    const order = query.order;
    let orderOptions = ["asc", "desc"];
    searchOrder = orderOptions.find((elem) => elem.toLowerCase() === order);
    if (!orderOptions.includes(order)) {
      return Promise.reject({
        status: 400,
        errorMessage: "Bad request, incorrect order",
      });
    }
  }
  if ("category" in query) {
    const category = query.category;
    return selectCategoryByQuery(category)
      .then((result) => {
        if (result.length > 0) {
          whereStr = `WHERE category = $1`;
          queryArr.push(category);
        }
        return connection.query(
          `
            SELECT * FROM reviews
            ${whereStr}
            ORDER BY ${searchSort_by} ${searchOrder}
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
  SELECT * FROM reviews
  ORDER BY ${searchSort_by} ${searchOrder}
  `
      )
      .then((result) => {
        return result.rows;
      });
};
