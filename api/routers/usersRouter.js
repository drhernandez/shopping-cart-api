const expressRouter = require('express');
const { createLogger, getRequestLoggerMiddleware } = require('../utils/loggerFactory');
const logger = createLogger(__filename);
const { usersController } = require('../controllers')

class UsersRouter {
  constructor() {
    this.router = expressRouter.Router();
    this.addRoutes();
  }

  getRouter() {
    return this.router;
  }

  addRoutes() {
    this.router.post('/', getRequestLoggerMiddleware(logger), usersController.createUser);
  }
}

const usersRouter = new UsersRouter();
module.exports = usersRouter.router;