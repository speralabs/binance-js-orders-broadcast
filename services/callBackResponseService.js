module.exports = {
  callbackWithData(data) {
    return {
      status: true,
      data,
    };
  },
  callbackWithSucessMessage(message) {
    return {
      status: true,
      data: message,
    };
  },
  callbackWithfalseMessage(message) {
    return {
      status: false,
      data: message,
    };
  },
  callbackWithDefaultError() {
    return {
      status: false,
      data: 'Unknown Error Occoured',
    };
  },
};
