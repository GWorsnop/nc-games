const commentsRouter = require("express").Router();
const {
  deleteComment,
  patchComment,
} = require("../controllers/comments-controller");
const { methodNotAllowed } = require("../error-middleware");

commentsRouter
  .route("/:comment_id")
  .delete(deleteComment)
  .patch(patchComment)
  .all(methodNotAllowed);

module.exports = { commentsRouter };
