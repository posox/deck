'use strict';

const angular = require('angular');

import { SERVER_GROUP_WRITER, TASK_MONITOR_BUILDER, V2_MODAL_WIZARD_SERVICE } from '@spinnaker/core';

module.exports = angular.module('spinnaker.serverGroup.configure.helm.clone', [
  require('@uirouter/angularjs').default,
  SERVER_GROUP_WRITER,
  V2_MODAL_WIZARD_SERVICE,
  TASK_MONITOR_BUILDER,
  require('../configuration.service'),
])
  .controller('helmCloneServerGroupController', function($scope, $uibModalInstance, $q, $state,
                                                         serverGroupWriter, v2modalWizardService, taskMonitorBuilder,
                                                         helmServerGroupConfigurationService,
                                                         serverGroupCommand, application, title, $timeout,
                                                         wizardSubFormValidation) {
    $scope.pages = {
      templateSelection: require('./templateSelection.html'),
      basicSettings: require('./basicSettings.html'),
    };

    $scope.title = title;

    $scope.applicationName = application.name;
    $scope.application = application;

    $scope.command = serverGroupCommand;

    $scope.state = {
      loaded: false,
      requiresTemplateSelection: !!serverGroupCommand.viewState.requiresTemplateSelection,
    };

    $scope.taskMonitor = taskMonitorBuilder.buildTaskMonitor({
      application: application,
      title: 'Creating your server group',
      modalInstance: $uibModalInstance,
    });

    function configureCommand() {
      helmServerGroupConfigurationService.configureCommand(application, serverGroupCommand).then(function () {
        $scope.state.loaded = true;
        $timeout(initializeWizardState);
        initializeWatches();
      });
    }

    function initializeWatches() {
      $scope.watch('command.account', $scope.command.accountChanged);
      $scope.watch('command.namespace', $scope.command.namespaceChanged);
    }

    function initializeWizardState() {
      var mode = serverGroupCommand.viewState.mode;
      if (mode === 'clone' || mode === 'editPipeline') {
        v2modalWizardService.markComplete('location');
      }

      wizardSubFormValidation
        .config({ scope: $scope, form: 'form'})
        .register({page: 'location', subForm: 'basicSettings'});
    }

    this.isValid = function () {
      return $scope.command &&
        $scope.command.account !== null &&
        v2modalWizardService.isComplete() &&
        wizardSubFormValidation.subFormsAreValid();
    };

    this.showSubmitButton = function () {
      return v2modalWizardService.allPagesVisited();
    };

    this.clone = function () {
      if ($scope.command.viewState.mode === 'editPipeline' || $scope.command.viewState.mode === 'createPipeline') {
        return $uibModalInstance.close($scope.command);
      }

      $scope.taskMonitor.submit(
        function () {
          // implement action
          return serverGroupWriter.cloneServerGroup(angular.copy($scope.command), application);
        }
      );
    };

    this.cancel = function () {
      $uibModalInstance.dismiss();
    };

    if (!$scope.state.requiresTemplateSelection) {
      configureCommand();
    } else {
      $scope.state.loaded = true;
    }

    this.templateSelected = () => {
      $scope.state.requiresTemplateSelection = false;
      configureCommand();
    };
  });
