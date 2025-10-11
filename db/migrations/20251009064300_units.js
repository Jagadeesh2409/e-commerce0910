exports.up = function (knex) {
  return knex.schema.createTable("units", (table) => {
    table.increments("id").primary();
    table.string("name").notNullable().unique();
    table.string("abbreviation").notNullable();
    table.string("description");
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("units");
};
