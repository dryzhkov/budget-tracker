const Transaction = require('./transaction-model');
const ReadPreference = require('mongodb').ReadPreference;

require('./mongo').connect();

function get(req, res) {
  const docquery = Transaction.find({}).read(ReadPreference.NEAREST);

  docquery
    .exec()
    .then(transactions => {
      res.json(transactions);
    })
    .catch(err => {
      res.status(500).send(err);
    });
}

function create(req, res) {
  const { type, amount, category } = req.body;
  const transaction = new Transaction(
    { 
      id: Date.now(), 
      type, 
      category, 
      amount,
      created: new Date().toISOString()
    });

  transaction
    .save()
    .then(() => {
      res.json(transaction);
    })
    .catch(err => {
      res.status(500).send(err);
    });
}

function update(req, res) {
  const { id, type, amount, category } = req.body;

  Transaction.findOne({ id })
    .then(transaction => {
      transaction.type = type;
      transaction.amount = amount;
      transaction.category = category;
      transaction.save().then(res.json(transaction));
    })
    .catch(err => {
      res.status(500).send(err);
    });
}

function destroy(req, res) {
  const { id } = req.params;

  Transaction.findOneAndRemove({ id })
    .then(transaction => {
      res.json(transaction);
    })
    .catch(err => {
      res.status(500).send(err);
    });
}

module.exports = { get, create, update, destroy };