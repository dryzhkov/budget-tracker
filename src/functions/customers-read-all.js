const faunadb = require('faunadb');
const q = faunadb.query;

const { client } = require('./db/client');
const checkAuth = require('./auth/checkAuth');

exports.handler = (event, context, callback) => {
  checkAuth(context)
    .then((_) => {
      return client
        .query(
          q.Map(
            q.Paginate(q.Match(q.Index('all_customers'))),
            q.Lambda('cusomerRef', q.Get(q.Var('cusomerRef')))
          )
        )
        .then((results) => {
          const { data } = results;
          return callback(null, {
            statusCode: 200,
            body: JSON.stringify(data),
          });
        })
        .catch((error) => {
          console.log('error', error);
          return callback(null, {
            statusCode: 400,
            body: JSON.stringify(error),
          });
        });
    })
    .catch((error) => {
      console.log('error', error);
      return callback(null, {
        statusCode: 401,
        body: JSON.stringify({
          error: error.message,
        }),
      });
    });
};
