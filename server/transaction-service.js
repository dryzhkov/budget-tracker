const Transaction = require('./transaction-model');
const ReadPreference = require('mongodb').ReadPreference;

require('./mongo').connect();

function get(req, res) {
  const { paydate } = req.params;
  const docquery = Transaction.find({payDate: paydate}).read(ReadPreference.NEAREST);

  docquery
    .exec()
    .then(transactions => {
      const convertedTrans = transactions.map(el => {
        return convert(el);
      });
      res.json(convertedTrans);
    })
    .catch(err => {
      res.status(500).send(err);
    });
}

function create(req, res) {
  const { type, amount, category, payDate } = req.body;
  const transaction = new Transaction(
    { 
      id: Date.now(),
      type, 
      category, 
      amount,
      payDate: `${payDate.year}-${payDate.period}`,
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

function convert(dbElement) {
  return {
    id: dbElement.id,
    type: dbElement.type,
    category: dbElement.category,
    amount: dbElement.amount,
    payDate: stringToPayDate(dbElement.payDate),
    userId: dbElement.userId,
    created: dbElement.created
  };
}

function stringToPayDate(value) {
  if (value) {
    const pieces = value.split('-');
    if (pieces.length === 2) {
      return {
        year: pieces[0],
        period: pieces[1]
      };
    }
  }
  return null;
}

module.exports = { get, create, update, destroy };