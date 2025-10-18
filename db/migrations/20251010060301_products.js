exports.up = function (knex) {
  return knex.schema.createTable("products", (table) => {
    table.increments("id").primary();
    table.string("name").notNullable().unique();
    table.string("brand").notNullable();
    table.integer("stock").defaultTo(0);
    table.string("image_url");
    table.string("short_description");
    table.text("full_description");
    table
      .integer("unit_id")
      .unsigned()
      .references("id")
      .inTable("units")
      .onDelete("SET NULL");
    table.json("product_details");
    table.decimal("purchase_price", 10, 2);
    table.decimal("MRP", 10, 2);
    table.decimal("selling_price", 10, 2);
    table.enum("discount_type", ["percentage", "flat"]).defaultTo("flat");
    table.decimal("discount", 5, 2);
    table.decimal("tax", 5, 2);
    table
      .integer("category_id")
      .unsigned()
      .references("id")
      .inTable("categories");
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("products");
};
