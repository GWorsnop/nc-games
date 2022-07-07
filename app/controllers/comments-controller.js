const {
  selectComments,
  insertComment,
  removeComment,
  selectCommentById,
  updateCommentVotes,
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
  return selectCommentById(comment_id)
    .then((result) => {
      removeComment(comment_id)
        .then(() => {
          res.status(204).send();
        })
        .catch((err) => {
          next(err);
        });
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchComment = (req, res, next) => {
  const { inc_votes } = req.body;
  const { comment_id } = req.params;
  if (inc_votes === undefined) {
    selectCommentById(comment_id).then((selectedComment) => {
      res.status(400).send({
        comment: selectedComment,
        errorMessage: "Bad Request - Please provide inc_votes in request",
      });
    });
  } else
    updateCommentVotes(inc_votes, comment_id)
      .then((comment) => {
        res.status(200).send({ comment });
      })
      .catch((err) => {
        next(err);
      });
};
