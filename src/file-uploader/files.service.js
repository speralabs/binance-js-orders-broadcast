const jimp = require('jimp');
const { v4: uuidv4 } = require('uuid');
// import file reading service
const fs = require('fs');
// import repository
const repository = require('./files.repository');
// import image config
const fileConfig = require('../../config/fileConfig');

/**
 * Resize image
 * @param filePath
 * @param resizingPath
 * @param height
 * @param width
 * @returns {Promise<void>}
 */
const resizeImage = async (filePath, resizingPath, width, height) => {
  const image = await jimp.read(filePath);
  await image
    .resize(parseInt(width, 10), parseInt(height, 10))
    .quality(fileConfig.imageResizeQuality)
    .writeAsync(resizingPath);
};

/**
 * Delete file from storage
 * @param id
 * @returns {Promise<void>}
 */
const deleteFileObject = async (id) => {
  let filePath;
  const data = await repository.findfileById(id);

  if (!data) {
    throw new Error('File not found.');
  }

  const extension = data.new_filename.substring(
    data.new_filename.lastIndexOf('.') + 1,
    data.new_filename.length
  );

  // If image
  if (
    fileConfig.imageTypes.some((imageType) => imageType.includes(extension))
  ) {
    fileConfig.imageProperties.forEach((property) => {
      filePath = `${fileConfig.fileSavePath}${property.location}${data.new_filename}`;
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    });
  } else {
    filePath = `${fileConfig.fileSavePath}${data.new_filename}`;
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
};

/**
 * Save file
 * @param file
 * @returns {Promise<unknown>}
 */
module.exports.saveFile = async (file) => {
  const uid = uuidv4();
  const oldPath = file.body.demo_file.path;
  const originalFilename = file.body.demo_file.name;
  const extension = originalFilename.substring(
    originalFilename.lastIndexOf('.'),
    originalFilename.length
  );
  const newFilename = `${uid}${extension}`;
  let newPath = `${fileConfig.fileSavePath}${newFilename}`;

  // If it is an image
  if (fileConfig.imageTypes.includes(file.body.demo_file.type)) {
    // Save to selected sizes
    file.body.dimensions.forEach(async (dimension) => {
      newPath = `${fileConfig.fileSavePath}${dimension.width}x${dimension.height}/${newFilename}`;

      // Save file in location
      fs.copyFileSync(oldPath, newPath);

      await resizeImage(newPath, newPath, dimension.width, dimension.height);
    });
    return repository.save({
      new_filename: newFilename,
      original_filename: originalFilename,
    });
  }

  // save file
  fs.renameSync(oldPath, newPath);

  return repository.save({
    new_filename: newFilename,
    original_filename: originalFilename,
  });
};

/**
 * DELETE object
 * @input {objId}
 * @output {object}
 */
module.exports.deleteFile = async (id) => {
  // delete file object
  await deleteFileObject(id);

  // delete file from db
  const data = repository.removefile({ _id: id });

  if (!data) {
    throw new Error(`No data found.`);
  }
};
