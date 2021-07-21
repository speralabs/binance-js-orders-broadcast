const fs = require('fs');
const config = require('../config/config');

module.exports.returOptionSSL = function () {
  return {
    key: fs.readFileSync(config.sslPrivKeyPath),
    cert: fs.readFileSync(config.sslCertKeyPath),
  };
};
