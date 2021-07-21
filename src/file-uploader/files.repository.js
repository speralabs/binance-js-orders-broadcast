// import model
const Model = require('./files.model');

// Save file Data
module.exports.save = (obj) => {
  return new Promise((resolve, reject) => {
    new Model(obj)
      .save()
      .then((data) => {
        return resolve(data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

// Delete file Data
module.exports.removefile = (query) => {
  return new Promise((resolve, reject) => {
    Model.findOneAndRemove(query)
      .then((data) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

// get By file Id
module.exports.findfileById = (query) => {
  return new Promise((resolve, reject) => {
    Model.findById(query)
      .then((data) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
