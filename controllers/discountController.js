const knex = require('../db/knexConfig');
const { SucessResponse, ErrorResponse } = require('../utils/responses');

const createDiscount = async (req, res) => {
  try {
    const { name, type, value, start_date, end_date } = req.body;
    const [id] = await knex('discounts').insert({
      name,
      type,
      value,
      start_date,
      end_date
    });
    SucessResponse(res, { id, ...req.body }, 'Discount created successfully');
  } catch (error) {
    ErrorResponse(res, 'Internal server error', 500);
  }
};

const getActiveDiscounts = async (req, res) => {
  try {
    const discounts = await knex('discounts')
      .where('is_active', true)
      .where('end_date', '>=', knex.fn.now());
    SucessResponse(res, discounts, 'Active discounts retrieved');
  } catch (error) {
    ErrorResponse(res, 'Internal server error', 500);
  }
};

module.exports = {
  createDiscount,
  getActiveDiscounts
};
