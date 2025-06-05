import express from 'express';
import mongoose from 'mongoose';
import movieRoutes from './routes/movies.js';
import userRoutes from './routes/users.js';
import reviewRoutes from './routes/reviews.js';
import dotenv from 'dotenv';

dotenv.config();


// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const app = express();

app.use(express.json()); // to receive JSON-data

// Routes for reviews
app.use('/reviews', reviewRoutes);
// Routes for movies
app.use('/movies', movieRoutes);
// Routes for users
app.use('/users', userRoutes);

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Servern körs på port ${PORT}`);
});