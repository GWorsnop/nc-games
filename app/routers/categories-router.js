const categoriesRouter = require("express").Router();
const {
  getCategories,
  getCategoryByQuery,
  postCategory,
} = require("../controllers/categories-controller");
const { methodNotAllowed } = require("../error-middleware");

categoriesRouter
  .route("/")
  .get(getCategories)
  .post(postCategory)
  .all(methodNotAllowed);

module.exports = { categoriesRouter };
