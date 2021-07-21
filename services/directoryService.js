const makeDir = require('make-dir');
const fileConfig = require('../config/fileConfig');

/**
 * Create directories
 */
module.exports.createDirectories = () => {
  fileConfig.imageProperties.forEach(size => {
    makeDir(`${fileConfig.fileSavePath}${size.location}`);
  });
};
