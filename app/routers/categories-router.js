const categoriesRouter = require("express").Router();
const {
  getCategories,
  getCategoryByQuery,
} = require("../controllers/categories-controller");
const { methodNotAllowed } = require("../error-middleware");

categoriesRouter.route("/").get(getCategories).all(methodNotAllowed);

module.exports = { categoriesRouter };
