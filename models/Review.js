import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  movieId: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  comment: { type: String, required: false },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Review', reviewSchema);
