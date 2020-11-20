
exports.up = function(knex) {
    return knex.schema.createTable('clients', function(table){
        table.string('id').primary()
        table.string('name', 30).notNullable()
        table.string('surname', 30).notNullable()
        table.string('displayname', 30)
        table.string('email').notNullable()
        table.string('password').notNullable()
        table.string('phone', 20).defaultTo('').notNullable();
        table.boolean('ban').defaultTo(false).notNullable();
        table.timestamps(true, true)
    })
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists("clients")
};
