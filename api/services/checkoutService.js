const logger = require('../utils/loggerFactory').createLogger(__filename);
const to = require('await-to-js').default;
const db = require('../db/models');
const { InternalError, NotFoundError, UnauthorizedError, BadRequestError, ApiError } = require('../errors');
const CartsService = require('./cartsService');
const { shopifyClient } = require('../clients');
const { CART_STATUS } = require('../constants');

class CheckoutService {

  static async createOrder(body) {
    
    //get cart
    const cartId = body.cart_id;
    let [err, cart] = await to(db.Cart.findByPk(cartId, { include: ['buyer', 'cartItems'] }));
    if (err) {
      logger.error(`[message: Error creating order] [error: ${err}]`);
      throw new InternalError();
    }
    if (!cart) {
      logger.error(`[message: Error creating order] [error: Cart ${cartId} not found]`);
      throw new NotFoundError('Could not create order', ['cart not found']);
    }

    //validate cart owner == token owner
    if (cart.buyer.email !== body.user.email) {
      logger.error(`[message: Error creating order] [error: cart ${cartId} does not belong to user ${body.user.email}]`);
      throw new UnauthorizedError('Unauthorized', ['cart does not belong to access_token user']);
    }

    //validate inventory
    let results;
    [err, results] = await to(CartsService.getAndValidateVariants(cart.cartItems));
    if (err) {
      logger.error(`[message: Error creating order] [error: ${err}]`);
      throw new ApiError(err.status, 'Could not create order', [err.message]);
    }
    const inventoryMap = new Map();
    results.forEach(result => inventoryMap.set(result.variant.id.toString(), result.variant.inventory_quantity));
    const itemsOutOfInventory = cart.cartItems.filter(cartItem => inventoryMap.get(cartItem.variant_id) < cartItem.quantity);
    if (itemsOutOfInventory.length > 0) {
      logger.error(`[message: Error creating order] [error: items [${itemsOutOfInventory.map(item => item.variant_id)}] are out of inventory]`);
      throw new BadRequestError('Could not create order', [`items [${itemsOutOfInventory.map(item => item.variant_id)}] are out of inventory]`]);
    }

    let order;
    [err, order] = await to(shopifyClient.createOrder(cart.buyer.email, cart.cartItems));
    if (err) {
      logger.error(`[message: Error creating order] [error: ${err}]`);
      throw new InternalError('Could not create order');
    }


    const tx = await db.sequelize.transaction();
    try {
      const newOrder = await db.Order.create({ shopifyOrderId: order.id, financialStatus: order.financial_status, totalPrice: order.total_price }, { transaction: tx });
      await cart.setOrder(newOrder, { transaction: tx });
      // await CartsService.updateCart(cartId, {status: CART_STATUS.CLOSED});
      await cart.update({ status: CART_STATUS.CLOSED }, { transaction: tx })
      await tx.commit();
      return newOrder.toJSON();

    } catch (err) {
      await tx.rollback();
      logger.error(`[message: Error creating order for cart ${cartId}] [error: ${err}]`);
      throw new InternalError('Could not create order');
    }
  }

}

module.exports = CheckoutService;