const mongoose = require('mongoose');
require('dotenv').config();

const Schema = mongoose.Schema;
const transactionSchema = new Schema({
  id: { type: Number, required: true, unique: true },
  type: { type: String, required: true },
  category: { type: String, required: true },
  amount: { type: Number, required: true },
  payDate: { type: String, required: true },
  userId: { type: String },
  created: { type: Date },
});

const Transaction = mongoose.model('Transaction', transactionSchema);

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
  Transaction,
};
