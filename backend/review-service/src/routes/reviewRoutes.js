const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  getReviews,
  createReview,
  updateReview,
  deleteReview,
  markHelpful,
  reportReview
} = require('../controllers/reviewController');

// Validation rules
const reviewValidation = [
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  body('title')
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('Title must be between 5 and 200 characters'),
  body('comment')
    .trim()
    .isLength({ min: 10, max: 5000 })
    .withMessage('Comment must be between 10 and 5000 characters')
];

// Routes
router.get('/product/:productId', getReviews);
router.post('/product/:productId', reviewValidation, createReview);
router.put('/:reviewId', reviewValidation, updateReview);
router.delete('/:reviewId', deleteReview);
router.post('/:reviewId/helpful', markHelpful);
router.post('/:reviewId/report', reportReview);

module.exports = router;

