
exports.up = function(knex) {
  return knex.schema.createTable('order_payments', function(table){
    table.string('cli_id').references('id').inTable('clients').notNullable()
    table.string('stripe_pi_id', 255).notNullable()
    table.integer('order_id').references('id').inTable('order').notNullable()
    table.timestamps(true, true)
  })
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('order_payments')
};
