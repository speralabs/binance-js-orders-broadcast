// import validator class
const joi = require('joi');
// import permission list
const permissionList = require('../../config/permissionConfig').userRoles;

// add object schema
module.exports.post = joi.object().keys({
  name: joi.string().required(),
  age: joi.number().required(),
  nic: joi.string().required(),
  address: joi.string(),
  password: joi.string().required(),
  email: joi.string().required(),
  phone: joi.string().required(),
  role: joi
    .string()
    .valid(permissionList.customer, permissionList.staff, permissionList.admin),
});

// create object schema
module.exports.create = joi.object().keys({
  name: joi.string().required(),
  age: joi.number(),
  address: joi.string(),
  email: joi.string().required(),
  role: joi
    .string()
    .valid(permissionList.customer, permissionList.staff, permissionList.admin),
});

// update object schema
module.exports.put = joi.object().keys({
  _id: joi.string().required().max(24).min(24),
  name: joi.string(),
  age: joi.number(),
  nic: joi.string(),
  address: joi.string(),
  password: joi.string(),
  email: joi.string(),
  phone: joi.string(),
  role: joi
    .string()
    .valid(permissionList.customer, permissionList.staff, permissionList.admin),
});

// login
module.exports.login = joi.object().keys({
  password: joi.string(),
  email: joi.string(),
});

// reset password
module.exports.resetPassword = joi.object().keys({
  email: joi.string().required(),
  new_password: joi.string().required(),
  password: joi.string().required(),
});

// forget password
module.exports.forgetPassword = joi.object().keys({
  email: joi.string().required(),
});
