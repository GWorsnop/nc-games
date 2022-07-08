const connection = require("../../db/connection");

exports.selectComments = (review_id, input) => {
  const { limit = 10, p = 1 } = input;
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
    const methods = ["limit", "p"];
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
      return connection
        .query(
          `
          SELECT * FROM comments
          WHERE review_id = $1
          LIMIT $2
          OFFSET $3
            `,
          [review_id, limit, offset]
        )
        .then((result) => {
          return result.rows;
        });
    }
  }
};

exports.selectCommentById = (comment_id) => {
  return connection
    .query(
      `
    SELECT * FROM comments 
    WHERE comment_id = $1
    `,
      [comment_id]
    )
    .then((result) => {
      if (result.rowCount > 0) {
        return result.rows[0];
      } else {
        return Promise.reject({
          status: 404,
          errorMessage: "Not Found - comment_id does not exist",
        });
      }
    });
};

exports.insertComment = (review_id, newComment) => {
  const { username, body } = newComment;
  if (username && body) {
    if (typeof body !== "string") {
      return Promise.reject({
        status: 422,
        errorMessage: "Unprocessable Entity - body must be a suitable review",
      });
    }
    return connection
      .query(
        `INSERT INTO comments
          (author, body, review_id)
          VALUES
          ($1, $2, $3)
          RETURNING *`,
        [username, body, review_id]
      )
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

exports.removeComment = (comment_id) => {
  return connection.query(
    `
          DELETE FROM comments 
          WHERE comment_id = $1
          `,
    [comment_id]
  );
};

exports.updateCommentVotes = (inc_votes, comment_id) => {
  return connection
    .query(
      `
      UPDATE comments 
      SET votes = votes + $1 
      WHERE comment_id = $2 
      RETURNING *
      `,
      [inc_votes, comment_id]
    )
    .then((result) => {
      if (result.rows.length > 0) {
        return result.rows[0];
      } else {
        return Promise.reject({
          status: 404,
          errorMessage: "Not Found - comment_id does not exist",
        });
      }
    });
};
