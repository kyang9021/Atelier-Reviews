const express = require('express');
const router = express.Router();
const connection = require('./connection.js');

router.get('/reviews', connection.getReviews);

router.get('/reviews/meta', connection.getReviewsMeta);

router.post('/reviews', connection.addReview);

router.put('/reviews/:review_id/helpful', connection.helpfulReview);

router.put('/reviews/:review_id/report', connection.reportReview);

module.exports = router;