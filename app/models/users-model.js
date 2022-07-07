const connection = require("../../db/connection");

exports.selectUsers = () => {
  return connection.query("SELECT * FROM users").then((result) => {
    return result.rows;
  });
};

exports.selectUserByName = (username) => {
  return connection
    .query(
      `
  SELECT * FROM users
  WHERE username = $1
  `,
      [username]
    )
    .then((result) => {
      if (result.rows.length > 0) {
        return result.rows[0];
      } else {
        return Promise.reject({
          status: 404,
          errorMessage: "Not Found - username does not exist",
        });
      }
    });
};
