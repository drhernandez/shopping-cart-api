const ApiError = require('./apiError');

class BadRequestError extends ApiError {
  constructor(message, causes) {
    super(400, message || 'Bad request', causes || []);
  }
}

module.exports = BadRequestError;