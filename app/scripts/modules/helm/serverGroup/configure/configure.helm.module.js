'use strict';

const angular = require('angular');

module.exports = angular.module('spinnaker.serverGroup.configure.helm', [
  require('./configuration.service.js'),
  require('./CommandBuilder.js'),
  require('./wizard/BasicSettingsController.js'),
  require('./wizard/Clone.controller.js'),
]);
