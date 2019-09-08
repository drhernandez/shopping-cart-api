const logger = require('../utils/loggerFactory').createLogger(__filename);
const to = require('await-to-js').default;
const { Response } = require('../models');
const { ApiError, InternalError, BadRequestError } = require('../errors');
const { CartsService } = require('../services');

class CartsController {
  
  async getCartById(req, res) {
    res.status(200).json({});
  }

  async createCart(req, res) {

    let causes = [];
    let response = {};

    if (!req.body.buyer_email) {
      causes.push('missing buyer email');
    }
    if (!req.body.cart_items) {
      causes.push('missing cart_items');
    }
    if (!req.body.cart_items.length) {
      causes.push('cart_items must be an array and must have at least one item')
    } else {
      req.body.cart_items.forEach(item => {
        if (item.variant_id == undefined) {
          causes.push(`missing variant_id on cart_item: ${JSON.stringify(item)}`);
        }
        if (item.quantity == undefined) {
          causes.push(`missing quantity on cart_item: ${JSON.stringify(item)}`);
        }
        if (isNaN(item.quantity) || item.quantity < 0) {
          causes.push(`quantity must be a positive number on item: ${JSON.stringify(item)}`);
        }
      });
    }

    if (causes.length > 0) {
      logger.error(`[message: Error trying to create a cart] [error: invalid body] [causes: ${JSON.stringify(causes)}]`)
      response = new Response(400, new BadRequestError('invalid body', causes));
    } else {

      const [err, cart] = await to(CartsService.createCart(req.body));
      if (err && err instanceof ApiError) {
        logger.error(`[message: Error trying to create a new cart] [error: ${JSON.stringify(err)}]`);
        response = new Response(err.status, err);
      } else if (err) {
        logger.error(`[message: Error trying to create a new cart] [error: ${err.message}]`);
        response = new Response(500, new InternalError());
      } else {
        response = new Response(201, cart);
      }
    }

    res.status(response.status).json(response.body);
  }

  async updateCart(req, res) {
    res.status(200).send('updated');
  }

  async deleteCart(req, res) {
    res.status(204).end();
  }
}

module.exports = CartsController;