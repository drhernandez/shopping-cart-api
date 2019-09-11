// const logger = require('../utils/loggerFactory').createLogger(__filename);
// const BaseClient = require('./baseClient');
const fetch = require('node-fetch');
// const { ApiError, InternalError, BadRequestError, NotFoundError } = require('../errors');

class ShopifyClient {
  constructor() {
    this.baseUrl = 'https://7d2c8bd2c922f1be3bc7806e3f89a68a:af3acc3b4f168d2740bd7c1dc3ea1b70@thirdlove-uat2.myshopify.com/admin';
    // this.client = new BaseClient('https://7d2c8bd2c922f1be3bc7806e3f89a68a:af3acc3b4f168d2740bd7c1dc3ea1b70@thirdlove-uat2.myshopify.com/admin');
    // this.client = new BaseClient('http://localhost:9999');
  }

  async getVariantById(variantId) {
    // const response = await this.client.get(`/variants/${variantId}.json`);
    const response = await fetch(`${this.baseUrl}/variants/${variantId}.json`)
    const json = await response.json();
    // .then(res => res.json())
    // .then(json => json)
    // .catch(err => console.log(err));

    // if (response instanceof ApiError) {
    //   logger.error(`[message: Error getting variant ${variantId}] [error: ${JSON.stringify(response)}]`);
    //   switch(response.status) {
    //     case 400: {
    //       throw new BadRequestError(`Invalid variant id ${variantId}`);
    //     }
    //     case 404: {
    //       throw new NotFoundError(`Variant id ${variantId} not found`);
    //     }
    //     case 500: {
    //       throw new InternalError(`Error getting variant ${variantId}`)
    //     }
    //   }
    //   throw response;
    // }
    return json;
  }

  async createOrder(userEmail, cartItems) {
    const lineItems = cartItems.map(item => { return { variant_id: item.variant_id, quantity: item.quantity }});
    const body = {
      order: {
        email: userEmail,
        line_items: lineItems
      }
    }
    
    const response = await fetch(`${this.baseUrl}/orders.json`, {
      method: 'post',
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' },
    })
    const json = await response.json();
    // const response = await this.client.post('/orders.json', body);
    // if (response instanceof ApiError) {
    //   logger.error(`[message: Error executing request create order] [error: ${JSON.stringify(response)}]`);
    //   throw response;
    // }
    return json.order;
  }
}

module.exports = ShopifyClient;