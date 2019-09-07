const ApiError = require('./apiError');

class Unauthorized extends ApiError {
  constructor(message) {
    super(401, message || 'Unauthorized', []);
  }
}

module.exports = Unauthorized;