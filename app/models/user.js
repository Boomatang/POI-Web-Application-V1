'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  firstName: String,
  lastName: String,
  email: String,
  password: String,
  admin: Boolean
});

userSchema.statics.findByEmail = function(email) {
  return this.findOne({email: email});
};

userSchema.statics.deleteById = function(id) {

  console.log(`Deleting user document ${id}`);

  this.findOneAndDelete({_id: id}, function (err) {
    if (err)
      console.log(err);
    else
      console.log("Entry has been deleted");
  });
}

userSchema.methods.comparePassword = function(candidatePassword){
  const isMatch = this.password === candidatePassword;
  if (!isMatch){
    throw  new Boom('Password mismatch')
  }
  return this;
};

module.exports = mongoose.model('User', userSchema);

