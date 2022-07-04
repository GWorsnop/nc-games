const { getCategories } = require("./categories-controller");
const { getReviewById } = require("./reviews-controller");
const { getUsers } = require("./users-controller");

module.exports = { getCategories, getReviewById, getUsers };
