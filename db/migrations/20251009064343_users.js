exports.up = function (knex) {
  return knex.schema.createTable("users", (table) => {
    table.increments("id").primary();
    table.string("name", 255).notNullable();
    table.string("email", 255).notNullable().unique();
    table.string("password_hash", 255).notNullable();
    table.string("phone_number", 20).nullable();
    table.boolean("is_admin").notNullable().defaultTo(false);
     table.string("reset_token", 255).nullable();
    table.timestamp("reset_token_expires").nullable();
    table.enum('status', ['PENDING', 'ACTIVE', 'BLOCKED']).defaultTo('PENDING');
    table.string('google_id');
    table.string('login_provider')
    table.boolean('is_email_verified').defaultTo(false);
    table.string('profile_img').unique();
    table.timestamp("created_at").notNullable().defaultTo(knex.fn.now());
    table.timestamp("updated_at").notNullable().defaultTo(knex.fn.now());
  });
};


exports.down = function (knex) {
  return knex.schema.dropTableIfExists("users");
};
