const logger = require('../utils/loggerFactory').createLogger(__filename);
const bcrypt = require('bcrypt');
const SALT_ROUNDS = 10;

class SecurityService {

  static hashPassword(plainPasssword) {
    let hash;
    try {
      hash = bcrypt.hashSync(plainPasssword, SALT_ROUNDS);
    } catch (err) {
      logger.error(`[message: Error trying to hash password] [error: ${JSON.stringify(err)}]`);
      hash = null;
    }

    return hash;
  }

  static comparePasswords(plainPassword, hashedPassword) {
    return bcrypt.compareSync(plainPassword, hashedPassword);
  }
}

module.exports = SecurityService;