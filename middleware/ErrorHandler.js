import logger from "../utils/logger.js";
// SOURCE https://www.youtube.com/watch?v=sat4Qlv_TBI

/**
 * Error handler middleware for Express.js.
 * This class is used to handle errors in the application.
 * It extends the built-in Error class and adds additional properties to it.
 * @property {number} status - The HTTP status code of the error.
 * @property {string} cause - The cause of the error.
 * @property {boolean} isOperational - A boolean that indicates if the error is operational or from the application itself.
 * @property {function} ErrorHandler - The error handler middleware function.
 * @module ErrorMiddleware
 */
class AppError extends Error {
  status;
  cause;
  isOperational;

  constructor(status, cause, isOperational) {
    super(cause);
    this.status = status;
    this.cause = cause;
    this.isOperational = isOperational;

    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Error handler middleware function for Express.js.
 * This function is used to handle errors in the application.
 * @description Express.js default parameters obligation : (error, req, res, next)
 * @param {Error} error - The error object.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {function} next - The next middleware function.
 */
function throwError(error, req, res, next) {
  console.log("Error name:", error.name);
  console.log("Error status:", error.status);
  console.log(error);

  switch (error.status) {
    case 400:
      error = new AppError(error.status, error.message, true);
      error.name = "Bad request";
      break;
    case 401:
      error = new AppError(error.status, error.message, true);
      error.name = "Unauthorized";
      break;
    case 404:
      error = new AppError(error.status, error.message, true);
      error.name = "Not found";
      break;
    case 409:
      error = new AppError(error.status, error.message, true);
      error.name = "Conflict";
      break;
    case 429:
      error = new AppError(error.status, error.message, true);
      error.name = "Too many requests";
      break;
    default:
      error = new AppError(error.status, error.message, false);
      error.name = "Internal server error";
      break;
  }

  logger.log({
    level: "error",
    status: `${error.status ? error.status : 500}`,
    message: `${error.cause ? error.cause : "Internal server error."}`
  })
  res.status(error.status ? error.status : 500).json({
    ErrorName: error.name,
    Status: error.status ? error.status : 500,
    ApiMessage: error.isOperational
      ? error.cause
      : "A programming error has occured.",
  });
}

const ErrorHandler = {
  AppError,
  throwError,
};
export default ErrorHandler;
