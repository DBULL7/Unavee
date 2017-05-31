
exports.seed = function(knex, Promise) {
  return knex('favorites').del()
    .then(() => knex('users').del())
    .then(() => {
      return Promise.all([
        knex('users').insert({
          name: 'Chris', email: 'cman',
        }, 'id')
        .then(user => {
          return knex('favorites').insert([
            { favorite: {search: 'trump'}, user_id: user[0]}
          ])
        })
      ])
    })
};
