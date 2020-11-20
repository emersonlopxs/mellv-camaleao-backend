
exports.up = function(knex) {
    return knex.schema.createTable('address', function(table){
        table.increments()
        table.string('cli_id').references('id').inTable('clients').notNullable().onUpdate('CASCADE').onDelete('CASCADE')
        table.string('cep', 10).notNullable()
        table.string('street', 100).notNullable()
        table.string('district', 100).notNullable()
        table.integer('number').unsigned().notNullable()
        table.boolean('visible').defaultTo(true).notNullable();
        table.text('complement', 510)
        table.timestamps(true, true)  
    })
};

exports.down = function(knex) {
    return knex.schema.dropTableIfExists("address")
};
