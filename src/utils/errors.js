class AppError extends Error {
  constructor(message, code) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
  }
}

class ValidationError extends AppError {
  constructor(message) {
    super(message, "VALIDATION_ERROR");
  }
}

class NotFoundError extends AppError {
  constructor(message) {
    super(message, "NOT_FOUND");
  }
}

class GoneError extends AppError {
  constructor(message) {
    super(message, "GONE");
  }
}

module.exports = {
  ValidationError,
  NotFoundError,
  GoneError,
};
