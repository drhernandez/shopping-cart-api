const logger = require('../utils/loggerFactory').createLogger(__filename);
const to = require('await-to-js').default;
const db = require('../db/models');
const { ApiError } = require('../models');

class UsersService {

  static async createUser(body) {
    
    // creo el usuario
    const [err, user] = await to(db.User.create(body));
    if (err != null && err.name === 'SequelizeUniqueConstraintError') {
      throw new ApiError(400, 'Invalid body', ['email already exist']);
    } else if(err != null) {
      logger.error(`[message: Error trying to create user] [error: ${JSON.stringify(err)}]`);
      throw new ApiError(500, 'Internal error'); 
    }
    const newUser = user.dataValues;
    delete newUser.password;

    return newUser;
  }
}

module.exports = UsersService;