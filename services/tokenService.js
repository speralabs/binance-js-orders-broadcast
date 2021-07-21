// Import jwt Library
const jwt = require('jsonwebtoken');
// Import Token Secret
const { secret } = require('../config');

module.exports = {
  // return jwt token
  toAuthJSON(id, role, name, email, phone, age) {
    return jwt.sign(
      {
        user_id: id,
        name,
        role,
        phone,
        email,
        age,
        exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60 * 365, // set token expiration time to one minute
      },
      secret
    );
  },
};
