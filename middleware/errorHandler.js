//Handles and response with better error details
export const errorHandler = (err, req, res, next) => {
  console.error(`Error: ${err.message}`);
  console.error(err.stack);
  
  let statusCode = 500;
  let message = 'Internal Server Error';
  
  // Handle different types of errors properly
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Invalid input data';
  } else if (err.name === 'UnauthorizedError') {
    statusCode = 401;
    message = 'Unauthorized access';
  } else if (err.statusCode) {
    statusCode = err.statusCode;
    message = err.message;
  }
  
  res.status(statusCode).json({
    error: {
      message,
      //Dev only stack trace
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    }
  });
};