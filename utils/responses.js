const SucessResponse = (res, data, message = "Success") => {
  return res.status(200).json({ message, data });
};
const ErrorResponse = (res, error, statusCode = 500) => {
  return res.status(statusCode).json({ error });
};

const responsesMessages = {
  //auth
  REGISTER: "register successfully",
  LOGIN: "login successfully",
  USER_NOT_FOUND: "user not found",
  EXISTRING_USER: "user already have an account",

  //password
  FORGOT_PASSWORD: "OTP sent email Sucessfully",
  RESET_PASSWORD: "Password changed successfully",

  //unit related messages
  UNIT_CREATED: "Unit created successfully",
  UNIT_UPDATED: "Unit updated successfully",
  UNIT_DELETED: "Unit deleted successfully",
  UNIT_SHOWN: "Unit details fetched successfully",
  UNIT_NOT_FOUND: "Unit not found",

  //product related messages
  PRODUCT_CREATED: "Product created successfully",
  PRODUCT_UPDATED: "Product updated successfully",
  PRODUCT_DELETED: "Product deleted successfully",
  PRODUCT_SHOWN: "Product details shown successfully",
  PRODUCT_LIST: "product fetched successfully",
  PRODUCT_NOT_FOUND: "Product not found",

  //category
  CATEGORY_ADDED: "category added successfully",
  CATEGORY_REMOVED: "category removed successfully",
  CATEGORY_LISTED: "listed all category",

  //cart
  CART_ADDED: "added to cart successfully",
  CART_REMOVED: "cart removed successfully",
  CART_LIST: "cart listed successfully",

  ISE: "Internal server error",
};

module.exports = { SucessResponse, ErrorResponse, responsesMessages };
