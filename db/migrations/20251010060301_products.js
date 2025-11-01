exports.up = function (knex) {
  return knex.schema.createTable("products", (table) => {
    table.increments("id").primary();
    table.string("name").notNullable();
    table.string("brand").notNullable();
    table.integer("stock").defaultTo(0);
    table.string("image_url");
    table.string("short_description");
    table.text("full_description");
    table.string('slug').notNullable().unique();
    table
      .integer("unit_id")
      .unsigned()
      .references("id")
      .inTable("units")
      .onDelete("CASCADE").notNullable();
    table.json("product_details"); // store details like { color: "red", size: "M" }
    table.decimal("purchase_price", 10, 2).notNullable();
    table.decimal("MRP", 10, 2).notNullable();
    table.decimal("selling_price", 10, 2).notNullable();
    table.enum("discount_type", ["percentage", "flat"]).defaultTo("flat");
    table.decimal("discount", 5, 2);
    table.decimal("tax", 5, 2);
    table
      .integer("category_id")
      .unsigned()
      .references("id")
      .inTable("categories").notNullable();
    table.boolean('is_deleted').defaultTo(false);
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {  
  return knex.schema.dropTable("products");
};
