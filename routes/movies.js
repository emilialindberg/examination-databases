import express from 'express';
import Movie from '../models/Movie.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// POST /movies - Add a new movie
router.post('/', auth, async (req, res) => {
  try {
    const { title, director, releaseYear, genre } = req.body;
    const newMovie = new Movie({ title, director, releaseYear, genre });
    const savedMovie = await newMovie.save();
    res.status(201).json(savedMovie);
  } catch (err) {
    res.status(500).json({ message: 'Fel vid skapande av film', error: err });
  }
});

// GET /movies - Get all movies
router.get('/', async (req, res) => {
  try {
    const movies = await Movie.find();
    res.json(movies);
  } catch (err) {
    res.status(500).json({ message: 'Fel vid hämtning av filmer', error: err });
  }
});

// GET /movies/:id - Get details for a movie
router.get('/:id', async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).json({ message: 'Film ej hittad' });
    }
    res.json(movie);
  } catch (err) {
    res.status(500).json({ message: 'Fel vid hämtning av film', error: err });
  }
});

// PUT /movies/:id - Update a movie
router.put('/:id', auth, async (req, res) => {
  try {
    const updatedMovie = await Movie.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedMovie) {
      return res.status(404).json({ message: 'Film ej hittad' });
    }
    res.json(updatedMovie);
  } catch (err) {
    res.status(500).json({ message: 'Fel vid uppdatering', error: err });
  }
});

// GET /movies/:id/reviews - Get reviews from a movie
import Review from '../models/Review.js';

router.get('/:id/reviews', async (req, res) => {
  try {
    const reviews = await Review.find({ movieId: req.params.id }).populate('userId', 'username');
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: 'Fel vid hämtning av recensioner', error: err });
  }
});

// DELETE /movies/:id - Delete a movie
router.delete('/:id', auth, async (req, res) => {
  try {
    const deletedMovie = await Movie.findByIdAndDelete(req.params.id);
    if (!deletedMovie) {
      return res.status(404).json({ message: 'Film ej hittad' });
    }
    res.json({ message: 'Film borttagen' });
  } catch (err) {
    res.status(500).json({ message: 'Fel vid borttagning', error: err });
  }
});

export default router;