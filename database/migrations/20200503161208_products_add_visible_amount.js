
exports.up = function(knex) {
    return knex.schema.table('products', function(table){
        table.boolean('visible').defaultTo(true).notNullable()
        table.integer('amount').notNullable().unsigned().defaultTo(1)
    })
};

exports.down = function(knex) {
    return knex.schema.table('products', function(table){
        table.dropColumn('visible');
        table.dropColumn('amount');
    })
};
