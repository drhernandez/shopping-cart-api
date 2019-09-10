const expressRouter = require('express');
const { createLogger } = require('../utils/loggerFactory');
const logger = createLogger(__filename);
const { validateAuthentication, getRequestLoggerMiddleware } = require('../middlewares');
const { checkoutController } = require('../controllers')

class CheckoutRouter {
  constructor() {
    this.router = expressRouter.Router();
    this.addRoutes();
  }

  addRoutes() {
    this.router.post('/', getRequestLoggerMiddleware(logger), validateAuthentication(), checkoutController.checkout);
  }
}

const checkoutRouter = new CheckoutRouter();
module.exports = checkoutRouter.router;