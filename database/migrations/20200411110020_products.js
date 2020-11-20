
exports.up = function(knex) {
  return knex.schema.createTable('products', function(table){
      table.increments()
      table.string('name', 100).notNullable()
      table.integer('type').notNullable()
      table.decimal('price').notNullable().defaultTo(0)
      table.specificType('sizes', 'text[]')
      table.text('description', 765)
      table.specificType('images', 'text[]')
      table.timestamps(true, true)
  })
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists("products")
};
