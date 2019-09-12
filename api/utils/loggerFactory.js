const winston = require('winston');
var pjson = require('../../package.json');

function createLogger(name) {
  const fileName = name.split('/').slice(-1);
  return winston.createLogger({
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.printf((info) => {
        return `[${info.timestamp}] - [${info.level}] - [${fileName}]: ${info.message}`;
      })
    ),
    transports: [
      new winston.transports.Console(),
      new winston.transports.File({ filename: `./logs/${pjson.name}/logs.log` })
    ]
  });
}

module.exports = {
  createLogger
}