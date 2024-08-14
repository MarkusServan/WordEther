
const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors({ origin: 'http://localhost:3000' }));

//const express = require('express');
const Poem = require('./poemModel.js'); // Adjust the path as necessary
const router = express.Router();


router.post('/poems', async (req, res) => {
  try {
    const newPoem = new Poem({
      data: req.body.data,
    });
    await newPoem.save();
    res.status(201).send(newPoem);
  } catch (error) {
    app.use(cors({ origin: 'http://localhost:3000' }));
    res.status(400).send(error);
  }
});



router.get('/poems/random', async (req, res) => {
  try {
    // Parse excludedIds from the query string and convert them to Mongoose ObjectIds
    const excludedIds = req.query.excludedIds ? JSON.parse(req.query.excludedIds).map(id => mongoose.Types.ObjectId(id)) : [];
    const limit = parseInt(req.query.limit, 10) || 10;
    // Validate limit to ensure it is a number and within a reasonable range
  

    // Use the aggregate function to randomly select poems that are not in the excludedIds
    const poems = await Poem.aggregate([
      { $match: { _id: { $nin: excludedIds } } }, // Exclude specified IDs
      { $sample: { size: limit } } // Randomly select 'limit' poems
    ]);
    console.log("Limit received:", limit);

    res.status(200).json(poems); // Send the selected poems as JSON
  } catch (error) {
    // If an error occurs, such as parsing errors, handle it and send a 500 status
    res.status(500).json({ error: 'An error occurred while fetching the random poems', details: error.message });
  }
});


// GET route to fetch all poems
//Remember to add option to get a certain amount of poems by id
router.get('/poems', async (req, res) => {
  try {
    const poems = await Poem.find({});
    res.status(200).send(poems);
  } catch (error) {
    res.status(500).send(error);
  }
});

// PUT route to update a poem by id
router.put('/poems/:id', async (req, res) => {
  try {
    const updatedPoem = await Poem.findOneAndUpdate(
      { id: req.params.id },
      { $set: { data: req.body.data, date: req.body.date } },
      { new: true }  // This ensures the updated document is returned
    );
    if (!updatedPoem) {
      return res.status(404).send();
    }
    res.send(updatedPoem);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Endpoint to like a poem
app.post('/poems/:id/like', async (req, res) => {
  const { id } = req.params; // Get the poem ID from URL parameters

  try {
    // Find the poem by ID and increment the likes atomically
    const updatedPoem = await Poem.findByIdAndUpdate(
      id,
      { $inc: { likes: 1 } }, // Increment likes by 1
      { new: true } // Return the updated document
    );

    if (!updatedPoem) {
      return res.status(404).send('Poem not found');
    }

    res.status(200).json(updatedPoem);
  } catch (error) {
    console.error('Failed to like the poem:', error);
    res.status(500).send('Error liking the poem');
  }
});

router.post('/poems/:id/unlike', async (req, res) => {
  const { id } = req.params; // Get the poem ID from URL parameters

  try {
    // Find the poem by ID and decrement the likes atomically
    const updatedPoem = await Poem.findByIdAndUpdate(
      id,
      { $inc: { likes: -1 } }, // Decrement likes by 1
      { new: true } // Return the updated document
    );

    if (!updatedPoem) {
      return res.status(404).send('Poem not found');
    }

    res.status(200).json(updatedPoem);
  } catch (error) {
    console.error('Failed to unlike the poem:', error);
    res.status(500).send('Error unliking the poem');
  }
});


// DELETE route to delete a poem by id
router.delete('/poems/:id', async (req, res) => {
  try {
    const deletedPoem = await Poem.findOneAndDelete({ id: req.params.id });
    if (!deletedPoem) {
      return res.status(404).send();
    }
    res.send(deletedPoem);
  } catch (error) {
    res.status(500).send(error);
  }
});


app.use(express.json()); // Middleware to parse JSON bodies
app.use(router); // Use the poem routes

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});