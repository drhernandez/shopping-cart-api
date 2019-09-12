const expressRouter = require('express');
const { createLogger } = require('../utils/loggerFactory');
const { getRequestLoggerMiddleware } = require('../middlewares');
const logger = createLogger(__filename);
const { CartsController } = require('../controllers')

class CartsRouter {
  constructor() {
    this.router = expressRouter.Router();
    this.addRoutes();
  }

  addRoutes() {
    this.router.get('/:cart_id', getRequestLoggerMiddleware(logger), CartsController.getCartById);
    this.router.put('/:cart_id', getRequestLoggerMiddleware(logger), CartsController.updateCart);
    this.router.delete('/:cart_id', getRequestLoggerMiddleware(logger), CartsController.deleteCart);
    this.router.post('/', getRequestLoggerMiddleware(logger), CartsController.createCart);
  }
}

const cartsRouter = new CartsRouter();
module.exports = cartsRouter.router;