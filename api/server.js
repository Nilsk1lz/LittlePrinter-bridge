const express = require("express");
const path = require("path");
const app = express();
const bodyParser = require("body-parser");
const passport = require("passport");

// Setup Logging
var winston = require("winston");
var expressWinston = require("express-winston");
var { Loggly } = require("winston-loggly-bulk");

const logger = winston.createLogger({
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.splat(),
        winston.format.simple()
      ),
    }),
  ],
});

app.use(
  expressWinston.logger({
    transports: [
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.colorize(),
          winston.format.splat(),
          winston.format.simple()
        ),
      }),
    ],
  })
);

// Set global root directory var
global.appRoot = path.resolve(__dirname);

const port = 3080;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "../my-app/build")));

const router = require("./src/api/router")(app);
const printerManager = require("./src/printer/manager");

app.listen(port, () => {
  logger.log({
    level: "info",
    message: `Server listening on the port::${port}`,
  });
});
