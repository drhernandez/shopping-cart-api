const expressRouter = require('express');
const { createLogger, getRequestLoggerMiddleware} = require('../utils/loggerFactory');
const logger = createLogger(__filename);
const CartsController = require('../controllers/cartsController')

class CartsRouter {
  constructor() {
    this.controller = new CartsController();
    this.router = expressRouter.Router();
    this.addRoutes();
  }

  getRouter() {
    return this.router;
  }

  addRoutes() {
    this.router.get('/:cart_id', getRequestLoggerMiddleware(logger), this.controller.getCartById);
    this.router.put('/:cart_id', getRequestLoggerMiddleware(logger), this.controller.updateCart);
    this.router.delete('/:cart_id', getRequestLoggerMiddleware(logger), this.controller.deleteCart);
    this.router.post('/', getRequestLoggerMiddleware(logger), this.controller.createCart);
  }
}

const router = new CartsRouter();
module.exports = router.getRouter();