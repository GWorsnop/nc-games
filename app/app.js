const express = require("express");
const { getWelcomeMessage } = require("./controllers/index");
const {
  notFound,
  customError,
  psqlError,
  genericError,
} = require("./error-middleware");
const apiRouter = require("./routers/api-router");
const app = express();

app.use(express.json());

app.get("/", getWelcomeMessage);
app.use("/api", apiRouter);

app.all("/*", notFound);

app.use(customError);
app.use(psqlError);
app.use(genericError);

module.exports = app;
