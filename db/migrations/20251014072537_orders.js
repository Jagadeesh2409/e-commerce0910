exports.up = function (knex) {
  return knex.schema.createTable("orders", (table) => {
    table.increments("id").primary();
    table.string("invoice_no", 255).notNullable().unique();

    table
      .integer("user_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("users");

    table.integer("quantity").notNullable();

    // Payment method ENUM
    table
      .enu("payment_method", [
        "Credit Card",
        "Debit Card",
        "UPI",
        "Net Banking",
        "Cash on Delivery",
      ])
      .nullable()
      .defaultTo("Cash on Delivery");

    table.integer("transaction_id").nullable();

    // Payment status ENUM
    table
      .enu("payment_status", ["Pending", "Completed", "Failed", "Refunded"])
      .nullable()
      .defaultTo("Pending");

    table.timestamp("payment_date");

    table
      .integer("pincode_id")
      .unsigned()
      .nullable()
      .references("id")
      .inTable("pincodes")
      .onDelete("SET NULL");

    // Other charge ENUM
    table
      .enu("other_charge", ["Standard", "Express", "Free", "Custom"])
      .notNullable()
      .defaultTo("Standard");

    table.decimal("tax", 10, 2);
    table.decimal("discount", 10, 2);

    table.decimal("total_price", 10, 2).notNullable();

    table
      .integer("shipping_address")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("user_addresses")
      .onDelete("CASCADE");

    table
      .enu("status", ["Pending", "Paid", "Shipped", "Delivered", "Cancelled"])
      .nullable()
      .defaultTo("Pending");

    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("orders");
};
