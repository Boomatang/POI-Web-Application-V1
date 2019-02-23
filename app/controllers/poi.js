'use strict';

const Poi = require('../models/poi');

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

};

module.exports = POI;
