// import libraries
const axios = require('axios');
var CryptoJS = require('crypto-js');

// config import
const config = require('../config/config');
const BASE_URL = config.baseUrl; // testnet

module.exports.signature = (query_string, secret) => {
  return CryptoJS.HmacSHA256(query_string, secret);
};

module.exports.sendRequest = (method, path, key) => {
  return new Promise(async (resolve, reject) => {
    const url = `${BASE_URL}${path}`;
    axios({
      method: method,
      url: url,
      headers: {
        'X-MBX-APIKEY': key,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      json: true,
    })
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        if (error && error.response && error.response.data) {
          reject(error.response.data);
          return;
        }
        reject(error);
      });
  });
};

module.exports.signedRequest = (api_key, secret, method, path, parameters) => {
  return new Promise(async (resolve, reject) => {
    try {
      parameters['timestamp'] = new Date().getTime();
      let query = this.buildQuery(parameters);
      let signature = this.signature(query, secret);
      resolve(
        await this.sendRequest(
          method,
          `${path}?${query}&signature=${signature}`,
          api_key
        )
      );
    } catch (error) {
      console.log(error);
    }
  });
};

module.exports.buildQueryJson = (params) => {
  return JSON.parse(params);
};

module.exports.buildQuery = (params) => {
  let str = '';
  for (let key in params) {
    if (str != '') {
      str += '&';
    }
    str += key + '=' + encodeURIComponent(params[key]);
  }

  return str;
};
