class ApiError {
  constructor(status, message, causes) {
    this.status = status;
    this.message = message;
    this.causes = causes;
  }
}

module.exports = ApiError;