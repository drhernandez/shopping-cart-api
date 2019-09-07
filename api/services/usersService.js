const logger = require('../utils/loggerFactory').createLogger(__filename);
const to = require('await-to-js').default;
const db = require('../db/models');
const SecurityService = require('./securityService');
const { ApiError, InternalError } = require('../errors');

class UsersService {

  static async createUser(body) {

    // hash password
    body.password = SecurityService.hashPassword(body.password);
    if (!body.password) {
      throw new InternalError('Could not create user');
    }

    // creo el usuario
    const [err, user] = await to(db.User.create(body));
    if (err != null && err.name === 'SequelizeUniqueConstraintError') {
      throw new ApiError(400, 'Invalid body', ['email already exist']);
    } else if(err != null) {
      logger.error(`[message: Error trying to create user] [error: ${JSON.stringify(err)}]`);
      throw new InternalError('Could not create user');
    }
    const newUser = user.dataValues;
    delete newUser.password;

    return newUser;
  }
}

module.exports = UsersService;