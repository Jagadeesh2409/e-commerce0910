const SucessResponse = (res, data, message = "Success") => {
  return res.status(200).json({ message, data });
};
const ErrorResponse = (res, error, statusCode = 500) => {
  return res.status(statusCode).json({ error });
};

const responsesMessages = {
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
  PRODUCT_SHOWN: "Product details fetched successfully",
  PRODUCT_NOT_FOUND: "Product not found",

  ISE: "Internal server error",
};

module.exports = { SucessResponse, ErrorResponse, responsesMessages };
