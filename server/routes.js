const express = require('express');
const router = express.Router();
const connection = require('./connection.js');

router.get('/reviews', connection.getReviews);

router.get('/reviews/meta', connection.getReviewsMeta);

module.exports = router;