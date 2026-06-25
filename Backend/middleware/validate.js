const validate = (schema) => {
  return (req, res, next) => {
    // Determine what to validate based on the request method
    // Typically POST/PUT use req.body, GET uses req.query
    const dataToValidate = req.method === 'GET' ? req.query : req.body;

    const { error, value } = schema.validate(dataToValidate, { 
      abortEarly: false, 
      allowUnknown: true 
    });

    if (error) {
      // Extract the first meaningful error message, or map all of them
      const errorMessage = error.details.map(detail => detail.message).join(', ');
      return res.status(400).json({
        success: false,
        message: errorMessage
      });
    }

    // Optionally assign validated value back
    if (req.method === 'GET') {
      req.query = value;
    } else {
      req.body = value;
    }

    next();
  };
};

module.exports = validate;
