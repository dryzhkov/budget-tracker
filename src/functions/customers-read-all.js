const faunadb = require('faunadb');
const q = faunadb.query;

const { client } = require('./db/client');
const checkAuth = require('./auth/checkAuth');

exports.handler = (event, context, callback) => {
  console.log('Function `customers-read-all` invoked...');

  checkAuth(context)
    .then((user) => {
      console.log('user', user);
      return client
        .query(q.Paginate(q.Match(q.Ref('indexes/all_customers'))))
        .then((response) => {
          const customersRef = response.data;
          // create new query out of todo refs. http://bit.ly/2LG3MLg
          const getAllTodoDataQuery = customersRef.map((ref) => {
            return q.Get(ref);
          });
          // then query the refs
          return client.query(getAllTodoDataQuery).then((ret) => {
            return callback(null, {
              statusCode: 200,
              body: JSON.stringify(ret),
            });
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
