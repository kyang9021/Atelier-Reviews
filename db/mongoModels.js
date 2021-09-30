const { Schema } = require('mongoose');

const reviewsSchema = new Schema({
    _id: { type: Number, unique: true },
    rating: Number,
    summary: String,
    recommend: Boolean,
    response: String,
    body: String,
    date: Date,
    reviewer_name: String,
    helpfulness: Number,
    photos: [{id: Number, url: String}],
    product_id: Number,
    characteristics: {{ size: { id: Number, value: String }, width: { id: Number, value: String }, comfort: { id: Number, value: String }, quality: { id: Number, value: String }, length: { id: Number, value: String }, fit: { id: Number, value: String } }},
    ratings: { ones: String, twos: String, threes: String, fours: String, fives: String  },
    recommended: { false: String, true: String }
});

module.exports = {
    reviews: mongoose.model('Review', reviewsSchema, 'CatwalkReviews'),
};