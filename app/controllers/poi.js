'use strict';

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

      return h.view('home', {title: 'View POI\'s', user: user, pois: pois})
    }
  },
  create: {
    handler: async function (request, h) {
      try {
        const payload = request.payload;
        let poi = new Poi({
          name: payload.name,
          description: payload.description,
          coastalZone: payload.coastalZone,
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

      return h.view('create_poi', {title: 'Create POI', user: user});
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

      let place = await Poi.findById(request.params.id);

      const id = request.auth.credentials.id;
      const user = await User.findById(id);

      return h.view('update_poi', {title: 'Update' + place.name, user: user, poi: place})
    }
  },

  update_poi: {
    handler: async function(request, h){

      const edit_place = request.payload;
      const place = await Poi.findById(request.params.id);

      place.name = edit_place.name;
      place.description = edit_place.description;
      place.coastalZone = edit_place.coastalZone;
      place.geo.lat = edit_place.lat;
      place.geo.long = edit_place.long;

      await place.save();

      return h.redirect(`/poi/${place._id}`)
    }
  }

};

module.exports = POI;
