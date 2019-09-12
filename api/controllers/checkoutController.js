const logger = require('../utils/loggerFactory').createLogger(__filename);
const to = require('await-to-js').default;
const { Response } = require('../models');
const { ApiError, InternalError, BadRequestError } = require('../errors');
const { CheckoutService } = require('../services');

class CheckoutController {

  async checkout(req, res) {

    let causes = [];
    let response = {};

    if (req.body.cart_id === undefined) {
      causes.push('missing cart_id');
    }

    if (causes.length > 0) {
      logger.error(`[message: Error creating order] [error: invalid body] [causes: ${JSON.stringify(causes)}]`)
      response = new Response(400, new BadRequestError('invalid body', causes));
    } else {

      const [err, order] = await to(CheckoutService.createOrder(req.body));
      if (err && err instanceof ApiError) {
        logger.error(`[message: Error creating order] [error: ${JSON.stringify(err)}]`);
        response = new Response(err.status, err);
      } else if (err) {
        logger.error(`[message: Error creating order] [error: ${err.message}]`);
        response = new Response(500, new InternalError());
      } else {
        response = new Response(201, order);
      }
    }

    res.status(response.status).json(response.body);
  }
}

module.exports = CheckoutController;