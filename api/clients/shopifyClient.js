import BaseClient from './baseClient';

export default class ProductsClient {
  constructor() {
    this.client = new BaseClient('https://7d2c8bd2c922f1be3bc7806e3f89a68a:af3acc3b4f168d2740bd7c1dc3ea1b70@thirdlove-uat2.myshopify.com/admin');
  }

  async getProductById(productId) {
    const response = await this.client.get(`/products/${productId}.json`);
    return response.data;
  }
}