const Review = require('../models/review');
const { validationResult } = require('express-validator');

/**
 * Get reviews for a product
 */
exports.getReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    const {
      page = 1,
      limit = 10,
      rating,
      sort = 'newest',
      verifiedOnly = false
    } = req.query;

    const query = {
      product: productId,
      status: 'approved'
    };

    if (rating) {
      query.rating = parseInt(rating);
    }

    if (verifiedOnly === 'true') {
      query.verifiedPurchase = true;
    }

    let sortOption = {};
    switch (sort) {
      case 'newest':
        sortOption = { createdAt: -1 };
        break;
      case 'oldest':
        sortOption = { createdAt: 1 };
        break;
      case 'highest':
        sortOption = { rating: -1 };
        break;
      case 'lowest':
        sortOption = { rating: 1 };
        break;
      case 'helpful':
        sortOption = { 'helpful.count': -1 };
        break;
      default:
        sortOption = { createdAt: -1 };
    }

    const reviews = await Review.find(query)
      .populate('user', 'name email')
      .sort(sortOption)
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await Review.countDocuments(query);

    // Calculate rating statistics
    const ratingStats = await Review.aggregate([
      { $match: { product: require('mongoose').Types.ObjectId(productId), status: 'approved' } },
      {
        $group: {
          _id: null,
          average: { $avg: '$rating' },
          count: { $sum: 1 },
          distribution: {
            $push: '$rating'
          }
        }
      }
    ]);

    let stats = { average: 0, count: 0, distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } };
    if (ratingStats.length > 0) {
      const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
      ratingStats[0].distribution.forEach(r => {
        distribution[r] = (distribution[r] || 0) + 1;
      });
      stats = {
        average: Math.round(ratingStats[0].average * 10) / 10,
        count: ratingStats[0].count,
        distribution
      };
    }

    res.json({
      success: true,
      data: {
        reviews,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        },
        statistics: stats
      }
    });
  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch reviews',
      error: error.message
    });
  }
};

/**
 * Create a new review
 */
exports.createReview = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { productId } = req.params;
    const { rating, title, comment, images } = req.body;
    const userId = req.user?.id || req.body.userId; // In production, get from auth middleware

    // Check if user already reviewed this product
    const existingReview = await Review.findOne({
      product: productId,
      user: userId
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this product'
      });
    }

    // Check if user purchased this product (for verified purchase badge)
    // This would require integration with order service
    const verifiedPurchase = false; // TODO: Check orders

    const review = new Review({
      product: productId,
      user: userId,
      rating,
      title,
      comment,
      images: images || [],
      verifiedPurchase
    });

    await review.save();

    // Update product rating (would need to call product service)
    // await updateProductRating(productId);

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully',
      data: review
    });
  } catch (error) {
    console.error('Create review error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create review',
      error: error.message
    });
  }
};

/**
 * Update a review
 */
exports.updateReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { rating, title, comment, images } = req.body;
    const userId = req.user?.id || req.body.userId;

    const review = await Review.findOne({
      _id: reviewId,
      user: userId
    });

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    if (rating) review.rating = rating;
    if (title) review.title = title;
    if (comment) review.comment = comment;
    if (images) review.images = images;
    review.status = 'pending'; // Re-submit for moderation

    await review.save();

    res.json({
      success: true,
      message: 'Review updated successfully',
      data: review
    });
  } catch (error) {
    console.error('Update review error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update review',
      error: error.message
    });
  }
};

/**
 * Delete a review
 */
exports.deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const userId = req.user?.id || req.body.userId;

    const review = await Review.findOneAndDelete({
      _id: reviewId,
      user: userId
    });

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    res.json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete review',
      error: error.message
    });
  }
};

/**
 * Mark review as helpful
 */
exports.markHelpful = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const userId = req.user?.id || req.body.userId;

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    const userIndex = review.helpful.users.indexOf(userId);
    if (userIndex > -1) {
      // User already marked as helpful, remove it
      review.helpful.users.splice(userIndex, 1);
      review.helpful.count = Math.max(0, review.helpful.count - 1);
    } else {
      // Mark as helpful
      review.helpful.users.push(userId);
      review.helpful.count += 1;
    }

    await review.save();

    res.json({
      success: true,
      data: {
        helpful: review.helpful.count,
        userMarked: userIndex === -1
      }
    });
  } catch (error) {
    console.error('Mark helpful error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark review as helpful',
      error: error.message
    });
  }
};

/**
 * Report a review
 */
exports.reportReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { reason } = req.body;

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    review.reported.count += 1;
    if (reason) {
      review.reported.reasons.push(reason);
    }

    // Auto-flag if reported multiple times
    if (review.reported.count >= 5) {
      review.status = 'flagged';
    }

    await review.save();

    res.json({
      success: true,
      message: 'Review reported successfully'
    });
  } catch (error) {
    console.error('Report review error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to report review',
      error: error.message
    });
  }
};

