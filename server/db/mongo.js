const mongoose = require('mongoose');
require('dotenv').config();

mongoose.Promise = global.Promise;
const { MONGODB_USER, MONGODB_PSWD, MONGODB_NAME, MONGODB_URI } = process.env;
const mongoURL = `mongodb+srv://${MONGODB_USER}:${MONGODB_PSWD}@${MONGODB_URI}/${MONGODB_NAME}?retryWrites=true&w=majority`;

function connect() {
  return mongoose.connect(mongoURL, {
    useNewUrlParser: true,
  });
}

module.exports = {
  connect,
  mongoose,
};
