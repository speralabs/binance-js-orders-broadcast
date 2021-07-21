const joi = require('joi');

const fileConfig = require('../../config/fileConfig');

module.exports.commonFileValidation = joi
  .object()
  .keys({
    size: joi.number().min(1).required(),
    path: joi.string().required(),
    name: joi.string().required(),
    type: joi.string().required(),
  })
  .unknown(true)
  .required();

module.exports.saveFile = joi.object().keys({
  demo_file: this.commonFileValidation,
  dimensions: joi
    .array()
    .items({
      width: joi
        .number()
        .valid(fileConfig.imageProperties.map((size) => size.width))
        .required(),
      height: joi
        .number()
        .valid(fileConfig.imageProperties.map((size) => size.height))
        .required(),
    })
    .when('demo_file.type', {
      is: [fileConfig.imageTypes.map((imageType) => imageType)],
      then: joi.array().required(),
    }),
});
