const { selectUsers, selectUserByName } = require("../models/users-model");

exports.getUsers = (req, res, next) => {
  selectUsers().then((users) => {
    res.status(200).send({ users });
  });
};

exports.getUserByName = (req, res, next) => {
  const { username } = req.params;
  selectUserByName(username)
    .then((user) => {
      res.status(200).send({ user });
    })
    .catch((err) => {
      next(err);
    });
};
