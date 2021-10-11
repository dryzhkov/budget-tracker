const { Client } = require('faunadb');

require('dotenv').config();
const { FAUNADB_SERVER_SECRET } = process.env;
module.exports.client = new Client({
  secret: FAUNADB_SERVER_SECRET,
  port: 443,
  domain: 'db.us.fauna.com',
  scheme: 'https',
});
