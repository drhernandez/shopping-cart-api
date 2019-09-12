const logger = require('../utils/loggerFactory').createLogger(__filename);
const to = require('await-to-js').default;
var snakeCaseKeys = require('snakecase-keys');
const { Response } = require('../models');
const { ApiError, InternalError, BadRequestError, NotFoundError } = require('../errors');
const { CartsService } = require('../services');

class CartsController {
  
  static async getCartById(req, res) {
    
    const cartId = req.params.cart_id;
    let response = {};

    if (isNaN(cartId)) {
      logger.error(`[message: Error creating a cart] [error: invalid body] [causes: cart id ${cartId} is not a number]`)
      response = new Response(400, new BadRequestError('invalid body', [`causes: cart id ${cartId } is not a number`]));
    } else {
      const [err, cart] = await to(CartsService.getCartById(cartId));
      if (err && err instanceof ApiError) {
        logger.error(`[message: Error getting cart] [error: ${JSON.stringify(err)}]`);
        response = new Response(err.status, err);
      } else if (err) {
        logger.error(`[message: Error getting cart] [error: ${err.message}]`);
        response = new Response(500, new InternalError());
      } else if (!cart) {
        response = new Response(404, new NotFoundError());
      } else {
        const body = cart.toJSON();
        delete body.buyer.password;
        response = new Response(200, body);
      }
    }

    res.status(response.status).json(snakeCaseKeys(response.body));
  }

  static async createCart(req, res) {

    let causes = [];
    let response = {};

    if (!req.body.buyer_email) {
      causes.push('missing buyer email');
    }
    if (req.body.cart_items === undefined) {
      causes.push('missing cart_items');
    }
    if (!Array.isArray(req.body.cart_items) || req.body.cart_items.length === 0) {
      causes.push('cart_items must be an array and must have at least one item')
    } else if (req.body.cart_items) {
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
      logger.error(`[message: Error creating a cart] [error: invalid body] [causes: ${JSON.stringify(causes)}]`)
      response = new Response(400, new BadRequestError('invalid body', causes));
    } else {

      const [err, cart] = await to(CartsService.createCart(req.body));
      if (err && err instanceof ApiError) {
        logger.error(`[message: Error creating a new cart] [error: ${JSON.stringify(err)}]`);
        response = new Response(err.status, err);
      } else if (err) {
        logger.error(`[message: Error creating a new cart] [error: ${err.message}]`);
        response = new Response(500, new InternalError());
      } else {
        response = new Response(201, cart);
      }
    }

    res.status(response.status).json(snakeCaseKeys(response.body));
  }

  static async updateCart(req, res) {
    
    const cartId = req.params.cart_id;
    let causes = [];
    let response = {};

    if (isNaN(cartId)) {
      causes.push(`cart id ${cartId} is not a number`);
    }
    if (!req.body.cart_items) {
      causes.push('missing cart_items');
    }
    if (!Array.isArray(req.body.cart_items) || req.body.cart_items.length === 0) {
      causes.push('cart_items must be an array and must have at least one item')
    } else if (req.body.cart_items){
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
      logger.error(`[message: Error updating cart ${cartId}] [error: invalid body] [causes: ${JSON.stringify(causes)}]`)
      response = new Response(400, new BadRequestError('invalid body', causes));
    } else {

      const [err, cart] = await to(CartsService.updateCart(cartId, req.body));
      if (err && err instanceof ApiError) {
        logger.error(`[message: Error updating cart ${cartId}] [error: ${JSON.stringify(err)}]`);
        response = new Response(err.status, err);
      } else if (err) {
        logger.error(`[message: Error updating cart ${cartId}] [error: ${err.message}]`);
        response = new Response(500, new InternalError());
      } else {
        delete cart.buyer.password;
        response = new Response(200, cart);
      }
    }

    res.status(response.status).json(snakeCaseKeys(response.body));
  }

  static async deleteCart(req, res) {
    
    const cartId = req.params.cart_id;
    let response = {};

    if (isNaN(cartId)) {
      logger.error(`[message: Error creating a cart] [error: invalid body] [causes: cart id ${cartId} is not a number]`)
      response = new Response(400, new BadRequestError('invalid body', [`causes: cart id ${cartId} is not a number`]));
    } else {
      const [err] = await to(CartsService.deleteCartById(cartId));
      if (err && err instanceof ApiError) {
        logger.error(`[message: Error deleting cart] [error: ${JSON.stringify(err)}]`);
        response = new Response(err.status, err);
      } else if (err) {
        logger.error(`[message: Error deleting cart] [error: ${err.message}]`);
        response = new Response(500, new InternalError());
      } else {
        response = new Response(204);
      }
    }

    res.status(response.status).json(response.body ? snakeCaseKeys(response.body) : response.body);
  }
}

module.exports = CartsController;