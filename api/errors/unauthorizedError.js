const ApiError = require('./apiError');

class Unauthorized extends ApiError {
  constructor(message, causes) {
    super(401, message || 'Unauthorized', causes || []);
  }
}

module.exports = Unauthorized;