const endpoints = require("../../endpoints.json");

exports.getEndpoints = (req, res, next) => {
  res.setHeader("Content-Type", "application/json");
  res.status(200).send(JSON.stringify(endpoints));
};

exports.getWelcomeMessage = (req, res, next) => {
  res.status(200).send({
    message:
      "Welcome to nc-games, visit /api for information on how to interact with this api",
  });
};
