const express = require('express');
const Review = require('../models/Review');
const { authenticate, authorize, pagination, uploadMultiple } = require('../middleware');

const router = express.Router();

const getReviews = async (req, res) => {
  try {
    const { productId } = req.query;
    const filter = { status: 'approved' };
    if (productId) filter.product = productId;
    
    const reviews = await Review.find(filter)
      .populate('user', 'firstName lastName')
      .sort({ createdAt: -1 })
      .limit(req.pagination.limit)
      .skip(req.pagination.skip);
    
    const total = await Review.countDocuments(filter);
    res.json(res.paginate(reviews, total));
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch reviews', error: error.message });
  }
};

const createReview = async (req, res) => {
  try {
    const review = new Review({
      ...req.body,
      user: req.user.id,
      images: req.files?.map(file => file.path) || []
    });
    
    await review.save();
    await review.populate('user', 'firstName lastName');
    
    res.status(201).json(review);
  } catch (error) {
    res.status(400).json({ message: 'Failed to create review', error: error.message });
  }
};

const updateReview = async (req, res) => {
  try {
    const review = await Review.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true }
    );
    
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    
    res.json(review);
  } catch (error) {
    res.status(400).json({ message: 'Failed to update review', error: error.message });
  }
};

const deleteReview = async (req, res) => {
  try {
    const review = await Review.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    
    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete review', error: error.message });
  }
};

const markHelpful = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    
    const hasVoted = review.helpful.users.includes(req.user.id);
    
    if (hasVoted) {
      review.helpful.users.pull(req.user.id);
      review.helpful.count -= 1;
    } else {
      review.helpful.users.push(req.user.id);
      review.helpful.count += 1;
    }
    
    await review.save();
    res.json({ helpful: review.helpful.count, hasVoted: !hasVoted });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update helpful status', error: error.message });
  }
};

router.get('/', pagination(), getReviews);
router.post('/', authenticate, uploadMultiple, createReview);
router.put('/:id', authenticate, updateReview);
router.delete('/:id', authenticate, deleteReview);
router.post('/:id/helpful', authenticate, markHelpful);

module.exports = router;