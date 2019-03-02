'use strict';

const User = require('../models/user');

const Admin = {


  showUsers: {
    handler: async function (request, h) {
      try {
        const users = await User.find();
        const id = request.auth.credentials.id;
        const user = await User.findById(id);
        return h.view('site_users', {title: "Site Users", users: users, user: user})
      } catch (err) {
        return h.view('home', {errors: [{message: err.message}]});
      }
    }
  },

  deleteUser: {
    handler: async function (request, h) {
      try {
        const id = request.auth.credentials.id;
        const user = await User.findById(id);
        // console.log(user._id);
        // console.log(request.params.id);
        // console.log(new String(user._id).valueOf() === new String(request.params.id).valueOf());
        if (!user.admin) {
          const message = 'As a user you don\'t have access';
          throw new Boom(message)

        } else if (new String(user._id).valueOf() === new String(request.params.id).valueOf()) {
          // FIXME there has to be a better way to do this check
          const message = 'You can not delete your self!';
          throw new Boom(message)

        } else {
          console.log('User has been deleted');
          await User.deleteById(request.params.id);
          return h.redirect('/admin/users')
        }
      } catch (err) {
        return h.redirect('/admin/users', {errors: [{message: err.message}]});
      }
    }
  }

};

module.exports = Admin;