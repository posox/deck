'use strict';

const angular = require('angular');

module.exports = angular
  .module('spinnaker.helm.serverGroup.paramsMixin', [])
  .factory('helmServerGroupParamsMixin', function () {

    function destroyServerGroup(serverGroup) {
      return {
        namespace: serverGroup.region
      };
    }

    function disableServerGroup(serverGroup) {
      return {
        namespace: serverGroup.region
      };
    }

    return {
      destroyServerGroup: destroyServerGroup,
      disableServerGroup: disableServerGroup,
    };
  });
