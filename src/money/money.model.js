// import mongoose
const mongoose = require('mongoose');
// declare model name
const model_name = 'money';

// create schema
const schema = new mongoose.Schema({
  user_id: {
    type: String,
    trim: true,
  },
  trade_id: {
    type: String,
    trim: true,
  },
  status: {
    type: String,
    trim: true,
  },
  pair: {
    type: String,
    trim: true,
  },
  type: {
    type: String,
    trim: true,
  },
  price: {
    type: String,
    trim: true,
  },
  position_side: {
    type: String,
    trim: true,
  },
  trade_type: {
    type: String,
    trim: true,
  },
  exchange_price: {
    type: String,
    trim: true,
  },
  created_at: {
    type: Date,
    default: new Date(),
  },
  updated_at: {
    type: Date,
    default: new Date(),
  },
});

// create modal
const model = mongoose.model(model_name, schema);
module.exports = model;
