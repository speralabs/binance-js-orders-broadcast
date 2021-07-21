// import sanitization service
const sanitization = require('./sanitizationService');

module.exports.appendQueryParams = (
  queryParam,
  field,
  query,
  exact = false,
  needSanitization = true
) => {
  if (
    queryParam[field] !== undefined &&
    queryParam[field] !== null &&
    queryParam[field] !== ''
  ) {
    const variable = needSanitization
      ? sanitization.sanitizeCharacters(queryParam[field])
      : queryParam[field];
    query[field] = exact
      ? variable
      : {
          $regex: variable,
        };
  }
  return query;
};
