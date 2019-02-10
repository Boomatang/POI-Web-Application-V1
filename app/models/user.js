'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  firstName: String,
  lastName: String,
  email: String,
  password: String
});

userSchema.statics.findByEmail = function(email) {
  return this.findOne({email: email});
};

userSchema.methods.comparePassword = function(candidatePassword){
  const isMatch = this.password === candidatePassword;
  if (!isMatch){
    throw  new Boom('Password mismatch')
  }
  return this;
};

module.exports = mongoose.model('User', userSchema);

