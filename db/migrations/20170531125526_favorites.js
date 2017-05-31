
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('favorites', function(table) {
      table.increments('id').primary()
      table.string('name')
      table.string('picture')
      table.string('twitter')
      table.string('organizations')
      table.string('LinkedIn')
      table.string('title')
      table.string('location')
      table.string('email')
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
