const apiRouter = require("express").Router();
const { categoriesRouter } = require("./categories-router");
const { usersRouter } = require("./users-router");
const { commentsRouter } = require("./comments-router");
const { reviewsRouter } = require("./reviews-router");
const { getEndpoints } = require("../controllers/index");
const { methodNotAllowed } = require("../error-middleware");

apiRouter.route("/").get(getEndpoints).all(methodNotAllowed);

apiRouter.use("/categories", categoriesRouter);
apiRouter.use("/users", usersRouter);
apiRouter.use("/reviews", reviewsRouter);
apiRouter.use("/comments", commentsRouter);

module.exports = apiRouter;
