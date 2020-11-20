
exports.up = function(knex) {
  return knex.schema.createTable('order_det', function(table){
    table.integer('order_id').references('id').inTable('order').notNullable().onUpdate('CASCADE').onDelete('CASCADE')
    table.integer('product_id').references('id').inTable('products').notNullable()
    table.integer('amount').notNullable().unsigned().defaultTo('1')
  })
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('order_det')
};
