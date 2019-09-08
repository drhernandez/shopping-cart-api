const expressRouter = require('express');
const { createLogger, getRequestLoggerMiddleware} = require('../utils/loggerFactory');
const logger = createLogger(__filename);
const { cartsController } = require('../controllers')

class CartsRouter {
  constructor() {
    this.router = expressRouter.Router();
    this.addRoutes();
  }

  addRoutes() {
    this.router.get('/:cart_id', getRequestLoggerMiddleware(logger), cartsController.getCartById);
    this.router.put('/:cart_id', getRequestLoggerMiddleware(logger), cartsController.updateCart);
    this.router.delete('/:cart_id', getRequestLoggerMiddleware(logger), cartsController.deleteCart);
    this.router.post('/', getRequestLoggerMiddleware(logger), cartsController.createCart);
  }
}

const cartsRouter = new CartsRouter();
module.exports = cartsRouter.router;