// import validator Schemas
const express = require('express');
const schema = require('./users.schema');
// import controllers
const controller = require('./users.controller');
// import Validator class
const validator = require('../../validators/validator');
// Import Express
// user router
const router = express.Router();
// import permission
const {
  users_get_by_id,
  users_get_all,
  users_save,
  users_create,
  users_update,
  users_remove,
  users_login_email,
  users_confirmation,
  users_reset_password,
  users_forget_password,
} = require('./users.permission').permission_list;

// get all
router
  .route(users_get_all.path)
  .get(validator.validateHeader(users_get_all.granted), controller.getAll);
// get single object by id
router.route(users_get_by_id.path).get(controller.getOne);
// post object
router
  .route(users_save.path)
  .post(validator.validateBody(schema.post), controller.post);
// create object
router
  .route(users_create.path)
  .post(
    validator.validateBodyWithToken(schema.create, users_create.granted),
    controller.createUser
  );
// login
router
  .route(users_login_email.path)
  .post(validator.validateBody(schema.login), controller.login);
// update object
router
  .route(users_update.path)
  .put(
    validator.validateBodyWithToken(schema.put, users_update.granted),
    controller.put
  );
// delete object
router
  .route(users_remove.path)
  .delete(validator.validateHeader(users_remove.granted), controller.delete);
// reset password object
router
  .route(users_reset_password.path)
  .post(
    validator.validateBodyWithToken(
      schema.resetPassword,
      users_reset_password.granted
    ),
    controller.resetPassword
  );
// forget password object
router
  .route(users_forget_password.path)
  .post(
    validator.validateBody(schema.forgetPassword),
    controller.forgetPassword
  );
// confirm password
router.route(users_confirmation.path).get(controller.confUser);

module.exports = router;
