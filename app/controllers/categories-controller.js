const {
  selectCategories,
  selectCategoryByQuery,
  insertCategory,
} = require("../models/categories-model");

exports.getCategories = (req, res) => {
  selectCategories().then((categories) => {
    res.status(200).send({ categories });
  });
};

exports.getCategoryByQuery = (req, res, next) => {
  const query = req.query;
  const category = query.category;
  selectCategoryByQuery(category)
    .then((foundCategory) => {
      res.status(200).send({ category: foundCategory });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postCategory = (req, res, next) => {
  const newCategory = req.body;
  insertCategory(newCategory)
    .then((createdCategory) => {
      res.status(201).send({ category: createdCategory });
    })
    .catch((err) => {
      next(err);
    });
};
