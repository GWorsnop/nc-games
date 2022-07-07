const usersRouter = require("express").Router();
const { getUsers } = require("../controllers/users-controller");
const { methodNotAllowed } = require("../error-middleware");

usersRouter.route("/").get(getUsers).all(methodNotAllowed);

module.exports = { usersRouter };
