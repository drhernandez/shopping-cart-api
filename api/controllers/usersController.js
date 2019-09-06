const logger = require('../utils/loggerFactory').createLogger(__filename);
const { SuccessfulResponse, ErrorResponse } = require('../models');
const { usersService } = require('../services');

class UsersController {

  createUser(req, res) {
    
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
        response = new ErrorResponse(400, 'invalid body', causes);

    } else {

      //create user
      try {
        
        user.name = req.body.name;
        user.lastName = req.body.last_name;
        user.email = req.body.email;
        user.password = req.body.password;

        const newUser = usersService.createUser(user);
        response = new SuccessfulResponse(201, newUser);
        
      } catch (err) {
        logger.error(`[message: error creating user] [error: ${err}]`)
        response = new ErrorResponse(500, 'internal error');
      }
    }

    res.status(response.status).json(response.body);
  }
}

module.exports = UsersController;