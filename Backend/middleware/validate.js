<<<<<<< HEAD
const Joi = require('joi');

/**
 * Generic Joi validation middleware
 * @param {Joi.ObjectSchema} schema - The Joi schema to validate against
 * @param {string} property - The request property to validate (e.g., 'body', 'query', 'params')
 */
const validate = (schema, property = 'body') => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[property], { abortEarly: false });

    if (error) {
      // Extract custom error messages
      const errorMessage = error.details.map((detail) => detail.message).join(', ');
      return res.status(400).json({
        success: false,
        message: errorMessage,
        errors: error.details,
      });
    }

    // Reassign validated/coerced values back to the request
    req[property] = value;
=======
const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[property], { abortEarly: false });

    if (error) {
      // Extract custom error messages
      const errorMessage = error.details.map((detail) => detail.message).join(', ');
      return res.status(400).json({
        success: false,
        message: errorMessage,
        errors: error.details,
      });
    }

    // Optionally assign validated value back
    if (req.method === 'GET') {
      req.query = value;
    } else {
      req.body = value;
    }

>>>>>>> main
    next();
  };
};

module.exports = validate;
