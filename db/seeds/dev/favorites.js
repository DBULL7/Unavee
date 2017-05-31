
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
            {
              name: 'Dev',
              picture: 'none',
              twitter: 'http:dev.com',
              organizations: 'Turing',
              LinkedIn: 'biz.com',
              title: 'Prez',
              location: 'Denver',
              email: 'dbull',
              user_id: user[0]}
          ])
        })
      ])
    })
};
