const express = require('express');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose'); // Ensure mongoose is required
const Poem = require('./poemModel.js'); // Adjust the path as necessary
const router = express.Router();
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// CORS setup - allow requests from localhost during development, and from the app domain in production
const allowedOrigins = ['http://localhost:3000', 'https://word-ether.herokuapp.com'];
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  }
}));

// MongoDB connection
const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/WordEther';
mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// API routes
router.post('/poems', async (req, res) => {
  try {
    const newPoem = new Poem({ data: req.body.data });
    await newPoem.save();
    res.status(201).send(newPoem);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.get('/poems/random', async (req, res) => {
  try {
    const excludedIds = req.query.excludedIds ? JSON.parse(req.query.excludedIds).map(id => mongoose.Types.ObjectId(id)) : [];
    const limit = parseInt(req.query.limit, 10) || 10;

    const poems = await Poem.aggregate([
      { $match: { _id: { $nin: excludedIds } } },
      { $sample: { size: limit } }
    ]);

    res.status(200).json(poems);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching the random poems', details: error.message });
  }
});

router.get('/poems', async (req, res) => {
  try {
    const poems = await Poem.find({});
    res.status(200).send(poems);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.put('/poems/:id', async (req, res) => {
  try {
    const updatedPoem = await Poem.findOneAndUpdate(
      { _id: req.params.id },
      { $set: { data: req.body.data, date: req.body.date } },
      { new: true }
    );
    if (!updatedPoem) return res.status(404).send();
    res.send(updatedPoem);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.post('/poems/:id/like', async (req, res) => {
  try {
    const updatedPoem = await Poem.findByIdAndUpdate(
      req.params.id,
      { $inc: { likes: 1 } },
      { new: true }
    );
    if (!updatedPoem) return res.status(404).send('Poem not found');
    res.status(200).json(updatedPoem);
  } catch (error) {
    res.status(500).send('Error liking the poem');
  }
});

router.post('/poems/:id/unlike', async (req, res) => {
  try {
    const updatedPoem = await Poem.findByIdAndUpdate(
      req.params.id,
      { $inc: { likes: -1 } },
      { new: true }
    );
    if (!updatedPoem) return res.status(404).send('Poem not found');
    res.status(200).json(updatedPoem);
  } catch (error) {
    res.status(500).send('Error unliking the poem');
  }
});

router.delete('/poems/:id', async (req, res) => {
  try {
    const deletedPoem = await Poem.findOneAndDelete({ _id: req.params.id });
    if (!deletedPoem) return res.status(404).send();
    res.send(deletedPoem);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.use(router);

// Serve static files from the React app
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
