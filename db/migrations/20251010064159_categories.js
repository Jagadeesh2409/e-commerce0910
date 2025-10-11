exports.up = function (knex) {
  return knex.schema.createTable("categories", (table) => {
    table.increments("id").primary();
    table.string("name").notNullable();
    table.string("slug").unique();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("categories");
};
