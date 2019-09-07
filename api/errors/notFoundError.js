const ApiError = require('./apiError');

class NotFoundError extends ApiError {
  constructor(message) {
    super(404, message || 'Not found', []);
  }
}

module.exports = NotFoundError;