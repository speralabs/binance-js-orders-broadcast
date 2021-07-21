// import permission list
const { admin } = require('../../config/permissionConfig').userRoles;

module.exports.permission_list = {
  filesAdd: {
    path: '/',
    granted: [admin],
  },
  filesDelete: {
    path: '/:id',
    granted: [admin],
  },
};
