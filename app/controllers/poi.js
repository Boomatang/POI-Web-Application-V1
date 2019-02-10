'use strict';

const POI = {
  home: {
    handler: function (request, h) {
      return h.view('home', {title: 'View POI\'s'})
    }
  }
};

module.exports = POI;