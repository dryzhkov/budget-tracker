const express = require('express');
const router = express.Router();

const transactionService = require('../services/transaction-service');

router.get('/transactions/:paydate', function(req, res, next) {
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

router.get('/transactions/summary/:year', (req, res) => {
  transactionService.getAll(req, res);
});

module.exports = router;
