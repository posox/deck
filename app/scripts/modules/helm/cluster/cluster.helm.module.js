'use strict';

const angular = require('angular');

module.exports = angular.module('spinnaker.cluster.helm', [
  require('./configure/CommandBuilder.js'),
]);
