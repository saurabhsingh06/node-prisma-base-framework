const AppError = require("../utilities/appError");

const sendErrorDev = (err, req, res) => {
    console.error('ERROR 💥', err);
    return res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack
    });
}

const sendErrorProd = (err, req, res) => {
    // Formatiing error messages.
    const statusCode = 400;
    let error = { ...err };
    error.message = err.message;

    // Invali body
    if(err.type == 'entity.parse.failed') error = new AppError(`Invalid body format`, statusCode);
    // Handle unique constraint
    else if(err.code == 'P2002') error = new AppError(`Value you entered is already exists for ${err.meta.target[0]} field`,statusCode);

    // A) Operational, trusted error: send message to client
    if (error.isOperational) {
        return res.status(error.statusCode).json({
          status: error.status,
          message: error.message
        });
    }
    // B) Programming or other unknown error: don't leak error details
    // 1) Log error
    console.error('ERROR 💥', error);
    // 2) Send generic message
    res.status(500).json({
        status: 'error',
        message: 'Something went very wrong!'
    });
}

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (process.env.NODE_ENV === 'developmen') {
        sendErrorDev(err, req, res);
    } else  {
        sendErrorProd(err, req, res);
    }
}