const BaseClient = require('./baseClient');
const to = require('await-to-js').default;
const { ApiError } = require('../errors');

class ShopifyClient {
  constructor() {
    this.baseUrl = 'https://7d2c8bd2c922f1be3bc7806e3f89a68a:af3acc3b4f168d2740bd7c1dc3ea1b70@thirdlove-uat2.myshopify.com/admin';
    // this.baseUrl = 'http://localhost:9999';
    this.client = new BaseClient({ timeout: 1000 });
  }

  async getVariantById(variantId) {
    const [err, response] = await to(this.client.get(`${this.baseUrl}/variants/${variantId}.json`));
    if (err) {
      throw err;
    } else if (!response.ok) {
      const json = await response.json();
      throw new ApiError(response.status, 'Could not get variants', Object.entries(json))
    } else {
      const json = await response.json();
      return json.variant;
    }
  }

  async createOrder(userEmail, cartItems) {
    const lineItems = cartItems.map(item => { return { variant_id: item.variant_id, quantity: item.quantity }});
    const body = {
      order: {
        email: userEmail,
        line_items: lineItems
      }
    }

    const [err, response] = await to(this.client.post(`${this.baseUrl}/orders.json`, {}, body));
    if (err) {
      throw err;
    } else if (!response.ok) {
      const json = await response.json();
      throw new ApiError(response.status, 'Could not get variants', Object.entries(json))
    } else {
      const json = await response.json();
      return json.order;
    }
  }
}

module.exports = ShopifyClient;