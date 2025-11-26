const Joi = require('joi');

const createTaskValidation = Joi.object({
  title: Joi.string().max(100).required().trim(),
  description: Joi.string().max(500).trim().allow(''),
  status: Joi.string().valid('pending', 'in-progress', 'completed'),
  priority: Joi.string().valid('low', 'medium', 'high'),
  dueDate: Joi.date().iso().greater('now')
});

const updateTaskValidation = Joi.object({
  title: Joi.string().max(100).trim(),
  description: Joi.string().max(500).trim().allow(''),
  status: Joi.string().valid('pending', 'in-progress', 'completed'),
  priority: Joi.string().valid('low', 'medium', 'high'),
  dueDate: Joi.date().iso().greater('now')
});

module.exports = { createTaskValidation, updateTaskValidation };