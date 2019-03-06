'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categorySchema = new Schema({
  name: String,
});

categorySchema.statics.findByName = function(name) {
  return this.findOne({name: name});
};

module.exports = mongoose.model('Category', categorySchema);
