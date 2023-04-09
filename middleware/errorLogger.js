const { logEvent } = require("./logEvent");

const errorLogger = (error, req, res, next) => {
  logEvent(
    `${error.name}\t${error.message}\t${req.method}\t${req.headers.origin}\t${req.url}`,
    "errLogs.log"
  );

  const status = res.statusCode ? res.statusCode : 500; // server code

  res.status(status);

  res.json({
    message: error.message,
    // isError: true
  });
};

module.exports = errorLogger;
