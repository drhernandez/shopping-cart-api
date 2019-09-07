const ApiError = require('./apiError');

class InternalError extends ApiError {
  constructor(message) {
    super(500, message || 'Internal error', null);
  }
}

module.exports = InternalError;