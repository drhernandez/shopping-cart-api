const logger = require('../utils/loggerFactory').createLogger(__filename);

class UsersService {

  createUser(user) {
    
    logger.info(user);
    delete user.password;
    return user;
  }
}

module.exports = UsersService;