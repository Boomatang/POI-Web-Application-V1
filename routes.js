'use strict';

const POI = require('./app/controllers/poi');

module.exports = [
  {method: 'GET', path: '/', config: POI.home}
];
