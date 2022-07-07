const {
  selectReviewById,
  updateReviewVotes,
  selectReviews,
  insertReview,
} = require("../models/reviews-model");

exports.getReviewById = (req, res, next) => {
  const { review_id } = req.params;
  selectReviewById(review_id)
    .then((selectedReview) => {
      res.status(200).send({ review: selectedReview });
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchReviewVotes = (req, res, next) => {
  const { inc_votes } = req.body;
  const { review_id } = req.params;
  if (inc_votes === undefined) {
    selectReviewById(review_id).then((selectedReview) => {
      res.status(400).send({
        review: selectedReview,
        errorMessage: "Bad Request - Please provide inc_votes in request",
      });
    });
  } else
    updateReviewVotes(inc_votes, review_id)
      .then((review) => {
        res.status(200).send({ review });
      })
      .catch((err) => {
        next(err);
      });
};

exports.getReviews = (req, res, next) => {
  const { sort_by, order, category, limit } = req.query;
  const queryLength = Object.keys(sort_by, order, category, limit).length;
  if (queryLength > 0) {
    selectReviews(query)
      .then((reviews) => {
        res.status(200).send({ reviews });
      })
      .catch((err) => {
        console.log(err);
        next(err);
      });
  } else
    selectReviews()
      .then((reviews) => {
        res.status(200).send({ reviews });
      })
      .catch((err) => {
        next(err);
      });
};

exports.postReview = (req, res, next) => {
  const newReview = req.body;
  insertReview(newReview)
    .then((createdReview) => {
      res.status(201).send({ review: createdReview });
    })
    .catch((err) => {
      next(err);
    });
};
