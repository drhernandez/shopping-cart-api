const expressRouter = require('express');
const { createLogger, getRequestLoggerMiddleware } = require('../utils/loggerFactory');
const logger = createLogger(__filename);
const { authenticationController } = require('../controllers')

class AuthenticationRouter {
  constructor() {
    this.router = expressRouter.Router();
    this.addRoutes();
  }

  addRoutes() {
    this.router.post('/login', getRequestLoggerMiddleware(logger), authenticationController.login);
    this.router.post('/logout', getRequestLoggerMiddleware(logger), authenticationController.logout);
  }
}

const authenticationRouter = new AuthenticationRouter();
module.exports = authenticationRouter.router;