const knex = require("../db/knexConfig");

const getCartDetails = async (user_id) => {
  const cartItems = await knex("cart_items as c")
    .join("products as p", "c.product_id", "p.id")
    .select(
      "p.id as product_id",
      "p.name",
      "p.image_url",
      "p.selling_price",
      "p.discount",
      "p.discount_type",
      "p.tax",
      "c.quantity"
    )
    .where("c.user_id", user_id);

  if (!cartItems.length)
    return {
      products: [],
      subtotal: 0,
      total_discount: 0,
      total_tax: 0,
      grand_total: 0,
    };

  let subtotal = 0;
  let totalDiscount = 0;
  let totalTax = 0;

  const products = cartItems.map((item) => {
    const selling_price = Number(item.selling_price);
    const discount = Number(item.discount || 0);
    const tax = Number(item.tax || 0);
    const quantity = Number(item.quantity);

    const base = selling_price * quantity;
    subtotal += base;

    const discountValue =
      item.discount_type === "percentage"
        ? (base * discount) / 100
        : discount * quantity;

    totalDiscount += discountValue;

    const discountedPrice = base - discountValue;

    const taxValue = (discountedPrice * tax) / 100;
    totalTax += taxValue;

    const offerPrice =
      item.discount_type === "percentage"
        ? selling_price - (selling_price * discount) / 100
        : selling_price - discount;

    return {
      product_id: item.product_id,
      name: item.name,
      image_url: item.image_url,
      price: selling_price.toFixed(2),
      actual_price: selling_price.toFixed(2),
      offer_price: offerPrice.toFixed(2),
      discount: discount.toFixed(2),
      discount_type: item.discount_type,
      tax: tax.toFixed(2),
      quantity,
      total_price: (discountedPrice + taxValue).toFixed(2),
    };
  });

  const grandTotal = subtotal - totalDiscount + totalTax;

  return {
    products,
    subtotal: subtotal.toFixed(2),
    total_discount: totalDiscount.toFixed(2),
    total_tax: totalTax.toFixed(2),
    grand_total: grandTotal.toFixed(2),
  };
};

module.exports = { getCartDetails };
