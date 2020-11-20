
exports.up = function(knex) {
    return knex.schema.createTable('rating', function(table){
        table.increments()
        table.string('cli_id').references('id').inTable('clients').notNullable().onUpdate('CASCADE').onDelete('CASCADE')
        table.integer('prod_id').references('id').inTable('products').notNullable().onUpdate('CASCADE').onDelete('CASCADE')
        table.integer('stars').notNullable()
        table.text('description', 765)
        table.boolean('visible').defaultTo(true).notNullable();
        table.timestamps(true, true)
    })
};

exports.down = function(knex) {
    return knex.schema.dropTableIfExists('rating')
};
