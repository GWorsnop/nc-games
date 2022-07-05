const { selectComments } = require("../models/comments-model");
const { selectReviewById } = require("../models/reviews-model");

exports.getComments = async (req, res, next) => {
  try {
    const { review_id } = req.params;
    const comments = await selectComments(review_id);
    await selectReviewById(review_id);
    res.status(200).send({ comments });
  } catch (err) {
    next(err);
  }
};
