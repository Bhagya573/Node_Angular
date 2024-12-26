const express = require('express');
const { createQuote, getQuotes, getQuoteTypes } = require('../controllers/quoteController');
const authenticateJWT = require('../config/jwt');
const router = express.Router();

router.post('/quotes', authenticateJWT, createQuote);
router.get('/quotes', authenticateJWT, getQuotes);
router.get('/quote-types',authenticateJWT,getQuoteTypes);

module.exports = router;
