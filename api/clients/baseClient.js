const fetch = require('node-fetch');
const logger = require('../utils/loggerFactory').createLogger(__filename);
const to = require('await-to-js').default;
const { InternalError } = require('../errors');
const mockBaseUrl = 'http://localhost:9999';

const defaultOptions = {
  method: 'GET',
  headers: {},        // request headers. format is the identical to that accepted by the Headers constructor (see below)
  body: null,         // request body. can be null, a string, a Buffer, a Blob, or a Node.js Readable stream
  timeout: 500      // req/res timeout in ms, it resets on redirect. 0 to disable (OS limit applies). Signal is recommended instead.
};

class BaseClient {
  constructor(options) {
    this.options = { ...defaultOptions, ...options};
  }

  async get(baseUrl, resource, headers) {
    return await _execute(this.options, 'get', baseUrl, resource, headers);
  }

  async post(baseUrl, resource, headers, body) {
    return await _execute(this.options, 'post', baseUrl, resource, headers, body);
  }

  async put(baseUrl, resource, headers, body) {
    return await _execute(this.options, 'put', baseUrl, resource, headers, body);
  }

  async delete(baseUrl, resource, headers) {
    return await _execute(this.options, 'delete', baseUrl, resource, headers);
  }
}

async function _execute(options, method, baseUrl, resource, headers = {}, body) {
  const url = isTestEnv() ? mockBaseUrl.concat(resource) : baseUrl.concat(resource);
  logger.info(`[message: Executing request...] [method: ${method}] [url: ${url}] [headers: ${JSON.stringify(headers)}] [body: ${JSON.stringify(body)}]`);
  const [err, response] = await to(fetch(url, { ...options, ...{ method: method, headers: headers, body: JSON.stringify(body) } }));
  if (err) {
    logger.error(`[message: Unexpected error occurred executing request] [error: ${err}]`);
    throw new InternalError(err.message);
  }

  return response;
}

module.exports = BaseClient;

function isTestEnv() {
  return process.env.NODE_ENV === 'test';
}