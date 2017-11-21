'use strict';

const angular = require('angular');

import { NAMING_SERVICE, V2_MODAL_WIZARD_SERVICE } from '@spinnaker/core';

module.exports = angular.module('spinnaker.serverGroup.configure.helm.basicSettings', [
  require('@uirouter/angularjs').default,
  require('angular-ui-bootstrap'),
  V2_MODAL_WIZARD_SERVICE,
  NAMING_SERVICE,
])
  .controller('helmServerGroupBasicSettingsController', function($scope, $controller, $uibModalStack, $state,
                                                                 v2modalWizardService, namingService,
                                                                 helmServerGroupConfigurationService) {
    angular.extend(this, $controller('BasicSettingsMixin', {
      $scope: $scope,
      namingService: namingService,
      $uibModalStack: $uibModalStack,
      $state: $state,
    }));
  });
