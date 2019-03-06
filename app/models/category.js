'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categorySchema = new Schema({
  name: String,
  poi: [{
    type: Schema.Types.ObjectId,
    ref: 'Poi'
  }]
});

categorySchema.statics.findById = function(id) {
  return this.findOne({_id: id});
};

categorySchema.statics.findByName = function(name) {
  return this.findOne({name: name});
};

module.exports = mongoose.model('Category', categorySchema);
