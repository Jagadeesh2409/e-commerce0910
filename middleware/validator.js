const Joi = require("joi");

const registerV = Joi.object({
  name: Joi.string().alphanum().min(3).max(16).required(),
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
    .required(),
  password: Joi.string(),
  phone_number: Joi.number().positive().required(),
});

const loginV = Joi.object({
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
    .required(),
  password: Joi.string().max(30).required(),
});

const unit = Joi.object({
  name: Joi.string().max(5).required(),
  abbreviation: Joi.string().max(21).required(),
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

const pincode = Joi.object({
  pincode: Joi.number().required(),
  city: Joi.string().required(),
  state: Joi.string().required(),
  country: Joi.string().required(),
  is_serviceable: Joi.boolean(),
});

const address = Joi.object({
  label: Joi.string(),
  pin_code: Joi.number().required(),
  street: Joi.string().required(),
  landmark: Joi.string().required(),
  house_no: Joi.string().required(),
  phone_number: Joi.number().required(),
  is_default: Joi.bool(),
});

const addCartSchema = Joi.object({
  product_id: Joi.number().integer().required(),
  quantity: Joi.number().integer().min(1).optional().default(1),
});

const removeCartSchema = Joi.object({
  product_id: Joi.number().integer().optional(),
  empty: Joi.boolean().optional().default(false),
});

const checkoutSchema = Joi.object({
  address_id: Joi.number().integer().required(),
  flat_discount: Joi.number().min(0).optional().default(0),
});

const initiatePaymentSchema = Joi.object({
  order_id: Joi.number().integer().required(),
  payment_method: Joi.string()
    .valid(
      "Cash on Delivery",
      "Credit Card",
      "Debit Card",
      "UPI",
      "Net Banking"
    )
    .required(),
});

const verifyPaymentSchema = Joi.object({
  razorpay_order_id: Joi.string().required(),
  razorpay_payment_id: Joi.string().required(),
  razorpay_signature: Joi.string().required(),
});

const updateOrderStatusSchema = Joi.object({
  status: Joi.string()
    .valid("Pending", "Paid", "Shipped", "Delivered", "Cancelled")
    .required(),
});

module.exports = {
  loginV,
  registerV,
  unit,
  product,
  category,
  pincode,
  address,
  addCartSchema,
  removeCartSchema,
  checkoutSchema,
  initiatePaymentSchema,
  verifyPaymentSchema,
  updateOrderStatusSchema,
};
