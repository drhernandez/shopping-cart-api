const ApiError = require('./apiError');

class InternalError extends ApiError {
  constructor(message, causes) {
    super(500, message || 'Internal error', causes || []);
  }
}

module.exports = InternalError;