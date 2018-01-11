const mongoose = require('mongoose');
const env = require('./env/environment-prod');

mongoose.Promise = global.Promise;

const mongoUri = `mongodb://${env.dbName}.documents.azure.com:${env.port}/?ssl=true`;

function connect() {
  return mongoose.connect(mongoUri, {
    useMongoClient: true,
    user: env.dbName,
    pass: env.key
  });
}

module.exports = {
  connect,
  mongoose
}