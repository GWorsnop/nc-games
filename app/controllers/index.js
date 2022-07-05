const { getCategories } = require("./categories-controller");
const { getReviewById, patchReviewVotes } = require("./reviews-controller");
const { getUsers } = require("./users-controller");
const { getComments } = require("./comments-controller");

module.exports = {
  getCategories,
  getReviewById,
  patchReviewVotes,
  getUsers,
  getComments,
};
