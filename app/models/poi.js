'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const poiSchema = new Schema({
  name: String,
  description: String,
  geo: {
    lat: Number,
    long: Number
  },
  image: String,
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category'
  }
});

poiSchema.statics.findById = function(id){
  return this.findOne({_id: id});
};

poiSchema.statics.deleteById = function(id){

  console.log('Page brake');
  console.log(id);

  this.findOneAndDelete({_id: id}, function(err) {
    if (err)
      console.log(err);
    else
      console.log("Entry has been deleted");
  });

};


module.exports = mongoose.model('Poi', poiSchema);
