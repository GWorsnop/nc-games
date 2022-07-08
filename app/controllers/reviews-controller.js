const {
  selectReviewById,
  updateReviewVotes,
  selectReviews,
  insertReview,
  removeReview,
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
  selectReviews(req.query)
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

exports.deleteReview = (req, res, next) => {
  const { review_id } = req.params;
  return selectReviewById(review_id)
    .then((checkedReview) => {
      removeReview(review_id).then(() => {
        res.status(204).send();
      });
    })
    .catch((err) => {
      next(err);
    });
};
