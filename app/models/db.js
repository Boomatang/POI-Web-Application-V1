'use strict';

require('dotenv').config();

const Mongoose = require('mongoose');

Mongoose.connect(process.env.db);
const db = Mongoose.connection;

async function seed(){
  var seeder = require('mais-mongoose-seeder')(Mongoose);
  const data = require('./initdata.json');
  const User = require('./user');
  const Poi = require('./poi');
  const Category = require('./category');

  const dbData = await seeder.seed(data, { dropDatabase: false, dropCollections: true });

  console.log(dbData);
}

db.on('error', function (err) {
  console.log(`database connection error: ${err}`);
});

db.on('disconnected', function () {
  console.log('database disconnected')
});

db.once('open', function () {
  console.log(`database connected tp ${this.name} on ${this.host}`);
  seed();
});
