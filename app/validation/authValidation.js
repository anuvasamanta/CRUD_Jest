const Joi = require('joi');

const registerValidation = Joi.object({
  username: Joi.string().min(3).max(30).required().trim(),
  email: Joi.string().email().required().trim().lowercase(),
  password: Joi.string().min(6).required()
});

const loginValidation = Joi.object({
  email: Joi.string().email().required().trim().lowercase(),
  password: Joi.string().required()
});

module.exports = { registerValidation, loginValidation };