const expressRouter = require('express');
const { createLogger } = require('../utils/loggerFactory');
const { getRequestLoggerMiddleware } = require('../middlewares');
const logger = createLogger(__filename);
const { AuthenticationController } = require('../controllers')

class AuthenticationRouter {
  constructor() {
    this.router = expressRouter.Router();
    this.addRoutes();
  }

  addRoutes() {
    this.router.post('/login', getRequestLoggerMiddleware(logger, false), AuthenticationController.login);
  }
}

const authenticationRouter = new AuthenticationRouter();
module.exports = authenticationRouter.router;