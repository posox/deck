'use strict';

let angular = require('angular');

import { ACCOUNT_SERVICE, NAMING_SERVICE } from '@spinnaker/core';

module.exports = angular.module('spinnaker.helm.serverGroupCommandBuilder.service', [
  ACCOUNT_SERVICE,
  NAMING_SERVICE,
  require('../../cluster/cluster.helm.module.js').name,
])
  .factory('helmServerGroupCommandBuilder', function ($q, accountService, namingService,
                                                      helmClusterCommandBuilder) {
    function buildNewServerGroupCommand(application, defaults) {
      var command = helmClusterCommandBuilder.buildNewClusterCommand(application, defaults);
      command.targetSize = 1;

      return $q.when(command);
    }

    function buildNewServerGroupCommandForPipeline() {
      return $q.when(helmClusterCommandBuilder.buildNewClusterCommandForPipeline());
    }

    return {
      buildNewServerGroupCommand: buildNewServerGroupCommand,
      buildNewServerGroupCommandForPipeline: buildNewServerGroupCommandForPipeline,
    };
  });
