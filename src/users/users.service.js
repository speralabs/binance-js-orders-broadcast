// import repository
const repository = require('./users.repository');
// import bycrypt to hash the password
const bcrypt = require('bcryptjs');
// generate unique id for conf code
const uniqId = require('uniqid');
const shortid = require('shortid');
// jwt token service
const tokenService = require('../../services/tokenService');
// import mail service
const mailSender = require('../../mailHub/miler');
// object ID for mongodb
const ObjectId = require('mongodb').ObjectID;
// import search field append service
const { query } = require('express');
const appendService = require('../../services/searchFieldAppendService');
// import user status
const { userStatus } = require('../../config/permissionConfig');
// collection name for the errors
const collectionName = 'user';

/**
 * COUNT all data set
 * @input
 * @output {array}
 */
module.exports.count = async (query) => {
  return new Promise(async (resolve, reject) => {
    try {
      const data = await repository.count(query);
      if (!data || data.length === 0) {
        resolve([]);
      } else {
        resolve(data);
      }
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * GET all data set
 * @input
 * @output {array}
 */
module.exports.getAll = async (queryParams) => {
  return new Promise(async (resolve, reject) => {
    let query = { is_deleted: false };

    // search by name
    const appendService = require('../../services/searchFieldAppendService');
    query = appendService.appendQueryParams(queryParams, 'name', query);
    // search by nic
    query = appendService.appendQueryParams(queryParams, 'nic', query);
    // search by email
    query = appendService.appendQueryParams(queryParams, 'email', query);
    // search by role
    query = appendService.appendQueryParams(queryParams, 'role', query, true);

    try {
      const count = await this.count(query);
      const data = await repository.findAll(query, queryParams);
      if (!data || data.length == 0) {
        resolve({
          count,
          value: [],
        });
      } else {
        resolve({
          count,
          value: data,
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * GET single object
 * @input {id}
 * @output {obj}
 */
module.exports.getById = async (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const data = await repository.findById({ _id: id });

      if (!data || data.length == 0) {
        reject(`No data found from given ${collectionName} id`);
      } else {
        resolve(data);
      }
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * GET data from query
 * @input {query}
 * @output {obj}
 */
module.exports.checkByCustomQuery = async (query) => {
  return new Promise(async (resolve, reject) => {
    try {
      const data = await repository.findAll(query);

      if (!data || data.length == 0) {
        resolve([]);
      } else {
        resolve(data);
      }
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * POST object
 * @input {object}
 * @output {object}
 */
module.exports.save = async (obj) => {
  return new Promise(async (resolve, reject) => {
    try {
      // check the user already exist with given phone number or email
      await findUniqueFieldForSave('email', obj.email, 'user');
      await findUniqueFieldForSave('nic', obj.nic, 'user');
      await findUniqueFieldForSave('phone', obj.phone, 'user');

      // generate conf code
      obj.confirmation_code = uniqId();
      // hash the password
      obj.password = createPasswordHash(obj.password);
      const data = await repository.save(obj);
      // send email
      mailSender.welcomeMail(data.email, data.name, data.confirmation_code);
      resolve(data);
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * CREATE USERS BY ADMIN object
 * @input {object}
 * @output {object}
 */
module.exports.create = async (obj) => {
  return new Promise(async (resolve, reject) => {
    try {
      // check the user already exist with given phone number or email
      await findUniqueFieldForSave('email', obj.email, 'user');

      // generate conf code
      obj.confirmation_code = uniqId();
      // hash the password
      const newPassword = shortid.generate();
      obj.password = createPasswordHash(newPassword);
      const data = await repository.save(obj);
      // send email
      mailSender.userCreation(
        data.email,
        data.name,
        newPassword,
        data.confirmation_code
      );
      resolve(data);
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * PUT object
 * @input {objId}
 * @output {object}
 */
module.exports.updateSingleObj = async (obj) => {
  return new Promise(async (resolve, reject) => {
    const id = obj._id;
    delete obj._id;
    try {
      if (obj.email) {
        await findUniqueFieldForUpdate('email', obj.email, id, 'user');
      }
      if (obj.nic) {
        await findUniqueFieldForUpdate('nic', obj.nic, id, 'user');
      }
      if (obj.phone) {
        await findUniqueFieldForUpdate('phone', obj.phone, id, 'user');
      }

      const data = await repository.updateSingleObject(
        { _id: ObjectId(id), is_deleted: false },
        obj
      );

      if (!data) {
        reject(`No data found from given ${collectionName} id`);
      } else {
        resolve(data);
      }
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * DELETE object
 * @input {objId}
 * @output {object}
 */
module.exports.DeleteSingleObject = async (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const data = await repository.updateSingleObject(
        { _id: ObjectId(id), is_deleted: false },
        { is_deleted: true }
      );
      if (!data) {
        reject(`No data found from given ${collectionName} id`);
      } else {
        resolve(data);
      }
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * POST Login
 * @input {object}
 * @output {object}
 */
module.exports.loginWithEmail = async (obj) => {
  return new Promise(async (resolve, reject) => {
    try {
      // check the user exist with given email
      const perviousUserData = await this.checkByCustomQuery({
        email: obj.email,
        is_deleted: false,
      });
      // if there is no previous user found
      if (!perviousUserData || perviousUserData.length == 0) {
        reject(`Invalid email`);
      } else {
        const {
          _id,
          role,
          email,
          phone,
          age,
          name,
          password,
        } = perviousUserData[0];

        // compare password
        if (bcrypt.compareSync(obj.password, password)) {
          // return created token
          resolve(tokenService.toAuthJSON(_id, role, name, email, phone, age));
        } else {
          reject('Invalid password');
        }
      }
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * CONFIRM user by email
 * @input {conf code}
 * @output {obj}
 */
module.exports.confirmUser = async (confCode) => {
  return new Promise(async (resolve, reject) => {
    try {
      // check the user already exist with given phone number or email
      const perviousUserData = await this.checkByCustomQuery({
        confirmation_code: confCode,
        is_deleted: false,
      });

      // if there is no previous user found
      if (!perviousUserData || perviousUserData.length == 0) {
        reject('Invalid confirmation code.');
      } else {
        await this.updateSingleObj({
          _id: perviousUserData[0]._id,
          status: userStatus.confirmed,
        });
        resolve('You have successfully confirm your email!');
      }
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * RESET password
 * @input {obj}
 * @output {obj}
 */
module.exports.resetPassword = async ({ email, password, new_password }) => {
  return new Promise(async (resolve, reject) => {
    try {
      // check the user already exist with given phone number or email
      const perviousUserData = await this.checkByCustomQuery({
        email,
        is_deleted: false,
      });

      // if there is no previous user found
      if (!perviousUserData || perviousUserData.length == 0) {
        reject('Invalid email address');
      } else if (bcrypt.compareSync(password, perviousUserData[0].password)) {
        // hash the password
        const hashedPassword = createPasswordHash(new_password);
        const updatedData = await this.updateSingleObj({
          _id: perviousUserData[0]._id,
          password: hashedPassword,
          is_first_time: false,
        });
        // send email
        mailSender.resetPassword(updatedData.email, updatedData.name);
        resolve(updatedData);
      } else {
        reject('Current password is invalid');
      }
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * FORGET password
 * @input {obj}
 * @output {obj}
 */
module.exports.forgetPassword = async ({ email }) => {
  return new Promise(async (resolve, reject) => {
    try {
      // check the user already exist with given phone number or email
      const perviousUserData = await this.checkByCustomQuery({
        email,
        is_deleted: false,
      });

      // if there is no previous user found
      if (!perviousUserData || perviousUserData.length == 0) {
        reject('Invalid email address');
      } else if (perviousUserData[0].status === userStatus.confirmed) {
        // hash the password
        const newPassword = shortid.generate();
        const hashedPassword = createPasswordHash(newPassword);
        const updatedData = await this.updateSingleObj({
          _id: perviousUserData[0]._id,
          password: hashedPassword,
          is_first_time: true,
        });
        // send email
        mailSender.forgetPassword(
          updatedData.email,
          updatedData.name,
          newPassword
        );
        resolve(updatedData);
      } else {
        reject('Make sure to confirm your email before this action.');
      }
    } catch (error) {
      reject(error);
    }
  });
};

// check unique data for update
const findUniqueFieldForUpdate = async (
  fieldName,
  fieldValue,
  currentId,
  element
) => {
  return new Promise(async (resolve, reject) => {
    try {
      // check the user already exist with given phone number or email
      const query = { is_deleted: false };
      query[fieldName] = fieldValue;
      const perviousUserData = await this.checkByCustomQuery(query);

      // if there is no previous user found
      if (!perviousUserData || perviousUserData.length == 0) {
        resolve('new recode');
      } else if (perviousUserData[0]._id == currentId) {
        resolve('new recode');
      } else {
        reject(`${element} already exist with given ${fieldName}`);
      }
    } catch (error) {
      reject(error);
    }
  });
};

// check unique data for save
const findUniqueFieldForSave = async (fieldName, fieldValue, element) => {
  return new Promise(async (resolve, reject) => {
    try {
      // check the user already exist with given phone number or email
      const query = { is_deleted: false };
      query[fieldName] = fieldValue;
      const perviousUserData = await this.checkByCustomQuery(query);

      // if there is no previous user found
      if (!perviousUserData || perviousUserData.length == 0) {
        resolve('new object');
      } else {
        reject(`${element} already exist with given ${fieldName}`);
      }
    } catch (error) {
      reject(error);
    }
  });
};

// hash the password
let createPasswordHash = (password) => {
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);
  return hash;
};
