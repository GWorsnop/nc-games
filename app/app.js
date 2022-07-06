const express = require("express");
const {
  getCategories,
  getReviewById,
  patchReviewVotes,
  getUsers,
  getComments,
  getReviews,
  postComment,
  getEndpoints,
} = require("./controllers/index");
const app = express();

app.use(express.json());

app.get("/api/categories", getCategories);
app.get("/api/reviews/:review_id", getReviewById);
app.patch("/api/reviews/:review_id", patchReviewVotes);
app.get("/api/users/", getUsers);
app.get("/api/reviews/:review_id/comments", getComments);
app.get("/api/reviews", getReviews);
app.post("/api/reviews/:review_id/comments", postComment);
app.get("/api", getEndpoints);

app.use("*", (req, res) => {
  res.status(404).send({ message: "Path not found" });
});

app.use((err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ message: err.errorMessage });
  } else next(err);
});

app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res
      .status(422)
      .send({ message: "Unprocessable Entity - request must be a number" });
  } else next(err);
});
app.use((err, req, res, next) => {
  if (err.code === "23503" && err.constraint === "comments_author_fkey") {
    res.status(400).send({ message: "Bad Request - Username does not exist" });
  } else if (
    err.code === "23503" &&
    err.constraint === "comments_review_id_fkey"
  ) {
    res.status(404).send({ message: "Not Found - review_id does not exist" });
  } else next(err);
});

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send({ message: "Something went wrong" });
});

module.exports = app;
