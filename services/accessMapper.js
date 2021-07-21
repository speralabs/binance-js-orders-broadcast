module.exports.validity = (role, granted_array) => {
  return new Promise((resolve, reject) => {
    if (
      Array.isArray(granted_array) &&
      granted_array.length !== 0 &&
      granted_array.includes(role)
    ) {
      resolve('granted');
    } else {
      reject('User not authorized to use this route');
    }
  });
};
