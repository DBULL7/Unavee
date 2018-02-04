
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('searches', function(table) {
      table.increments('id').primary()
      table.string('search').unique()
      table.string('name')
      table.string('organization')
      table.string('title')
      table.string('location')
      table.string('picture')
      table.string('LinkedIn')
      table.string('twitter')
      table.string('twitterID')

      table.timestamps(true, true)
    })
  ])
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('searches'),
  ])
};
