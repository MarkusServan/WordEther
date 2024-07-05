
const express = require('express'); 
const cors = require('cors');
const app = express();
app.use(cors({origin: 'http://localhost:3000'}));

//const express = require('express');
const Poem = require('./poemModel.js'); // Adjust the path as necessary
const router = express.Router();


router.post('/poems', async (req, res) => {
  try {
    const newPoem = new Poem({
      id: req.body.id,
      data: req.body.data,
      date: req.body.date
    });
    await newPoem.save();
    res.status(201).send(newPoem);
  } catch (error) {app.use(cors({origin: 'http://localhost:3000'}));
    res.status(400).send(error);
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