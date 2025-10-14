const Joi = require("joi");

const registerV = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required(),
  password: Joi.string().required(),
  phone_number: Joi.number(),
});

const loginV = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().required(),
});

const unit = Joi.object({
  name: Joi.string().required(),
  abbreviation: Joi.string().required(),
  description: Joi.string(),
});

const product = Joi.object({
  name: Joi.string().required(),
  brand: Joi.string().required(),
  stock: Joi.number().integer().min(0).default(0),
  image_url: Joi.string().uri().optional(),
  short_description: Joi.string().max(255).optional(),
  full_description: Joi.string().optional(),
  unit_id: Joi.number().integer().required(),
  product_details: Joi.object().pattern(Joi.string(), Joi.any()).optional(),
  purchase_price: Joi.number().precision(2).required(),
  MRP: Joi.number().precision(2).required(),
  selling_price: Joi.number().precision(2).required(),
  discount_type: Joi.string().valid("percentage", "flat").default("flat"),
  discount: Joi.number().precision(2).min(0).default(0),
  tax: Joi.number().precision(2).min(0).default(0),
  category_id: Joi.number().integer().required(),
});

const category = Joi.object({
  name: Joi.string().required(),
});

const cart = Joi.object({
  product_id: Joi.number().integer().positive().required(),
  quantity: Joi.number().integer().min(1).default(1),
});

module.exports = { loginV, registerV, unit, product, category, cart };
