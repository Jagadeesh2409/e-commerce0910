exports.up = function (knex) {
  return knex.schema.createTable('discounts', (table) => {
    table.increments('id').primary();
    table.string('code').unique().notNullable();
    table.string('description');
    table.enu('discount_type', ['percentage', 'flat']).notNullable();
    table.decimal('discount_value', 10, 2).notNullable();
    table.decimal('max_discount_amount', 10, 2);
    table.decimal('min_order_value', 10, 2);
    table.datetime('start_date').notNullable();
    table.datetime('end_date').notNullable();
    table.integer('usage_limit').defaultTo(0);
    table.integer('used_count').defaultTo(0);
    table.integer('per_user_limit').defaultTo(1);
    table.boolean('is_active').defaultTo(true);
    table.timestamps(true, true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('discounts');
};
