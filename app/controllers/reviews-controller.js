const {
  selectReviewById,
  updateReviewVotes,
  selectReviews,
} = require("../models/reviews-model");

exports.getReviewById = (req, res, next) => {
  const { review_id } = req.params;
  const query = req.query;
  const queryLength = Object.keys(query);
  console.log(query, "query");
  console.log(queryLength, "queryLength");
  selectReviewById(review_id)
    .then((selectedReview) => {
      res.status(200).send({ review: selectedReview });
    })
    .catch((err) => {
      next(err);
    });
};

// const query = req.query;
// const queryLength = Object.keys(query);
// if (queryLength.length > 0) {
//   selectTreasures(query)
//     .then((treasures) => {
//       res.status(200).send({ treasures });
//     })
//     .catch((err) => {
//       next(err);
//     });
// } else {
//   selectTreasures().then((treasures) => {
//     res.status(200).send({ treasures });
//   });
// }

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

exports.getReviews = (req, res) => {
  selectReviews().then((reviews) => {
    res.status(200).send({ reviews });
  });
};
