// import validator image Schemas
const express = require('express');
const fileSchema = require('./file.schema');

// import controllers
const controller = require('./files.controller');
// import Validator class
const validator = require('../../validators/validator');
const joiConfig = require('../../config/joiConfig');

const router = express.Router();

const { filesAdd, filesDelete } = require('./files.permission').permission_list;

// create file
router
  .route(filesAdd.path)
  .post(
    validator.validateHeader(filesAdd.granted),
    validator.validateFormData(fileSchema.saveFile),
    controller.saveFile
  );

// delete file
router
  .route(filesDelete.path)
  .delete(
    validator.validateHeader(filesDelete.granted),
    validator.validateRouteParameters(joiConfig.id),
    controller.deleteFile
  );

module.exports = router;
