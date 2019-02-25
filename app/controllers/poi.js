'use strict';

const Poi = require('../models/poi');
const cloudinary = require('cloudinary');
const fs = require('fs');

const POI = {
  home: {
    handler: async  function (request, h) {
      const pois = await Poi.find();
      return h.view('home', {title: 'View POI\'s', pois: pois})
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

        const new_image = payload.fileUpload.toString('utf8');

        // const image = await cloudinary.uploader.upload(new_image, {"tags":"basic_sample","width":500,"height":500,"crop":"fit"});

        const upload_stream = cloudinary.uploader.upload_stream({tags: 'sample'}, function(err){
          if (err){
            console.log(err);
          }
        });

        console.log(new_image);

        const image = fs.createReadStream(new_image).pipe(upload_stream);
        console.log(image);

        poi.image = image.secure_url;


        await poi.save();

        return h.redirect('/home');
      } catch (err) {
        return h.view('create_poi', {title: "Create POI - Error", errors: [{message: err.message}]});
      }
    }
  },
  showCreate: {
    handler: async function (request, h) {
      return h.view('create_poi', {title: 'Create POI'});
    }
  },
  view: {
    handler: async function(request, h){
      let place = await Poi.findById(request.params.id);
      console.log(place);
      return h.view('view_poi', {title: place.name, poi: place})
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


      return h.view('update_poi', {title: 'Update' + place.name, poi: place})
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
