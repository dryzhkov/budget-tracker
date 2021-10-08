const { Client } = require('faunadb');

module.exports.client = new Client({
  secret: 'fnAEU_CYmeAAR0BZOrq8_GYJ4lttfc08GvuNEswP',
  port: 443,
  domain: 'db.us.fauna.com',
  scheme: 'https',
});
