const express = require('express');
const router = express.Router();

const authService = require('../services/auth-service');

router.post('/login', (req, res) => {
  authService.login(req, res);
});

module.exports = router;