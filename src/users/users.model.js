// import mongoose
const mongoose = require('mongoose');
const { number } = require('joi');
// declare model name
const model_name = 'user';
// import permission list
const permissionList = require('../../config/permissionConfig').userRoles;
// import user status
const { userStatus } = require('../../config/permissionConfig');

// create schema
const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
    },
    nic: {
      type: String,
    },
    address: {
      type: String,
      trim: true,
    },
    password: {
      type: String,
      trim: true,
      required: true,
    },
    email: {
      type: String,
      lowercase: true,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
      unique: true,
    },
    role: {
      type: String,
      required: true,
      default: permissionList.customer,
      trim: true,
    },
    confirmation_code: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      default: userStatus.notConfirmed,
      trim: true,
    },
    is_active: {
      type: Boolean,
      default: true,
    },
    is_first_time: {
      type: Boolean,
      default: true,
    },
    is_deleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

// create modal
const model = mongoose.model(model_name, schema);
module.exports = model;
