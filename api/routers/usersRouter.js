const expressRouter = require('express');
const { createLogger } = require('../utils/loggerFactory');
const { getRequestLoggerMiddleware } = require('../middlewares');
const logger = createLogger(__filename);
const { UsersController } = require('../controllers')

class UsersRouter {
  constructor() {
    this.router = expressRouter.Router();
    this.addRoutes();
  }

  addRoutes() {
    this.router.get('/:user_email', getRequestLoggerMiddleware(logger), UsersController.getUser);
    this.router.post('/', getRequestLoggerMiddleware(logger), UsersController.createUser);
  }
}

const usersRouter = new UsersRouter();
module.exports = usersRouter.router;