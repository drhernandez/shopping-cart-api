const fetch = require('node-fetch');
const logger = require('../utils/loggerFactory').createLogger(__filename);
const to = require('await-to-js').default;
const { InternalError } = require('../errors');

const defaultOptions = {
  method: 'GET',
  headers: {},        // request headers. format is the identical to that accepted by the Headers constructor (see below)
  body: null,         // request body. can be null, a string, a Buffer, a Blob, or a Node.js Readable stream
  redirect: 'error',  // set to `manual` to extract redirect headers, `error` to reject redirect
  signal: null,       // pass an instance of AbortSignal to optionally abort requests
  timeout: 500,      // req/res timeout in ms, it resets on redirect. 0 to disable (OS limit applies). Signal is recommended instead.
  compress: false,    // support gzip/deflate content encoding. false to disable
  size: 0,            // maximum response body size in bytes. 0 to disable
  agent: null         // http(s).Agent instance or function that returns an instance (see below)
};

class BaseClient {
  constructor(options) {
    this.options = { ...defaultOptions, ...options};
  }

  async get(url, headers) {
    return await _execute(this.options, 'get', url, headers);
  }

  async post(url, headers, body) {
    return await _execute(this.options, 'post', url, headers, body);
  }

  async put(url, headers, body) {
    return await _execute(this.options, 'put', url, headers, body);
  }

  async delete(url, headers) {
    return await _execute(this.options, 'delete', url, headers);
  }
}

async function _execute(options, method, url, headers = {}, body) {
  logger.info(`[message: Executing request...] [method: ${method}] [url: ${url}] [headers: ${JSON.stringify(headers)}] [body: ${JSON.stringify(body)}]`);
  const [err, response] = await to(fetch(url, { ...options, ...{ method: method, headers: headers, body: JSON.stringify(body) } }));
  if (err) {
    logger.error(`[message: Unexpected error occurred executing request] [error: ${err}]`);
    throw new InternalError(err.message);
  }

  return response;
}

module.exports = BaseClient;

