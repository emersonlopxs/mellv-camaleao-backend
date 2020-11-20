exports.up = function (knex) {
  return knex.schema.table('order_det', function (table) {
    table.text('size', 5);
  });
};

exports.down = function (knex) {
  return knex.schema.table('order_det', function (table) {
    table.dropColumn('size');
  });
};
