 const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/WordEther';


mongoose.connect(MONGODB_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

module.exports = mongoose; 
 