'use strict';

const POI = require('./app/controllers/poi');
const Accounts = require('./app/controllers/accounts');

module.exports = [
  {method: 'GET', path: '/home', config: POI.home},
  {method: 'GET', path: '/poi/create', config: POI.showCreate},
  {method: 'POST', path: '/poi/create', config: POI.create},

  {method: 'GET', path: '/', config: Accounts.index},
  { method: 'GET', path: '/signup', config: Accounts.showSignup },
  { method: 'GET', path: '/login', config: Accounts.showLogin },
  { method: 'GET', path: '/logout', config: Accounts.logout },
  { method: 'POST', path: '/signup', config: Accounts.signup },
  { method: 'POST', path: '/login', config: Accounts.login },

  { method: 'GET', path: '/settings', config: Accounts.showSettings },
  { method: 'POST', path: '/settings', config: Accounts.updateSettings },

  {
    method: 'GET',
    path: '/{param*}',
    handler: {
      directory: {
        path: './public'
      }
    },
    options: { auth: false }
  }
];
