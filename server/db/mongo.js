const mongoose = require('mongoose');
const env = require('../env/environment-prod');

mongoose.Promise = global.Promise;

// URL format: 'mongodb://username:password@host:port/database?options...'
const mongoUri = `mongodb://dvm5074.cloudapp.net:${env.port}/budget`;

function connect() {
  return mongoose.connect(mongoUri, {
    useMongoClient: true,
    user: env.user,
    pass: env.pwd
  });
}

module.exports = {
  connect,
  mongoose
}