const expressRouter = require('express');
const { createLogger } = require('../utils/loggerFactory');
const { getRequestLoggerMiddleware } = require('../middlewares');
const logger = createLogger(__filename);
const { usersController } = require('../controllers')

class UsersRouter {
  constructor() {
    this.router = expressRouter.Router();
    this.addRoutes();
  }

  addRoutes() {
    this.router.post('/', getRequestLoggerMiddleware(logger), usersController.createUser);
  }
}

const usersRouter = new UsersRouter();
module.exports = usersRouter.router;