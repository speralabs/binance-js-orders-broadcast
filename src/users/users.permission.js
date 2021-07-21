// import permission list
const {
  admin,
  customer,
  staff,
} = require('../../config/permissionConfig').userRoles;

module.exports.permission_list = {
  users_get_all: {
    path: '/',
    granted: [admin],
  },
  users_get_by_id: {
    path: '/:id',
  },
  users_save: {
    path: '/',
  },
  users_create: {
    path: '/create',
    granted: [admin],
  },
  users_login_email: {
    path: '/login',
  },
  users_forget_password: {
    path: '/forget-password',
  },
  users_reset_password: {
    path: '/reset-password',
    granted: [admin, customer, staff],
  },
  users_confirmation: {
    path: '/confirm/:id',
  },
  users_update: {
    path: '/',
    granted: [admin, customer, staff],
  },
  users_remove: {
    path: '/:id',
    granted: [admin],
  },
};
