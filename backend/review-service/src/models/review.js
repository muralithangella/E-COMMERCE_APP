const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
    index: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
    index: true
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  comment: {
    type: String,
    required: true,
    trim: true,
    maxlength: 5000
  },
  verifiedPurchase: {
    type: Boolean,
    default: false
  },
  helpful: {
    count: { type: Number, default: 0 },
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
  },
  images: [{
    url: String,
    alt: String
  }],
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'flagged'],
    default: 'pending',
    index: true
  },
  moderationNote: String,
  reported: {
    count: { type: Number, default: 0 },
    reasons: [String]
  }
}, {
  timestamps: true
});

// Compound indexes for efficient queries
reviewSchema.index({ product: 1, status: 1, createdAt: -1 });
reviewSchema.index({ user: 1, product: 1 }, { unique: true }); // One review per user per product
reviewSchema.index({ rating: 1, status: 1 });
reviewSchema.index({ verifiedPurchase: 1, status: 1 });

// Static method to calculate product rating
reviewSchema.statics.calculateProductRating = async function(productId) {
  const stats = await this.aggregate([
    {
      $match: {
        product: mongoose.Types.ObjectId(productId),
        status: 'approved'
      }
    },
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

  if (stats.length === 0) {
    return { average: 0, count: 0, distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } };
  }

  const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  stats[0].distribution.forEach(rating => {
    distribution[rating] = (distribution[rating] || 0) + 1;
  });

  return {
    average: Math.round(stats[0].average * 10) / 10,
    count: stats[0].count,
    distribution
  };
};

module.exports = mongoose.model('Review', reviewSchema);

