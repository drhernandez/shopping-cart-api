const logger = require('../utils/loggerFactory').createLogger(__filename);
const to = require('await-to-js').default;
const db = require('../db/models');
const { ApiError, InternalError, NotFoundError, BadRequestError } = require('../errors');
const UsersService = require('./usersService');
const { shopifyClient } = require('../clients');

class CartsService {
  
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

    //validate products
    const variantsMap = new Map();
    const duplicates = [];
    ////check duplicated variants
    body.cart_items.forEach(cartItem => !variantsMap.has(cartItem.variant_id) ? variantsMap.set(cartItem.variant_id, 1) : variantsMap.set(cartItem.variant_id, variantsMap.get(cartItem.variant_id) + 1));
    variantsMap.forEach((value, key) => value > 1 ? duplicates.push(key) : null);
    if (duplicates.length > 0) {
      throw new BadRequestError('Could not create cart', [`duplicated variant ids: ${duplicates}`])
    }
    ////get variants from api
    const getVariantPromises = [];
    body.cart_items.forEach(cart_item => {
      getVariantPromises.push(shopifyClient.getVariantById(cart_item.variant_id));
    });
    
    [err] = await to(Promise.all(getVariantPromises));
    if (err != null) {
      logger.error(`[message: Error trying to get variants] [error: ${JSON.stringify(err)}]`);
      throw new ApiError(err.status, 'Could not create cart', [err.message]);
    }
    
    //save order on db
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
}

module.exports = CartsService;