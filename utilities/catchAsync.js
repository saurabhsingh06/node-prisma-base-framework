const AppError = require("./appError");

const statusCode = 400;

module.exports = fn => {
    return (req, res, next) => {
      fn(req, res, next).catch(err => {
        next(err);
      });
    };
};