const axios = require('axios');
const logger = require('../utils/loggerFactory').createLogger(__filename);
const to = require('await-to-js').default;
const { ApiError, InternalError } = require('../errors');

class BaseClient {
  constructor(baseURL) {
    this.restClient = axios.create({
      baseURL: baseURL,
      timeout: 1500
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
  logger.info(`[message: Executing request] [method: ${method}] [url: ${restClient.defaults.baseURL}${url}] [body: ${body}]`);
  const [err, response] = await to(restClient.request({ method: method, url: url, headers: headers, data: body }));
  if (err) {
    return _parseErrorResponse(err);
  }
  return response;
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
    logger.error(`[message: Invalid response executing request] [request: ${JSON.stringify(request)}] [response: ${JSON.stringify(response)}]`);
    const data = JSON.stringify(response.data);
    return new ApiError(response.status, data);
  }
  else if (error.request) {
    const request = {
      'url': error.config.url,
      'method': error.config.method
    };
    logger.error(`[message: Error executing request] [request: ${JSON.stringify(request)}] [error: ${error.message}]`);
    return new InternalError(error.message);
  }
  else {
    logger.error(`[message: Unexpected error] [error: ${error.message}]`);
    return new InternalError(error.message);
  }
}

module.exports = BaseClient;

