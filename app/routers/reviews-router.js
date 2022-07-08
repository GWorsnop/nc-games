const reviewsRouter = require("express").Router();
const {
  getReviewById,
  patchReviewVotes,
  getReviews,
  postReview,
} = require("../controllers/reviews-controller");
const {
  getComments,
  postComment,
} = require("../controllers/comments-controller");
const { methodNotAllowed } = require("../error-middleware");

reviewsRouter.route("/").get(getReviews).post(postReview).all(methodNotAllowed);

reviewsRouter
  .route("/:review_id")
  .get(getReviewById)
  .patch(patchReviewVotes)
  .all(methodNotAllowed);

reviewsRouter
  .route("/:review_id/comments")
  .get(getComments)
  .post(postComment)
  .all(methodNotAllowed);

module.exports = { reviewsRouter };
