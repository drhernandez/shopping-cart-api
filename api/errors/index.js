const ApiError = require('./apiError');
const InternalError = require('./internalError');
const NotFoundError = require('./notFoundError');
const UnauthorizedError = require('./unauthorizedError');
const BadRequestError = require('./badRequestError');

module.exports = {
  ApiError,
  InternalError,
  NotFoundError,
  UnauthorizedError,
  BadRequestError
}