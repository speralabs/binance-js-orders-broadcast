// import token service
const path = require('path');
const tokenService = require('./tokenService');

module.exports = {
  badRequest(res) {
    return res.status(422).json({
      status: false,
      msg: 'Unexpected Error!',
    });
  },
  customError(message, res) {
    return res.status(422).json({
      status: false,
      msg: message,
    });
  },
  errorConfirmation(res) {
    res.sendFile(path.resolve(`${__dirname}/../htmlResponse/errorMsg.html`));
  },
  customErrorWithoutCode(message, res) {
    return res.json({
      status: true,
      msg: message,
    });
  },
  successWithData(data, res) {
    return res.json({
      status: true,
      data,
    });
  },
  successWithPaginationData(data, res) {
    return res.json({
      status: true,
      data: {
        count: data.count,
        statusCode: res.statusCode,
        value: data.value,
      },
    });
  },
  successWithMessage(message, res) {
    return res.json({
      status: true,
      msg: message,
    });
  },
  successConfirmation(res) {
    res.sendFile(
      path.resolve(`${__dirname}/../htmlResponse/successfulConfirmation.html`)
    );
  },
  successTokenWithData(data, res) {
    return res.json({
      status: true,
      data,
      token: tokenService.toAuthJSON(
        data._id,
        data.email,
        data.role,
        data.firstName,
        data.lastName
      ),
    });
  },
};
