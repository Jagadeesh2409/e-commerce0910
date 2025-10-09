const knexfile = require("../knexfile");
const config = knexfile.development || knexfile;
const knex = require("knex")(config);

module.exports = knex;
