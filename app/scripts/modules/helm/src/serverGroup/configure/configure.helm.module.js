'use strict';

const angular = require('angular');

module.exports = angular.module('spinnaker.serverGroup.configure.helm', [
  require('./configuration.service.js').name,
  require('./CommandBuilder.js').name,
  require('./wizard/BasicSettingsController.js').name,
  require('./wizard/Clone.controller.js').name,
]);
