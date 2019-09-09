const logger = require('../utils/loggerFactory').createLogger(__filename);
const to = require('await-to-js').default;
const db = require('../db/models');
const { ApiError, InternalError, NotFoundError, BadRequestError } = require('../errors');
const UsersService = require('./usersService');
const { shopifyClient } = require('../clients');

class CartsService {

  /**
   * Get cart by id
   * @param {Number} cartId 
   */
  static async getCartById(cartId) {

    // const [err, cart] = await to(db.Cart.findByPk(cartId, { include: [{ all: true }] }));
    const [err, cart] = await to(db.Cart.findByPk(cartId));
    if (err != null) {
      logger.error(`[message: Error getting cart ${cartId}] [error: ${err}]`)
      throw new InternalError('Could not get cart');
    }
    
    return cart;
  }
  
  /**
   * Create a cart associated to the given user in body adn with its cart items
   * @param {Object} body cart info with buyer and cart_items
   */
  static async createCart(body) {
    
    //validate buyer
    let [err, user] = await to(UsersService.getUser(body.buyer_email));
    if (err != null) {
      logger.error(`[message: Error trying to get user ${body.buyer_email}] [error: ${err}]`);
      throw new InternalError('Could not create cart');
    }
    if (!user) {
      logger.error(`[message: user with email ${body.buyer_email} not found]`);
      throw new NotFoundError('Could not create cart', ['buyer not found']);
    }

    [err] = await to(getAndValidateVariants(body.cart_items));
    if (err != null) {
      logger.error(`[message: Error trying to get variants] [error: ${JSON.stringify(err)}]`);
      throw new ApiError(err.status, 'Could not create cart', [err.message]);
    }
    
    //save cart on db
    const tx = await db.sequelize.transaction();
    try {
      const cart = await db.Cart.create({ status: 'created' }, { transaction: tx });
      await cart.setBuyer(user, { transaction: tx });
      await Promise.all(body.cart_items.map(cartItem => cart.createCartItem(cartItem, { transaction: tx })));
      await tx.commit();
      // ver como mejorar el json de respuesta para que tenga el buyer y los cart items
      return cart.toJSON();
      
    } catch (err) {
      await tx.rollback();
      logger.error(`[message: Error creating cart on db] [error: ${err}]`);
      throw new InternalError('Could not create cart');
    }
  }

  /**
   * Update an existing cart. Currently you can only update cart_items and status
   * @param {Number} cartId 
   * @param {Object} body fields to update.
   */
  static async updateCart(cartId, body) {

    //get cart
    let [err, cart] = await to(this.getCartById(cartId));
    if (err != null) {
      logger.error(`[message: Error updating cart ${cartId}] [error: ${err}]`)
      throw new InternalError('Could not update cart');
    }
    if (!cart) {
      logger.error(`[message: Error updating cart ${cartId}] [error: cart not found]`)
      throw new NotFoundError('Could not update cart', ['cart not found']);
    }

    [err] = await to(getAndValidateVariants(body.cart_items));
    if (err != null) {
      logger.error(`[message: Error updating cart ${cartId}] [error: ${err}]`)
      throw new InternalError('Could not update cart', [err.message]);
    }

    //update cart
    const tx = await db.sequelize.transaction();
    try {
      const cartItems = await cart.getCartItems({ transaction: tx });
      if (body.status) {
        await cart.update({status: body.status});
      }
      await Promise.all(cartItems.map(cartItem => cartItem.destroy({ transaction: tx })));
      await Promise.all(body.cart_items.map(cartItem => cart.createCartItem(cartItem, { transaction: tx })));
      await tx.commit();
      // ver como mejorar el json de respuesta para que tenga el buyer y los cart items
      return cart.toJSON();

    } catch (err) {
      await tx.rollback();
      logger.error(`[message: Error updating cart ${cartId}, body: ${body}] [error: ${err}]`);
      throw new InternalError('Could not update cart');
    }
  }

  /**
   * Deletes a cart by id with all its cart_items
   * @param {Number} cartId 
   */
  static async deleteCartById(cartId) {
    let [err, cart] = await to(this.getCartById(cartId));
    if (err != null) {
      logger.error(`[message: Error deleting cart ${cartId}] [error: ${err}]`)
      throw new InternalError('Could not delete cart');
    }
    if (!cart) {
      logger.error(`[message: Error deleting cart ${cartId}] [error: cart not found]`)
      throw new NotFoundError('Could not delete cart', ['cart not found']);
    }

    [err] = await to(cart.destroy());
    if (err != null) {
      logger.error(`[message: Error deleting cart] [error: ${err}]`)
      throw new InternalError('Could not delete cart');
    }
  }
}

module.exports = CartsService;


async function getAndValidateVariants(cartItems) {
  const variantsMap = new Map();
  const duplicates = [];
  ////check duplicated variants
  cartItems.forEach(cartItem => !variantsMap.has(cartItem.variant_id) ? variantsMap.set(cartItem.variant_id, 1) : variantsMap.set(cartItem.variant_id, variantsMap.get(cartItem.variant_id) + 1));
  variantsMap.forEach((value, key) => value > 1 ? duplicates.push(key) : null);
  if (duplicates.length > 0) {
    throw new BadRequestError(`Duplicated variant ids: ${duplicates}`)
  }
  ////get variants from api
  const getVariantPromises = [];
  cartItems.forEach(cart_item => {
    getVariantPromises.push(shopifyClient.getVariantById(cart_item.variant_id));
  });

  const [err, results] = await to(Promise.all(getVariantPromises));
  if (err != null) {
    logger.error(`[message: Error trying to get variants] [error: ${JSON.stringify(err)}]`);
    throw new ApiError(err.status, 'Could not get variants', [err.message]);
  }

  return results;
}