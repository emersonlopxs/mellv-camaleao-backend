

exports.up = function(knex) {
    return knex.schema.createTable('cupon', function(table){
        table.string('id', 20).primary()
        table.string('admin_id').references('id').inTable('admin').notNullable().onUpdate('CASCADE').onDelete('CASCADE')
        table.decimal('discount', 3, 2).notNullable()
        table.datetime('expire_time')
        table.text('description')
        table.timestamps(true, true)
    })
};

exports.down = function(knex) {
    return knex.schema.dropTableIfExists('cupon')
};

