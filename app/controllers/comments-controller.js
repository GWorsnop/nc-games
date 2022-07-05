const {
  selectComments,
  insertComment,
  removeComment,
} = require("../models/comments-model");
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

exports.postComment = async (req, res, next) => {
  try {
    const { review_id } = req.params;
    const newComment = req.body;
    const comment = await insertComment(review_id, newComment);
    await selectReviewById(review_id);
    res.status(201).send({ comment });
  } catch (err) {
    next(err);
  }
};

exports.deleteComment = (req, res, next) => {
  const { comment_id } = req.params;
  removeComment(comment_id)
    .then(() => {
      res.status(204).send();
    })
    .catch((err) => {
      next(err);
    });
};
