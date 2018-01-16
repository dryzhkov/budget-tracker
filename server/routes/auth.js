const express = require('express');
const router = express.Router();

const authService = require('../services/auth-service');

router.post('/login', (req, res, next) => {
  authService.login(req, res, next);
});

router.post('/signup', (req, res, next) => {
  authService.signup(req, res, next);
});

module.exports = router;