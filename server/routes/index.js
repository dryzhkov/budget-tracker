var express = require('express');
var router = express.Router();

const transactionService = require('../transaction-service');

router.get('/transactions', function(req, res, next) {
  transactionService.get(req, res);
});

router.put('/transaction', (req, res) => {
  transactionService.update(req, res);
});

router.post('/transaction', (req, res) => {
  transactionService.create(req, res);
});

router.delete('/transaction/:id', (req, res) => {
  transactionService.destroy(req, res);
});

module.exports = router;
