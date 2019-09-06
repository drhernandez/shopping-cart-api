const axios = require('axios');
const logger = require('../utils/loggerFactory')(__filename);
const ErrorResponse = require('../models/errorResponse');

export default class BaseClient {
  constructor(baseURL) {
    this.restClient = axios.create({
      baseURL: baseURL,
      timeout: 1000
    });
  }

  async get(url, headers) {
    return await _execute(this.restClient, 'get', url, headers);
  }

  async post(url, headers, body) {
    return await _execute(this.restClient, 'post', url, headers, body);
  }

  async put(url, headers, body) {
    return await _execute(this.restClient, 'put', url, headers, body);
  }

  async delete(url, headers) {
    return await _execute(this.restClient, 'delete', url, headers);
  }
}

async function _execute(restClient, method, url, headers = {}, body) {
  try {
    return await restClient.request({
      method: method,
      url: url,
      headers: headers,
      data: body
    });
  } catch (error) {
    return _parseErrorResponse(error);
  }
}

function _parseErrorResponse(error) {
  if (error.response) {
    const request = {
      'url': error.config.url,
      'method': error.config.method
    };
    const response = {
      'status': error.response.status,
      'data': error.response.data
    };
    logger.error(`[MESSAGE: Invalid response executing request] [REQUEST: ${JSON.stringify(request)}] [RESPONSE: ${JSON.stringify(response)}]`);
    const data = JSON.parse(error.response.data);
    return new ErrorResponse(data.status = 500, data.message);
  }
  else if (error.request) {
    const request = {
      'url': error.config.url,
      'method': error.config.method
    };
    logger.error(`[MESSAGE: Error executing request] [REQUEST: ${JSON.stringify(request)}] [ERROR: ${error.message}]`);
    return new ErrorResponse(500, error.message);
  }
  else {
    logger.error(`[MESSAGE: Unexpected error] [ERROR: ${error.message}]`);
    return new ErrorResponse(500, error.message);
  }
}

