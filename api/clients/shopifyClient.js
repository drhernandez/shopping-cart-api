const logger = require('../utils/loggerFactory').createLogger(__filename);
const BaseClient = require('./baseClient');
const { ApiError, InternalError, BadRequestError, NotFoundError } = require('../errors');

class ShopifyClient {
  constructor() {
    this.client = new BaseClient('https://7d2c8bd2c922f1be3bc7806e3f89a68a:af3acc3b4f168d2740bd7c1dc3ea1b70@thirdlove-uat2.myshopify.com/admin');
  }

  async getVariantById(variantId) {
    const response = await this.client.get(`/variants/${variantId}.json`);
    if (response instanceof ApiError) {
      logger.error(`[message: Error getting variant ${variantId}] [error: ${JSON.stringify(response)}]`);
      switch(response.status) {
        case 400: {
          throw new BadRequestError(`Invalid variant id ${variantId}`);
        }
        case 404: {
          throw new NotFoundError(`Variant id ${variantId} not found`);
        }
        case 500: {
          throw new InternalError(`Error getting variant ${variantId}`)
        }
      }
      throw response;
    }
    return response.data;
  }

  async createOrder(userEmail, cartItems) {
    const body = {
      order: {
        email: userEmail,
        line_items: cartItems
      }
    }
    
    const response = await this.client.post('/orders.json', body);
    if (response instanceof ApiError) {
      logger.error(`[message: Error executing request create order] [error: ${JSON.stringify(response)}]`);
      throw response;
    }
    return response.data.order;
    // return {
    //   id: Math.floor(Math.random() * (1000000000 - 1) + 1),
    //   financial_status: 'paid',
    //   total_price: '68.00'
    // }
  }
}

module.exports = ShopifyClient;