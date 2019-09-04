import BaseClient from './baseClient';

export default class ProductsClient {
  constructor() {
    this.client = new BaseClient();
  }

  async getProductById(productId) {
    const response = await this.client.get(`/products/${productId}.json`);
    return response.data;
  }
}