'use strict';

const Joi = require('joi');
const Poi = require('../models/poi');
const User = require('../models/user');
const Category = require('../models/category');
const cloudinary = require('cloudinary');
const fs = require('fs');
const unidv4 = require('uuid/v4');

const POI = {
  home: {
    handler: async  function (request, h) {

      const id = request.auth.credentials.id;
      const user = await User.findById(id);

      const pois = await Poi.find().populate('category');
      // TODO I was going to display the poi under their categories
      //  but I didn't know how to set the initdata.json file up to do this.

      return h.view('home', {title: 'View POI\'s', user: user, pois: pois})
    }
  },
  create: {
    validate: {
      payload: {
        name: Joi.string().required(),
        description: Joi.string().required(),

        lat: Joi.string().required(),
        long: Joi.string().required(),

        coastalZone: Joi.string().required(),
        fileUpload: Joi.object()
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
    handler: async function (request, h) {
      try {
        const payload = request.payload;
        console.log(payload);
        const category = await Category.findById(payload.coastalZone);
        let poi = new Poi({
          name: payload.name,
          description: payload.description,
          category: category,
          geo: {
            lat: payload.lat,
            long: payload.long
          }
        });


        const file_name = unidv4() + '.jpg';
        const new_image = payload.fileUpload;
        fs.writeFile(file_name, new_image, 'binary', function(err) {
          if (err)
            console.log(err);
          else
            console.log("The file was saved!");
        });


        const image = await cloudinary.uploader.upload(file_name, {
          "tags":"basic_sample",
          "width":500,
          "height":500,
          "crop":"fit"
        });

        poi.image = image.secure_url;


        await poi.save();
        fs.unlink(file_name, (err) => {
          if (err) throw err;
          console.log(`${file_name} was deleted`);
        });

        category.poi.push(poi);
        await category.save();

        return h.redirect('/home');
      } catch (err) {
        console.log(err);
        return h.view('create_poi', {title: "Create POI - Error", errors: [{message: err.message}]});
      }
    }
  },
  showCreate: {
    handler: async function (request, h) {
      const id = request.auth.credentials.id;
      const user = await User.findById(id);
      const zones = await Category.find();

      return h.view('create_poi', {title: 'Create POI', user: user, zones: zones});
    }
  },
  view: {
    handler: async function(request, h){
      let place = await Poi.findById(request.params.id).populate('category');
      console.log(place);

      const id = request.auth.credentials.id;
      const user = await User.findById(id);

      return h.view('view_poi', {title: place.name, user:user, poi: place})
    }
  },

  delete_poi: {
    handler: async function(request, h){

      await Poi.deleteById(request.params.id);

      return h.redirect('/home')
    }
  },

  show_update_poi: {
    handler: async function(request, h){

      const id = request.auth.credentials.id;
      const user = await User.findById(id);

      let place = await Poi.findById(request.params.id);
      const zones = await Category.find();

      return h.view('update_poi', {
        title: 'Update' + place.name,
        user: user,
        poi: place,
        zones: zones})
    }
  },

  update_poi: {
    validate: {
      payload: {
        name: Joi.string().required(),
        description: Joi.string().required(),

        lat: Joi.string().required(),
        long: Joi.string().required(),

        coastalZone: Joi.string().required(),
        fileUpload: Joi.object()
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

      const payload = request.payload;
      const place = await Poi.findById(request.params.id);
      const category = await Category.findById(payload.coastalZone);

      place.name = payload.name;
      place.description = payload.description;
      place.category = category;
      place.geo.lat = payload.lat;
      place.geo.long = payload.long;

      await place.save();

      return h.redirect(`/poi/${place._id}`)
    }
  }

};

module.exports = POI;
