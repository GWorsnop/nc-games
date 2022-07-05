const { getCategories } = require("./categories-controller");
const {
  getReviewById,
  patchReviewVotes,
  getReviews,
} = require("./reviews-controller");
const { getUsers } = require("./users-controller");

module.exports = {
  getCategories,
  getReviewById,
  patchReviewVotes,
  getUsers,
  getReviews,
};
