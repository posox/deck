'use strict';

import _ from 'lodash';

const angular = require('angular');

module.exports = angular
  .module('spinnaker.helm.serverGroup.transformer', [])
  .factory('helmServerGroupTransformer', function ($q) {
    function normalizeServerGroup(serverGroup) {
      return $q.when(serverGroup);
    }

    function convertServerGroupCommandToDeployConfiguration(base) {
      var command = _.defaults({backingData: [], viewState: []}, base);
      if (base.viewState.mode !== 'clone') {
        delete command.source;
      }
      command.cloudProvider = 'helm';
      delete command.viewState;
      delete command.backingData;
      delete command.selectedProvider;

      command.region = command.namespace;

      delete command.interestingHealthProviderNames;

      return command;
    }

    return {
      convertServerGroupCommandToDeployConfiguration: convertServerGroupCommandToDeployConfiguration,
      normalizeServerGroup: normalizeServerGroup,
    };
  });
