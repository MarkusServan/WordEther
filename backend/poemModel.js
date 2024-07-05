const mongoose = require('./db'); // Import the db connection

const poemSchema = new mongoose.Schema({
  id: Number,
  data: String,
  date: Number
});

const poem = mongoose.model('Poem', poemSchema);

module.exports = poem;
