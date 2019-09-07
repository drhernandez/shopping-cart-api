const logger = require('../utils/loggerFactory').createLogger(__filename);
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { UnauthorizedError } = require('../errors');
const SALT_ROUNDS = 10;

class SecurityService {

  /**
   * Hash a password with 10 rounds
   * @param {string} plainPasssword 
   * 
   * @returns {string} the hashed string
   */
  static hashPassword(plainPasssword) {
    return bcrypt.hashSync(plainPasssword, SALT_ROUNDS);
  }

  /**
   * compare a plain password with a hashed string
   * @param {string} plainPassword 
   * @param {string} hashedPassword 
   * 
   * @returns {boolean} true if the hashed string correspond with the hash of the plainPassword
   */
  static comparePasswords(plainPassword, hashedPassword) {
    return bcrypt.compareSync(plainPassword, hashedPassword);
  }

  /**
   * Generates an access_token 
   * @param {object} claims the data that will be encoded inside the access_token
   * 
   * @returns {string} the access_token generated 
   */
  static generateToken(claims) {
    return jwt.sign(claims, process.env.TOKEN_SECRET, { algorithm: 'HS512', expiresIn: '2d' });
  }

  /**
   * Verify an access_token's signature
   * @param {string} token an access_token
   * 
   * @throws {UnauthorizedError} if the token is invalid or expired
   * @returns {object} the data encoded inside the access_token
   */
  static verifyToken(token) {
    try {
      return jwt.verify(token, process.env.TOKEN_SECRET);
    } catch(err) {
      logger.error(`[message: Error trying to verify token] [error: ${err}]`);
      const causes = [];
      if (err.name === 'JsonWebTokenError') causes.push ('invalid access_token');
      if (err.name === 'TokenExpiredError') causes.push ('access_token expired');
      throw new UnauthorizedError('Unauthorized', causes);
    }
  }
}

module.exports = SecurityService;