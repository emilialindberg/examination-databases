import express from 'express';
import Review from '../models/Review.js';
import { auth } from '../middleware/auth.js';
import Movie from '../models/Movie.js';
import mongoose from 'mongoose';


const router = express.Router();

// POST /reviews - Write a review (need auth)
router.post('/', auth, async (req, res) => {
  const { movieId, rating, comment } = req.body;

  try {
    // Does movie exist
    const movieExists = await Movie.findById(movieId);
    if (!movieExists) {
      return res.status(404).json({ message: 'Film finns inte' });
    }

    //Create review
    const newReview = new Review({
      movieId: new mongoose.Types.ObjectId(req.body.movieId),
      userId: req.user.userId,
      rating: req.body.rating,
      comment: req.body.comment
    });

    const savedReview = await newReview.save();

    // Get review and populate username
    const fullReview = await Review.findById(savedReview._id).populate('userId', 'username');

    res.status(201).json(fullReview);
  } catch (err) {
    res.status(500).json({ message: 'Fel vid skapande av recension', error: err });
    console.log(err);
  }
});

// Get all reviews
router.get('/', async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate('userId', 'username')         // Get username
      .populate('movieId', 'title');         // Get movie's title
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: 'Fel vid hämtning', error: err });
  }
});

// Get a specific review (Don't require login)
router.get('/:id', async (req, res) => {
  try {
    const review = await Review.findById(req.params.id)
      .populate('userId', 'username')
      .populate('movieId', 'title');
    if (!review) return res.status(404).json({ message: 'Recension ej hittad' });
    res.json(review);
  } catch (err) {
    res.status(500).json({ message: 'Fel vid hämtning', error: err });
  }
});

// PUT /reviews/:id
// Change a review
router.put('/:id', auth, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: 'Recension ej hittad' });
    // Only owner can update
    if (review.userId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Du kan inte ändra någon annans recension' });
    }
    review.rating = req.body.rating ?? review.rating;
    review.comment = req.body.comment ?? review.comment;
    const updated = await review.save();
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Fel vid uppdatering', error: err });
  }
});

// DELETE /reviews/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: 'Recension ej hittad' });
    // Only owner of review kan delete
    if (review.userId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Du kan inte ta bort någon annans recension' });
    }
    await review.deleteOne();
    res.json({ message: 'Recension borttagen' });
  } catch (err) {
    res.status(500).json({ message: 'Fel vid borttagning av recension' });
  }
});

export default router;