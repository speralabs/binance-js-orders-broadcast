const fs = require('fs');
const sharp = require('sharp');
const imageDownloadPath = require('../config/config').imageDownloadPth;
const imageProperties = require('../config/fileConfig').properties;

module.exports.resize = function (image, callBack) {
  const resize = (size) =>
    sharp(`${imageDownloadPath}${image}`)
      .resize(size.width, size.height)
      .toFile(`${imageDownloadPath}${size.location}${image}`);

  Promise.all(imageProperties.map(resize)).then(() => {
    callBack(true);
  });
};
