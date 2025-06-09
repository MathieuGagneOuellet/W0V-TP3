// import logger from "../utils/logger.js";
// SOURCE https://www.youtube.com/watch?v=WXa1yzLR3hw

/**
 * Error handler middleware for Express.js.
 * This class is used to handle errors in the application.
 * It extends the built-in Error class and adds additional properties to it.
 * @property {number} status - The HTTP status code of the error.
 * @property {string} cause - The cause of the error.
 * @property {boolean} isOperational - A boolean that indicates if the error is operational or from the application itself.
 * @property {function} throwError - The error handler middleware function.
 * @module ErrorMiddleware
 */
class AppError extends Error {
  statusCode;
  name;
  isOperational;

  constructor(statusCode, name, isOperational) {
    super();
    this.statusCode = statusCode;
    this.name = name;
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
  console.log(error);
  error.statusCode = error.statusCode || 500;

  // TODO Log error with logger Middleware
  // logger.log({
  //   level: "error",
  //   status: `${error.status ? error.status : 500}`,
  //   message: `${error.cause ? error.cause : "Internal server error."}`
  // });

  const t = (path, fallback) => {
    const result = req.t(path);
    return result !== path ? result : req.t(fallback);
  }

  res.status(error.statusCode).json({
    Code: error.statusCode,
    Description: t(error.name, "reponses.erreur_inconnue"),
    Message: error.message?.[req.t("erreur_inconnue_message")],
    Definition: error.stack
  });
}

const ErrorHandler = {
  AppError,
  throwError,
};
export default ErrorHandler;
