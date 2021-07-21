const joi = require('joi');

module.exports.id = joi.object().keys({
  id: joi.string().alphanum().min(24).max(24).required(),
});
