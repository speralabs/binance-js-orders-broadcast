//import validator class
const joi = require('joi');
//import json web token library
const jwt = require('jsonwebtoken');
//import json web token secret
const secret = require('../config').secret;
//import response class
const response = require('../services/responseService');
// import permission class
const permission = require('../services/accessMapper');

const formidable = require('formidable');
const fileConfig = require('../config/fileConfig');

// validate token
const getTokenFromHeader = (req) => {
  if (
    (req.headers.authorization &&
      req.headers.authorization.split(' ')[0] === 'Token') ||
    (req.headers.authorization &&
      req.headers.authorization.split(' ')[0] === 'Bearer')
  ) {
    return req.headers.authorization.split(' ')[1];
  }

  return null;
};

/**
 * validate the API request body according to the schema defined and validate the token
 * @returns validation Status
 * @param {*} schema , header tokens
 */
module.exports.validateBodyWithToken = function (schema, granted_array) {
  return (req, res, next) => {
    // extract headers from request and return
    //validate the API request body according to the schema defined
    const result = joi.validate(req.body, schema);
    if (result.error) {
      return response.customError(result.error.details[0].message, res);
    } else {
      // verify token and check the expiration time.
      jwt.verify(getTokenFromHeader(req), secret, async (err, decoded) => {
        if (err) {
          return response.customError('Invalid token', res);
        } else {
          try {
            const val = await permission.validity(decoded.role, granted_array);
            next();
          } catch (error) {
            return response.customError(error, res);
          }
        }
      });
    }
  };
};

/**
 * Validate the query parameters in the API request
 * @param schema
 * @returns {Function}
 */
module.exports.validateQueryParameters = function (schema) {
  return (req, res, next) => {
    // Validate the API request's query parameters according to the schema defined
    const result = joi.validate(req.query, schema);
    if (result.error) {
      return response.customError(result.error.details[0].message, res);
    } else {
      next();
    }
  };
};

/**
 * validate the API request body according to the schema defined
 * @returns validation Status
 * @param {*} schema
 */
module.exports.validateBody = function (schema) {
  return (req, res, next) => {
    //validate the API request body according to the schema defined
    const result = joi.validate(req.body, schema);
    if (result.error) {
      return response.customError(result.error.details[0].message, res);
    } else {
      next();
    }
  };
};
/**
 * validate the API request header
 * @returns validation Status
 * @param {*} schema
 */
module.exports.validateHeader = function (granted_array) {
  return (req, res, next) => {
    //verify token and check the expiration time.
    jwt.verify(getTokenFromHeader(req), secret, async (err, decoded) => {
      if (err) {
        return response.customError('Invalid token', res);
      } else {
        try {
          const val = await permission.validity(decoded.role, granted_array);
          next();
        } catch (error) {
          return response.customError(error, res);
        }
      }
    });
  };
};

/**
 * set language from header to body
 * @returns validation Status
 * @param {*} schema
 */
module.exports.setLanguageToBody = () => {
  return (req, res, next) => {
    if (req.headers['accept-language']) {
      req.body['language'] = req.headers['accept-language'];
    }
    next();
  };
};

/**
 * set language from header to query params
 * @returns validation Status
 * @param {*} schema
 */
module.exports.setLanguageToQueryParams = () => {
  return (req, res, next) => {
    if (req.headers['accept-language']) {
      req.query['language'] = req.headers['accept-language'];
    }
    next();
  };
};

/**
 * validate form data
 * @returns validation Status
 * @param {*} schema
 */
module.exports.validateFormData = (schema) => async (req, res, next) => {
  const form = formidable({
    maxFileSize: fileConfig.maxFileSize,
  });
  const formFields = await new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) {
        reject(err);
        return response.customError(`${err}`, res);
      }

      resolve({ fields, files });
      return null;
    });
  });

  const data = {
    ...formFields.fields,
    ...formFields.files,
  };

  Object.entries(data).forEach((entry) => {
    const key = entry[0];
    try {
      data[key] = JSON.parse(data[key]);
    } catch (error) {
      // continue regardless of error
    }
  });

  const result = schema.validate(data);

  if (result.error) {
    return response.customError(result.error.details[0].message, res);
  }
  req.body = data;
  next();
  return null;
};

/**
 * Validate route parameters
 * @param schema
 * @returns {function(...[*]=)}
 */
module.exports.validateRouteParameters = function (schema) {
  // eslint-disable-next-line consistent-return
  return (req, res, next) => {
    const result = schema.validate(req.params);
    if (result.error) {
      return response.customError(result.error.details[0].message, res);
    }

    next();
  };
};
