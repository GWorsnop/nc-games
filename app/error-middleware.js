exports.methodNotAllowed = (req, res, next) => {
  res.status(405).send({
    message: "Not Allowed - Method not allowed on this endpoint",
  });
};

exports.notFound = (req, res) => {
  res.status(404).send({ message: "Path not found" });
};

exports.customError = (err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ message: err.errorMessage });
  } else next(err);
};

exports.psqlError = (err, req, res, next) => {
  if (err.code === "22P02") {
    res
      .status(422)
      .send({ message: "Unprocessable Entity - request must be a number" });
  } else if (
    (err.code === "23503" && err.constraint === "comments_author_fkey") ||
    err.constraint === "reviews_owner_fkey"
  ) {
    res.status(400).send({ message: "Bad Request - Username does not exist" });
  } else if (
    err.code === "23503" &&
    err.constraint === "comments_review_id_fkey"
  ) {
    res.status(404).send({ message: "Not Found - review_id does not exist" });
  } else next(err);
};

exports.genericError = (err, req, res) => {
  console.log(err);
  res.status(500).send({ message: "Something went wrong" });
};
