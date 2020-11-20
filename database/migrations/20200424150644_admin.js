
exports.up = function(knex) {
    return knex.schema.createTable('admin', function (table){
        table.string('id').notNullable().primary()
        table.string('email').notNullable()
        table.string('password').notNullable()
        table.string('name').notNullable()
        table.timestamps(true, true)
    })
};

exports.down = function(knex) {
    return knex.schema.dropTableIfExists('admin')
};
