// import service
const service = require('./users.service');
// import response service to handle the output
const {
  successWithPaginationData,
  customError,
  successWithData,
  successConfirmation,
  errorConfirmation,
} = require('../../services/responseService');

// GET all data set
module.exports.getAll = async (req, res) => {
  try {
    const output = await service.getAll(req.query);
    return successWithPaginationData(output, res);
  } catch (error) {
    return customError(error, res);
  }
};

// GET single object
module.exports.getOne = async (req, res) => {
  try {
    const output = await service.getById(req.params.id);
    return successWithData(output, res);
  } catch (error) {
    return customError(error, res);
  }
};

// POST single object
module.exports.post = async (req, res) => {
  try {
    const output = await service.save(req.body);
    return successWithData(output, res);
  } catch (error) {
    return customError(error, res);
  }
};

// CREATE single object
module.exports.createUser = async (req, res) => {
  try {
    const output = await service.create(req.body);
    return successWithData(output, res);
  } catch (error) {
    return customError(error, res);
  }
};

// LOGIN
module.exports.login = async (req, res) => {
  try {
    const output = await service.loginWithEmail(req.body);
    return successWithData(output, res);
  } catch (error) {
    return customError(error, res);
  }
};

// PUT single object
module.exports.put = async (req, res) => {
  try {
    const output = await service.updateSingleObj(req.body);
    return successWithData(output, res);
  } catch (error) {
    return customError(error, res);
  }
};

// Delete single object
module.exports.delete = async (req, res) => {
  try {
    const output = await service.DeleteSingleObject(req.params.id);
    return successWithData(output, res);
  } catch (error) {
    return customError(error, res);
  }
};

// Confirm user
module.exports.confUser = async (req, res) => {
  try {
    const output = await service.confirmUser(req.params.id);
    return successConfirmation(res);
  } catch (error) {
    return errorConfirmation(res);
  }
};

// Forget password
module.exports.forgetPassword = async (req, res) => {
  try {
    const output = await service.forgetPassword(req.body);
    return successWithData(output, res);
  } catch (error) {
    return customError(error, res);
  }
};

// Reset password
module.exports.resetPassword = async (req, res) => {
  try {
    const output = await service.resetPassword(req.body);
    return successWithData(output, res);
  } catch (error) {
    return customError(error, res);
  }
};
