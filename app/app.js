const express = require("express");
const { getCategories, getReviewById } = require("./controllers/index");
const app = express();

app.use(express.json());

app.get("/api/categories", getCategories);
app.get("/api/reviews/:review_id", getReviewById);

app.use("*", (req, res) => {
  res.status(404).send({ message: "Path not found" });
});

app.use((err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ message: err.errorMessage });
  } else next(err);
});

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send({ message: "Something went wrong" });
});

module.exports = app;
