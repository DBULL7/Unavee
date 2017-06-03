exports.seed = function(knex, Promise) {
  return knex('searches').del()
    .then(function () {
      return Promise.all([
        knex('searches').insert({
                                id: 1,
                                search: 'dbull@live.com',
                                name: 'Devon Bull',
                                organization: 'KU Entrepreneurship Club',
                                title: 'President',
                                location: 'Lawrence, Kansas, United States',
                                picture: 'picture',
                                LinkedIn: 'https://www.linkedin.com/in/jdevonbull',
                                twitter: "https://twitter.com/Devon_Bull"
                              }),
      ])
    });
};
