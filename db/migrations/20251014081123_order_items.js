exports.up = function (knex) {
  return knex.schema.createTable("order_items", (table) => {
    table.increments("id").unsigned().primary();

    table
      .integer("product_id")
      .unsigned()
      .nullable()
      .references("id")
      .inTable("products")
      .onDelete("SET NULL");

    table.string("name").notNullable();
    table.integer("quantity").notNullable();
    table.decimal("price", 8, 2).notNullable();
    table.decimal("tax", 10, 2);
    table.decimal("discount", 10, 2);
    table.decimal("total", 8, 2).notNullable();
    table.boolean("is_deleted").defaultTo(false);

    table
      .integer("order_id")
      .unsigned()
      .nullable()
      .references("id")
      .inTable("orders")
      .onDelete("CASCADE");
    table.timestamp("created_at").defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("order_items");
};

