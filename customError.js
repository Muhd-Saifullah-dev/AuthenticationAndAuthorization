class AppError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
    this.message = message;
    Error.captureStackTrace(this, this.constructor);
  }
}

class validationError extends AppError {
  constructor(message, skipLogging = false) {
    super(message, 422);
  }
}

class BadRequestError extends AppError {
  constructor(message, skipLogging = false) {
    super(message, 422);
  }
}

class unAuthorizedError extends AppError {
  constructor(message, skipLogging = false) {
    super(message, 401);
  }
}

module.exports = {
  unAuthorizedError,
  BadRequestError,
  validationError,
  AppError,
};
