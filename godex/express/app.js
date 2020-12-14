const express = require("express");
const bodyParser = require("body-parser");
const createError = require("http-errors");
const cors = require("cors");
const logger = require("morgan");

const app = express();

const development = process.env.NODE_ENV !== "production";

app.use(cors());
app.use(logger("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(require("./routes"));

// catch 404 and forward to error handler
app.use((_req, _res, next) => {
  next(createError(404));
});

// production error handler
// no stacktraces leaked to user
app.use((err, req, res, _next) => {
  res.status(err.status || 500);
  res.json({ error: err.message });
});

const server = app.listen(process.env.PORT ?? 3000, () => {
  console.log(`Listening on port ${server.address().port}`);
});
