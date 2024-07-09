const mongoose = require('./db'); // Import the db connection
const poemSchema = new mongoose.Schema({
  data: String,
  likes: { type: Number, default: 0 }
});

const poem = mongoose.model('Poem', poemSchema);

module.exports = poem;
