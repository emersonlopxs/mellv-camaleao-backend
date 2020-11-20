
exports.up = function(knex) {
    return knex.schema.createTable('order', function (table){
        table.increments()
        table.string('cli_id').references('id').inTable('clients').notNullable()
        table.string('cupon_id', 20).references('id').inTable('cupon').onUpdate('CASCADE').onDelete('CASCADE')
        table.integer('address_id').references('id').inTable('address').notNullable()
        table.decimal('total_price', 7, 2).defaultTo(0).notNullable()
        table.integer('status').defaultTo(0).notNullable()
        table.text('note', 510)
        table.timestamps(true, true)
    })
};

exports.down = function(knex) {
    return knex.schema.dropTableIfExists('order')
};
