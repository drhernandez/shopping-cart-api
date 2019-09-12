const logger = require('../utils/loggerFactory').createLogger(__filename);
const to = require('await-to-js').default;
const { Response } = require('../models');
const { ApiError, InternalError, BadRequestError } = require('../errors');
const { AuthenticationService } = require('../services');

class AuthenticationController {

  static async login(req, res) {

    let causes = [];
    let response = {};

    if (!req.body.email) {
      causes.push('missing email');
    }
    if (!req.body.password) {
      causes.push('missing password');
    }
    
    if (causes.length > 0) {
      logger.error(`[message: Error trying to authenticate user] [error: invalid body] [causes: ${JSON.stringify(causes)}]`)
      response = new Response(400, new BadRequestError('invalid body', causes));
    } else {
      
      const [err, token] = await to(AuthenticationService.authenticate(req.body.email, req.body.password));
      if (err && err instanceof ApiError) {
        logger.error(`[message: Error authenticating user] [error: ${JSON.stringify(err)}]`);
        response = new Response(err.status, err);
      } else if (err) {
        logger.error(`[message: Error authenticating user] [error: ${err.message}]`);
        response = new Response(500, new InternalError());
      } else {
        response = new Response(200, { 'access_token': token });
      }
    }

    res.status(response.status).json(response.body);
  }
}

module.exports = AuthenticationController