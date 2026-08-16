function errorHandler(error, req, res, next) {
  if (res.headersSent) {
    return next(error);
  }

  let statusCode = 500;
  let message = "Internal server error.";

  if (error instanceof SyntaxError && error.status === 400 && "body" in error) {
    statusCode = 400;
    message = "Malformed JSON request body.";
  } else if (error.code === "VALIDATION_ERROR") {
    statusCode = 422;
    message = error.message;
  } else if (error.code === "NOT_FOUND") {
    statusCode = 404;
    message = error.message;
  } else if (error.code === "GONE") {
    statusCode = 410;
    message = error.message;
  }

  if (statusCode === 500) {
    console.error(error);
  }

  return res.status(statusCode).json({ error: message });
}

module.exports = { errorHandler };
