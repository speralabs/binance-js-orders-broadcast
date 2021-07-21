// import service
const service = require('./money.service');
// import response service to handle the output
const response = require('../../services/responseService');

// GET all data set
module.exports.getAll = async (req, res) => {
  try {
    const output = await service.getAll();
    return response.successWithData(output, res);
  } catch (error) {
    return response.customError(error, res);
  }
};

// GET single object
module.exports.getOne = async (req, res) => {
  try {
    const output = await service.getById(req.params.id);
    return response.successWithData(output, res);
  } catch (error) {
    return response.customError(error, res);
  }
};

// POST single object
module.exports.postData = async (req, res) => {
  try {
    const output = await service.save(req.body);
    return response.successWithData(output, res);
  } catch (error) {
    return response.customError(error, res);
  }
};

// PUT single object
module.exports.putData = async (req, res) => {
  try {
    const output = await service.updateSingleObj(req.body);
    return response.successWithData(output, res);
  } catch (error) {
    return response.customError(error, res);
  }
};

// Delete single object
module.exports.deleteData = async (req, res) => {
  try {
    const output = await service.DeleteSingleObject(req.params.id);
    return response.successWithData(output, res);
  } catch (error) {
    return response.customError(error, res);
  }
};
