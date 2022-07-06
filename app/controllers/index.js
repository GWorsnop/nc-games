const { getCategories } = require("./categories-controller");
const {
  getReviewById,
  patchReviewVotes,
  getReviews,
} = require("./reviews-controller");
const { getUsers } = require("./users-controller");
const { getComments, postComment } = require("./comments-controller");
const { getEndpoints } = require("./endpoints-controller");
const {
  getComments,
  postComment,
  deleteComment,
} = require("./comments-controller");

module.exports = {
  getCategories,
  getReviewById,
  patchReviewVotes,
  getUsers,
  getComments,
  getReviews,
  postComment,
  deleteComment,
  getEndpoints,
};
