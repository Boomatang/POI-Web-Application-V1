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
  },
  image: String
});

poiSchema.statics.findById = function(id){
  return this.findOne({_id: id});
};

poiSchema.statics.deleteById = function(id){

  console.log('Page brake');
  console.log(id);

  this.deleteOne({name: 'Place 1'});

};


module.exports = mongoose.model('Poi', poiSchema);
