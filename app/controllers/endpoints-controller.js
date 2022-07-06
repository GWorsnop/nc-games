const endpoints = require("../../endpoints.json");

exports.getEndpoints = (req, res, next) => {
  res.setHeader("Content-Type", "application/json");
  res.status(200).send(JSON.stringify(endpoints));
};
