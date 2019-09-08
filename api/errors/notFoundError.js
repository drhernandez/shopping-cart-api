const ApiError = require('./apiError');

class NotFoundError extends ApiError {
  constructor(message, causes) {
    super(404, message || 'Not found', causes || []);
  }
}

module.exports = NotFoundError;