// import mongoose
const mongoose = require('mongoose');
const { number } = require('joi');
// declare model name
const model_name = 'file';

// create imade Data schema
const schema = new mongoose.Schema(
  {
    new_filename: {
      type: String,
      required: true,
    },
    original_filename: {
      type: String,
      required: true,
    },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

// create modal
const model = mongoose.model(model_name, schema);
module.exports = model;
