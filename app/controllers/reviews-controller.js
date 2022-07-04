const {
  selectReviewById,
  updateReviewVotes,
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
        unchangedReview: selectedReview,
        errorMessage: "Bad Request - Please provide inc_votes in request",
      });
    });
  } else
    updateReviewVotes(inc_votes, review_id)
      .then((updatedReview) => {
        res.status(200).send({ updatedReview });
      })
      .catch((err) => {
        next(err);
      });
};
