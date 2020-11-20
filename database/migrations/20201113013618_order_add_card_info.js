exports.up = function (knex) {
  return knex.schema.table('order', function (table) {
    table.text('name', 510);
    table.text('cpf', 20);
  });
};

exports.down = function (knex) {
  return knex.schema.table('order', function (table) {
    table.dropColumn('name');
    table.dropColumn('cpf');
  });
};
