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

exports.getCommentById = (comment_id) => {
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
        return result;
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
