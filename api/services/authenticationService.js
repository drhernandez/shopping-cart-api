const logger = require('../utils/loggerFactory').createLogger(__filename);
const to = require('await-to-js').default;
const { InternalError, UnauthorizedError } = require('../errors');
// const { UsersService, SecurityService } = require('./index');
const UsersService = require('./usersService');
const SecurityService = require('./securityService');

class AuthenticationService {

  /**
   * Validate user's credentials and generates an access_token
   * @param {string} email
   * @param {string} password
   * 
   * @throws {UnauthorizedError} if credentials are not valid
   * @returns {string} the access_token
   */
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
    const claims = {
      'name': user.dataValues.name,
      'lastName': user.dataValues.lastName,
      'email': user.dataValues.email,
    }
    const token = SecurityService.generateToken(claims);
    SecurityService.verifyToken(token);
    return token;
  }
}

module.exports = AuthenticationService;