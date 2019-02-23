'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const POI = require('../models/poi');

const poiSchema = new Schema({
  name: String,
  description: String,
  coastalZone: String,
  geo: {
    lat: Number,
    long: Number
  }
});

module.exports = mongoose.model('Poi', poiSchema);
