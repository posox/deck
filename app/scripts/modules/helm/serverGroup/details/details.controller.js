'use strict';

const angular = require('angular');
import _ from 'lodash';

import {
  SERVER_GROUP_READER,
} from '@spinnaker/core';

module.exports = angular.module('spinnaker.serverGroup.details.helm.controller', [
  require('@uirouter/angularjs').default,
  require('../configure/configure.helm.module.js'),
  SERVER_GROUP_READER,
])
  .controller('helmServerGroupDetailsController', function ($scope, $state, app, serverGroup,
                                                            serverGroupReader) {
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

  });
