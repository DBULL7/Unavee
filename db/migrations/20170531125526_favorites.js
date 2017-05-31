
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('favorites', function(table) {
      table.increments('id').primary()
      table.string('favorite')
      table.integer('user_id').unsigned()
      table.foreign('user_id').references('users.id')

      table.timestamps()
    })
  ])
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('favorites')
  ])
};
