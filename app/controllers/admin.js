'use strict';

const User = require('../models/user');

const Admin = {


  showUsers: {
    handler: async function (request, h) {
      try {
        const users = await User.find();
        const id = request.auth.credentials.id;
        const user = await User.findById(id);
        return h.view('site_users', {title: "Site Users", users: users, user:user})
      } catch (err) {
        return h.view('home', {errors: [{message: err.message}]});
      }
    }
  },

};

module.exports = Admin;