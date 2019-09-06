const logger = require('../utils/loggerFactory').createLogger(__filename);

class CartsService {
  
  createCart(cart) {
    logger.info(cart);
  }
}


module.exports = CartsService;