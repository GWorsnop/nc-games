const { getCategories } = require("./categories-controller");
const { getReviewById, patchReviewVotes } = require("./reviews-controller");

module.exports = { getCategories, getReviewById, patchReviewVotes };
