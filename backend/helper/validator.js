const Joi = require("joi");

const schemaValidator = Joi.object({
  username: Joi.string().min(5).max(19).required(),
  email: Joi.string().email().lowercase().required(),
  password: Joi.string()
    .pattern(/^[a-zA-Z0-9]{8,19}$/)
    .required(),
  firstName: Joi.string().min(3).max(20).required(),
  lastName: Joi.string().min(3).max(20).required(),
});

module.exports = schemaValidator;
