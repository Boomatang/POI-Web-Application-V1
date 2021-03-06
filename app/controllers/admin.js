'use strict';

const User = require('../models/user');
const Category = require('../models/category');
const Joi = require('joi');

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
  },

  showCategories: {
    handler: async function(request, h){
      const id = request.auth.credentials.id;
      const user = await User.findById(id);
      if (!user.admin) {
        const message = 'As a user you don\'t have access';
        throw new Boom(message);
      }

      const categories = await Category.find();

      return h.view("category", {user: user, categories: categories})
  }
},

  createCategory: {
    validate: {
      payload: {
        name: Joi.string().required()
      },
      options: {
        abortEarly: false
      },
      failAction: function (request, h, error) {
        return h.view('create_poi', {
          title: 'Create Poi Error',
          errors: error.details
        })
          .takeover()
          .code(400);
      }},
    handler: async function(request, h){
      const id = request.auth.credentials.id;
      const user = await User.findById(id);
      if (!user.admin) {
        const message = 'As a user you don\'t have access';
        throw new Boom(message);
      }

      const payload = request.payload;

      let category = await Category.findByName(payload.name);
      console.log(category);
      if (!category.name) {
        const newCategory = new Category({name: payload.name});
        await newCategory.save();
      }

      return h.redirect('/admin/category')
    }
  },

  removeCategory: {
    handler: async function(request, h){
      const id = request.auth.credentials.id;
      const user = await User.findById(id);
      if (!user.admin) {
        const message = 'As a user you don\'t have access';
        throw new Boom(message);
      }
      return "remove"
    }
  }

};

module.exports = Admin;