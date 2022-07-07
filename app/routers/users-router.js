const usersRouter = require("express").Router();
const { getUsers, getUserByName } = require("../controllers/users-controller");
const { methodNotAllowed } = require("../error-middleware");

usersRouter.route("/").get(getUsers).all(methodNotAllowed);
usersRouter.route("/:username").get(getUserByName).all(methodNotAllowed);

module.exports = { usersRouter };
