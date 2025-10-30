exports.up = function (knex) {
  return knex.schema.createTable("pincodes", (table) => {
    table.increments("id").unsigned().primary();
    table.string("pincode", 10).notNullable().unique();
    table.string("city", 255).notNullable();
    table.string("state", 255).notNullable();
    table.string("country", 255).notNullable();
    table.boolean("is_deleted").defaultTo(false);
    table.boolean("is_serviceable").defaultTo(true);
    table.timestamp("created_at").defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("pincodes");
};
