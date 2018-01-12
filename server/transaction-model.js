const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const transactionSchema = new Schema({
    id: { type: Number, required: true, unique: true },
    type: { type: String, required: true },
    category: { type: String, required: true },
    amount: { type: Number, required: true },
    payDate: { type: String, required: true },
    userId: { type: String },
    created: { type: Date }
});

const Transaction = mongoose.model('Transaction', transactionSchema);
module.exports = Transaction;