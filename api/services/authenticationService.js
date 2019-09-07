const logger = require('../utils/loggerFactory').createLogger(__filename);
const to = require('await-to-js').default;
const { InternalError, UnauthorizedError } = require('../errors');
// const { UsersService, SecurityService } = require('./index');
const UsersService = require('./usersService');
const SecurityService = require('./securityService');

class AuthenticationService {

  static async authenticate(email, password) {

    const [err, user] = await to(UsersService.getUser(email));
    if (err) {
      logger.error(`[message: Error trying to authenticate user] [error: ${JSON.stringify(err)}]`);
      throw new InternalError();
    }
    if (!user || !SecurityService.comparePasswords(password, user.dataValues.password)) {
      throw new UnauthorizedError();
    }

    //generates token
    const token = 'sarasa';
    return token;
  }
}

module.exports = AuthenticationService;