const {
  selectCategories,
  selectCategoryByQuery,
} = require("../models/categories-model");

exports.getCategories = (req, res) => {
  selectCategories().then((categories) => {
    res.status(200).send({ categories });
  });
};

exports.getCategoryByQuery = (req, res) => {
  const query = req.query;
  const category = query.category;
  selectCategoryByQuery(category).then((foundCategory) => {
    res.status(200).send({ category: foundCategory });
  });
};
