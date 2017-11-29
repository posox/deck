'use strict';

const angular = require('angular');
import _ from 'lodash';

import {
  CONFIRMATION_MODAL_SERVICE,
  SERVER_GROUP_READER,
  SERVER_GROUP_WARNING_MESSAGE_SERVICE,
  SERVER_GROUP_WRITER,
} from '@spinnaker/core';

module.exports = angular.module('spinnaker.serverGroup.details.helm.controller', [
  require('@uirouter/angularjs').default,
  require('../configure/configure.helm.module.js'),
  SERVER_GROUP_READER,
  SERVER_GROUP_WRITER,
  require('../paramsMixin.js'),
  SERVER_GROUP_WARNING_MESSAGE_SERVICE,
  CONFIRMATION_MODAL_SERVICE,
])
  .controller('helmServerGroupDetailsController', function ($scope, $state, app, serverGroup,
                                                            serverGroupReader, serverGroupWriter, helmServerGroupParamsMixin,
                                                            serverGroupWarningMessageService, confirmationModalService) {
    let application = this.application = app;

    $scope.state = {
      loading: true
    };

    function extractServerGroupSummary() {
      var summary = _.find(application.serverGroups.data, function (toCheck) {
        return toCheck.name === serverGroup.name && toCheck.account === serverGroup.accountId && toCheck.region === serverGroup.region;
      });
      return summary;
    }

    function retrieveServerGroup() {
      var summary = extractServerGroupSummary();
      return serverGroupReader.getServerGroup(application.name, serverGroup.accountId, serverGroup.region, serverGroup.name).then(function (details) {
        cancelLoader();

        angular.extend(details, summary);

        $scope.serverGroup = details;
      },
        autoClose
      );
    }

    function autoClose() {
      if ($scope.$$destroyed) {
        return;
      }
      $state.params.allowModalToStayOpen = true;
      $state.go('^', null, {location: 'replace'});
    }

    function cancelLoader() {
      $scope.state.loading = false;
    }

    retrieveServerGroup().then(() => {
      if (!$scope.$$destroyed) {
        app.serverGroups.onRefresh($scope, retrieveServerGroup);
      }
    });

    this.destroyServerGroup = () => {
      var serverGroup = $scope.serverGroup;

      var taskMonitor = {
        application: application,
        title: 'Destroying ' + serverGroup.name,
      };

      var submitMethod = (params) => serverGroupWriter.destroyServerGroup(
        serverGroup,
        application,
        angular.extend(params, helmServerGroupParamsMixin.destroyServerGroup(serverGroup, application))
      );

      var stateParams = {
        name: serverGroup.name,
        accountId: serverGroup.account,
        namespace: serverGroup.namespace
      };

      var confirmationModalParams = {
        header: 'Really destroy ' + serverGroup.name + '?',
        buttonText: 'Destroy ' + serverGroup.name,
        account: serverGroup.account,
        taskMonitorConfig: taskMonitor,
        submitMethod: submitMethod,
        askForReason: true,
        onTaskComplete: () => {
          if ($state.includes('**.serverGroup', stateParams)) {
            $state.go('^');
          }
        },
      };

      serverGroupWarningMessageService.addDestroyWarningMessage(app, serverGroup, confirmationModalParams);

      confirmationModalService.confirm(confirmationModalParams);
    };

  });
