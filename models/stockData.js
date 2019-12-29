const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const stockDataSchema = new Schema({
  stock: {
    type: String,
    minlength: [1, 'The value of path `{PATH}` (`{VALUE}`) is shorter than the minimum allowed length ({MINLENGTH}).'],
    maxlength: [5, 'The value of path `{PATH}` (`{VALUE}`) is longer than the maximum allowed length ({MINLENGTH}).'],
    required: '{PATH} is required!'
  },
  likes: {
    type: Number,
    default: 0  },
  ipLikes: {
    type: Array,
    default: []
  }
})

module.exports = mongoose.model('stockData', stockDataSchema);