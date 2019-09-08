const to = require('await-to-js').default;
const logger = require('../utils/loggerFactory').createLogger(__filename);
const { Response } = require('../models');
const { ApiError, InternalError } = require('../errors');
const { UsersService } = require('../services');

class UsersController {

  async createUser(req, res) {
    
    let causes = [];
    let user = {};
    let response = {};

    if (!req.body.name) {
      causes.push('missing user name');
    }
    if (!req.body.last_name) {
      causes.push('missing user last name');
    }
    if (!req.body.email) {
      causes.push('missing user email');
    }
    if (!req.body.password) {
      causes.push('missing user password');
    }

    if (causes.length > 0) {
      logger.error(`[message: Error trying to create user] [error: invalid body] [causes: ${JSON.stringify(causes)}]`)
      response = new Response(400, new ApiError(400, 'invalid body', causes));
    } else {
      //create user
      user.name = req.body.name;
      user.lastName = req.body.last_name;
      user.email = req.body.email;
      user.password = req.body.password;

      const [err, newUser] = await to(UsersService.createUser(user));
      if (err && err instanceof ApiError) {
        logger.error(`[message: Error creating user] [error: ${JSON.stringify(err)}]`);
        response = new Response(err.status, err);
      } else if (err) {
        logger.error(`[message: Error creating user] [error: ${err.message}]`);
        response = new Response(500, new InternalError());
      } else {
        response = new Response(201, newUser);
      }
    }

    res.status(response.status).json(response.body);
  }
}

module.exports = UsersController;