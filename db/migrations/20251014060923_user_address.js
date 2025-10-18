exports.up = function (knex) {
  return knex.schema.createTable("user_addresses", (table) => {
    table.increments("id").unsigned().primary();

    table
      .integer("user_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");

    table.string("label", 255).notNullable();
    table
      .integer("pin_code")
      .unsigned()
      .nullable()
      .references("id")
      .inTable("pincodes")
      .onDelete("CASCADE");

    table.string("street", 255).notNullable();
    table.string("landmark", 255).notNullable();
    table.string("house_no", 255).notNullable();
    table.string("phone_number", 255).nullable();
    table.boolean("is_default").defaultTo(false);

    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("user_addresses");
};
