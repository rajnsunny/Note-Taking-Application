const errorHandler = (err, req, res, next) => {
    console.error(err); // Log the error for debugging
  
    // Handle different error types with appropriate responses
    if (err.name === 'ValidationError') {
      res.status(400).json({ message: 'Invalid request data', errors: err.errors });
    } else if (err.name === 'UnauthorizedError') {
      res.status(401).json({ message: 'Unauthorized' });
    } else {
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  
  module.exports = errorHandler;
  