exports.up = function (knex) {
  return knex.schema.createTable("product_categories", (table) => {
    table
      .integer("product_id")
      .unsigned()
      .references("id")
      .inTable("products")
      .onDelete("CASCADE");
    table
      .integer("category_id")
      .unsigned()
      .references("id")
      .inTable("categories")
      .onDelete("CASCADE");
    table.primary(["product_id", "category_id"]);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("product_categories");
};
