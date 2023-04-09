const { format } = require("date-fns");
const { v4: uuid } = require("uuid");
const path = require("path");
const fs = require("fs");
const fsPromise = require("fs").promises;

const logEvent = async (logMessage, fileName) => {
  const timeStamp = format(new Date(), "yyyy/MM/dd\t HH:mm:ss");
  const logItem = `${timeStamp}\t${uuid()}\t${logMessage}\n`;

  try {
    if (!fs.existsSync(path.join(__dirname, "..", "logs"))) {
      await fsPromise.mkdir(path.join(__dirname, "..", "logs"));
    }
    await fsPromise.appendFile(
      path.join(__dirname, "..", "logs", fileName),
      logItem
    );
  } catch (error) {
    console.log(error);
  }
};

const logger = (req, res, next) => {
  logEvent(
    `${req.method}\t${req.url} \t${req.headers.origin}`,
    "logRecord.log"
  );
  next();
};

module.exports = { logEvent, logger };
