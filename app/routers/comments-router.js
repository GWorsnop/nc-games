const commentsRouter = require("express").Router();
const { deleteComment } = require("../controllers/comments-controller");
const { methodNotAllowed } = require("../error-middleware");

commentsRouter
  .route("/:comment_id")
  .delete(deleteComment)
  .all(methodNotAllowed);

module.exports = { commentsRouter };
