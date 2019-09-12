const logger = require('../utils/loggerFactory').createLogger(__filename);
const { SecurityService } = require('../services');
const { UnauthorizedError } = require('../errors');

/**
 * 
 * Search and validate the header "authorization: Bearer <access_token>"
 * 
 * @param {Request} req 
 * @param {Response} res 
 * @param {Callback} next 
 */
function validateAuthentication() {

  return (req, res, next) => {
    const authenticationHeader = req.headers.authorization;

    //get header
    if (!authenticationHeader) {
      logger.info('[message: Unauthorized error] [error: missing authorization header]');
      res.status(401).json(new UnauthorizedError());
      return;
    }

    //get token from header
    const splitedHeader = authenticationHeader.split(' ');
    if (splitedHeader.length !== 2) {
      logger.info('[message: Unauthorized error] [error: invalid header]');
      res.status(401).json(new UnauthorizedError());
      return;
    }

    //validate token
    let userInfo;
    const token = splitedHeader[1].trim();
    try {
      userInfo = SecurityService.verifyToken(token);
      req.body.user = userInfo;
    } catch (err) {
      res.status(401).json(new UnauthorizedError());
      return;
    }

    next();
  };
}

function getRequestLoggerMiddleware(logger, verbose = true) {
  return (req, res, next) => {
    let message = `[method: ${req.method}] [url: ${req.originalUrl}]`;
    if (verbose) {
      message += `[params: ${JSON.stringify(req.params)}] [body: ${JSON.stringify(req.body)}]`;
    }
    logger.info(message);
    next();
  };
}

module.exports = {
  validateAuthentication,
  getRequestLoggerMiddleware
}